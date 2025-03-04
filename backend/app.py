from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler
import numpy as np
import pickle

# Инициализация Flask
app = Flask(__name__)

# Загрузка модели и scaler
model = load_model('tire_model_defects.h5', custom_objects={
                   'mse': tf.keras.losses.MeanSquaredError()})
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Endpoint и предсказания


@app.route("/predict", methods=['POST'])
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
    params = scaler.transform(params)  # Нормализация как при обучении

    # Предсказания
    # Предсказания для одного примера
    prediction = model.predict(params, verbose=0)[0]

    # Формирование ответа
    result = {
        'Normal_Prob': float(prediction[0]),
        'Bubble_Prob': float(prediction[1]),
        'Crack_Prob': float(prediction[2]),
        'Uneven_Prob': float(prediction[3]),
        'Damage_Prob': float(prediction[4])
    }

    return jsonify(result)
