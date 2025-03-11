from flask import Blueprint, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler
from flask_cors import CORS
import numpy as np
import pickle

predict_bp = Blueprint('predict', __name__)


# Загрузка модели и scaler
model = load_model('tire_model_defects.h5', custom_objects={
                   'mse': tf.keras.losses.MeanSquaredError()})
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Endpoint и предсказания


@predict_bp.route('/predict', methods=['POST'])
def predict():
    # Получение данных из запроса
    data = request.get_json()

    # Извлечение параметров в нужном порядке
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

    # Преобразование в массив и нормализация
    params = np.array(params).reshape(1, -1)  # 1 строка, 8 столбцов
    params_scaler = scaler.transform(params)  # Нормализация как при обучении

    # Предсказания
    # Предсказания для одного примера
    prediction = model.predict(params_scaler, verbose=0)[0]

    # Формирование ответа
    result = {
        'Normal_Prob': float(prediction[0]),
        'Bubble_Prob': float(prediction[1]),
        'Crack_Prob': float(prediction[2]),
        'Uneven_Prob': float(prediction[3]),
        'Damage_Prob': float(prediction[4])
    }

    # Анализ параметров
    issues = set()
    d, t, p, tm, th, mt, sp, hr = params[0]

    # Нормы для Diameter
    if d == 15:
        if t > 195:
            issues.add(
                f"Температура вулканизации ({t}°C) выше нормы (175–195)")
        if p < 20:
            issues.add(f"Давление капсулы ({p} бар) ниже нормы (20–25)")
        if tm > 40:
            issues.add(f"Время вулканизации ({tm} мин) выше нормы (25–40)")
        if mt < 155 or mt > 175:
            issues.add(f"Температура формы ({mt}°C) вне нормы (155–175)")
    elif d == 17:
        if t > 200:
            issues.add(
                f"Температура вулканизации ({t}°C) выше нормы (180–200)")
        if p < 22:
            issues.add(f"Давление капсулы ({p} бар) ниже нормы (22–27)")
        if tm > 45:
            issues.add(f"Время вулканизации ({tm} мин) выше нормы (30–45)")
        if mt < 160 or mt > 180:
            issues.add(f"Температура формы ({mt}°C) вне нормы (160–180)")
    elif d == 19:
        if t > 205:
            issues.add(
                f"Температура вулканизации ({t}°C) выше нормы (185–205)")
        if p < 24:
            issues.add(f"Давление капсулы ({p} бар) ниже нормы (24–29)")
        if tm > 50:
            issues.add(f"Время вулканизации ({tm} мин) выше нормы (35–50)")
        if mt < 165 or mt > 185:
            issues.add(f"Температура формы ({mt}°C) вне нормы (165–185)")
    else:
        issues.add(f"Неизвестный диаметр ({d}) — нормы не определены")

    # Общие нормы
    if th < 9 or th > 13:
        issues.add(f"Толщина резины ({th} мм) вне нормы (9–13)")
    if sp < 12 or sp > 14:
        issues.add(f"Давление пара ({sp} бар) вне нормы (12–14)")
    if hr < 8 or hr > 12:
        issues.add(f"Скорость нагрева ({hr}°C/мин) вне нормы (8–12)")

    # Добавляем Issues (конвертируем set в list)
    result['Issues'] = list(issues) if issues else ["Все параметры в норме"]

    return jsonify(result)
