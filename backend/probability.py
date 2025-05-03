from flask import Blueprint, request, jsonify
from db import db, Tire, ParameterLog, AnalysisLog, TireDefect, Defect, Operator
from datetime import datetime
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import pickle

predict_bp = Blueprint('predict', __name__)

# Загрузка модели и scaler
model = load_model('tire_model_defects.h5', custom_objects={
                   'mse': tf.keras.losses.MeanSquaredError()})
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)


def process_prediction(data):
    """Функция для обработки данных, используется в WebSocket и POST"""
    params = [
        data['Diameter'],
        data['Temperature'],
        data['Pressure'],
        data['Time'],
        data['Thickness'],
        data['Mold_Temperature'],
        data['Steam_Pressure'],
        data['Heat_Rate']
    ]

    # Преобразование и нормализация
    params = np.array(params).reshape(1, -1)
    params_scaled = scaler.transform(params)

    # Предсказание
    prediction = model.predict(params_scaled, verbose=0)[0]

    # Формирование результата
    result = {
        'Normal_Prob': int(round(float(prediction[0]), 2) * 100),
        'Bubble_Prob': int(round(float(prediction[1]), 2) * 100),
        'Crack_Prob': int(round(float(prediction[2]), 2) * 100),
        'Uneven_Prob': int(round(float(prediction[3]), 2) * 100),
        'Damage_Prob': int(round(float(prediction[4]), 2) * 100)
    }

    # Анализ параметров (логика из твоего кода)
    issues = []
    d, t, p, tm, th, mt, sp, hr = params[0]

    if d == 15:
        if (t > 195) or (t < 175):
            issues.append({
                "message": f"Температура вулканизации ({t}°C) выше нормы (175–195)",
                "severity": "high"
            })
        if p < 20:
            issues.append({
                "message": f"Давление капсулы ({p} бар) ниже нормы (20–25)",
                "severity": "medium"
            })
        if tm > 40:
            issues.append({
                "message": f"Время вулканизации ({tm} мин) выше нормы (25–40)",
                "severity": "medium"
            })
        if mt < 155 or mt > 175:
            issues.append({
                "message": f"Температура формы ({mt}°C) вне нормы (155–175)",
                "severity": "high"
            })
    elif d == 17:
        if t > 200:
            issues.append({
                "message": f"Температура вулканизации ({t}°C) выше нормы (180–200)",
                "severity": "high"
            })
        if p < 22:
            issues.append({
                "message": f"Давление капсулы ({p} бар) ниже нормы (22–27)",
                "severity": "medium"
            })
        if tm > 45:
            issues.append({
                "message": f"Время вулканизации ({tm} мин) выше нормы (30–45)",
                "severity": "medium"
            })
        if mt < 160 or mt > 180:
            issues.append({
                "message": f"Температура формы ({mt}°C) вне нормы (160–180)",
                "severity": "high"
            })
    elif d == 19:
        if t > 205:
            issues.append({
                "message": f"Температура вулканизации ({t}°C) выше нормы (185–205)",
                "severity": "high"
            })
        if p < 24:
            issues.append({
                "message": f"Давление капсулы ({p} бар) ниже нормы (24–29)",
                "severity": "medium"
            })
        if tm > 50:
            issues.append({
                "message": f"Время вулканизации ({tm} мин) выше нормы (35–50)",
                "severity": "medium"
            })
        if mt < 165 or mt > 185:
            issues.append({
                "message": f"Температура формы ({mt}°C) вне нормы (165–185)",
                "severity": "high"
            })
    else:
        issues.append({
            "message": f"Неизвестный диаметр ({d}) — нормы не определены",
            "severity": "high"
        })

    if th < 9 or th > 13:
        issues.append({
            "message": f"Толщина резины ({th} мм) вне нормы (9–13)",
            "severity": "medium"
        })
    if sp < 12 or sp > 14:
        issues.append({
            "message": f"Давление пара ({sp} бар) вне нормы (12–14)",
            "severity": "medium"
        })
    if hr < 8 or hr > 12:
        issues.append({
            "message": f"Скорость нагрева ({hr}°C/мин) вне нормы (8–12)",
            "severity": "medium"
        })

    result['Issues'] = issues if issues else [{
        "message": "Все параметры в норме",
        "severity": "low"
    }]

    return {
        "params": data,
        "predictions": {
            #'Normal_Prob': result['Normal_Prob'],
            'Bubble_Prob': result['Bubble_Prob'],
            'Crack_Prob': result['Crack_Prob'],
            'Uneven_Prob': result['Uneven_Prob'],
            'Damage_Prob': result['Damage_Prob']
        },
        "warnings": result['Issues']
    }

