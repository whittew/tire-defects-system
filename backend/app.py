from flask import Flask, request, jsonify
from flask_cors import CORS
from probability import predict_bp
from login import login_bp
from db import db, Role
from flask_sqlalchemy import SQLAlchemy

# Инициализация Flask
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:whittew@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

CORS(app)

# Регистрация маршрутов
app.register_blueprint(predict_bp)
app.register_blueprint(login_bp)


@app.route('/')
def index():
    try:
        roles = Role.query.all()
        # Обновлено на role_users
        return f"Found {len(roles)} roles: {[r.role_users for r in roles]}"
    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == '__main__':
    app.run(debug=True)
