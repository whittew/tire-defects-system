import random

from flask_socketio import SocketIO
import time
import threading

from probability import process_prediction

socketio = SocketIO(cors_allowed_origins="*")


def init_socketio(app):
    socketio.init_app(app)
    # Запускаем симулятор в отдельном потоке
    threading.Thread(target=simulate_sensors, daemon=True).start()


def simulate_sensors():
    while True:
        # Здесь задай свои значения параметров
        sensor_data = {
            "Diameter": 15,  # Укажи значение (15, 17 или 19)
            "Temperature": random.randint(160, 190),  # Укажи значение (например, 175–205)
            "Pressure": 22,  # Укажи значение (например, 20–29)
            "Time": 35,  # Укажи значение (например, 25–50)
            "Thickness": 10,  # Укажи значение (9–13)
            "Mold_Temperature": random.randint(150, 180),  # Укажи значение (155–185)
            "Steam_Pressure": 13,  # Укажи значение (12–14)
            "Heat_Rate": 9  # Укажи значение (8–12)
        }

        # Обрабатываем данные через нейросеть
        result = process_prediction(sensor_data)

        # Отправляем данные по WebSocket
        socketio.emit('sensor_data', result)

        # Пауза 5 секунд
        time.sleep(2)

