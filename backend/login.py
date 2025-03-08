from flask import Blueprint, request, jsonify
from db import Users

login_bp = Blueprint('login', __name__)


@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    login_dt = data['Login']
    password_dt = data['Password']

    user = Users.query.filter_by(login=login_dt, password=password_dt).first()
    if user != None:
        return jsonify({"role": user.role}), 200
    else:
        return jsonify({"message": "Пользователь не найден"}), 401
