from flask import Flask
from flask_cors import CORS
from probability import predict_bp
from db import db
from websocket import init_socketio

# Инициализация Flask
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:whittew@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

CORS(app)

# Регистрация маршрутов
app.register_blueprint(predict_bp)

# Инициализация SocketIO
init_socketio(app)

if __name__ == '__main__':
    app.run(debug=True)