@predict_bp.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    result = process_prediction(data)

    # 1. Найдём или создадим шину
    serial_number = data.get("Serial_Number", f"AUTO_{datetime.now().isoformat()}")
    tire = Tire.query.filter_by(serial_number=serial_number).first()
    if not tire:
        tire = Tire(serial_number=serial_number)
        db.session.add(tire)
        db.session.commit()

    # 2. Сохраняем параметры в parameter_log
    param_log = ParameterLog(
        tire_id=tire.id,
        diameter=data['Diameter'],
        temperature=data['Temperature'],
        pressure=data['Pressure'],
        time=data['Time'],
        thickness=data['Thickness'],
        mold_temperature=data['Mold_Temperature'],
        steam_pressure=data['Steam_Pressure'],
        heat_rate=data['Heat_Rate']
    )
    db.session.add(param_log)

    # 3. Анализ лог (пока условный оператор с id=1)
    operator = Operator.query.get(1)  # можно потом сделать выбор вручную
    analysis_log = AnalysisLog(
        operator_id=operator.id,
        tire_id=tire.id
    )
    db.session.add(analysis_log)

    # 4. Обработка дефектов
    for defect_key, prob in result['predictions'].items():
        if prob > 20:  # допустим, считаем это дефектом при > 20%
            defect = Defect.query.filter_by(defect_name=defect_key).first()
            if defect:
                tire_defect = TireDefect(
                    tire_id=tire.id,
                    defect_id=defect.id,
                    count=1
                )
                db.session.add(tire_defect)

    # 6. Определим порог вероятности, выше которого считаем, что дефект есть
    threshold = 0  # %

    # 7. Создание записей в tire_defect
    for key, prob in result['predictions'].items():
        if prob >= threshold:
            defect_name_map = {
                'Bubble_Prob': 'Bubbles',
                'Crack_Prob': 'Cracks',
                'Uneven_Prob': 'Uneven',
                'Damage_Prob': 'Damage'
            }

            defect_name = defect_name_map.get(key)
            defect = Defect.query.filter_by(defect_name=defect_name).first()

            if defect:
                tire_defect = TireDefect(tire_id=tire.id, defect_id=defect.id, count=1)
                db.session.add(tire_defect)
                print(f"[LOG] Записан дефект: {defect.defect_name} (вероятность: {prob}%)")

    # 5. Финализируем запись
    db.session.commit()

    print(f"[LOG] В БД записана шина с номером: {tire.serial_number}")
    print(
        f"[LOG] Параметры: Диаметр={param_log.diameter}, Температура={param_log.temperature}, Давление={param_log.pressure}")
    print(f"[LOG] Анализ проведён оператором: {operator.full_name} (смена: {operator.shift})")

    if result['predictions']:
        print(f"[LOG] Предсказанные дефекты (если есть):")
        for defect_key, prob in result['predictions'].items():
            if prob > 20:
                print(f" - {defect_key} ({prob:.2f}%)")
    print("[LOG] Запись завершена\n")

    return jsonify({
        "predictions": result['predictions'],
        "warnings": result['warnings']
    })