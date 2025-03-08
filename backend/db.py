from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Role(db.Model):
    __tablename__ = 'role'

    index = db.Column(db.Integer, primary_key=True)
    role_users = db.Column(db.String(1024), unique=True, nullable=False)

    def __init__(self, index, role_users):  # Обновлено имя аргумента
        self.index = index
        self.role_users = role_users

    def __repr__(self):
        return f'<Role {self.role_users}>'


class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True,
                   autoincrement=True)  # serial эквивалент
    # role = db.Column(db.Integer, nullable=False)  # int4
    firstname = db.Column(db.String(1024), nullable=False)  # varchar
    secondname = db.Column(db.String(1024), nullable=False)  # varchar
    surname = db.Column(db.String(1024), nullable=False)  # varchar
    login = db.Column(db.String(1024), nullable=False)  # varchar
    password = db.Column(db.String(1024), nullable=False)  # varchar

    # Определение внешнего ключа
    role = db.Column(db.Integer, db.ForeignKey(
        'role.index', ondelete='CASCADE'), nullable=False)

    # Ссылка на модель Role, если она существует
    role_relationship = db.relationship('Role', backref='users', lazy=True)

    def __init__(self, firstname, secondname, surname, login, password, role):
        self.firstname = firstname
        self.secondname = secondname
        self.surname = surname
        self.login = login
        self.password = password
        self.role = role
