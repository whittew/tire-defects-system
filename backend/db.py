from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Operator(db.Model):
    __tablename__ = 'operator'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)
    shift = db.Column(db.String, nullable=False)

    errors = db.relationship('ErrorLog', backref='operator', lazy=True)
    analysis_logs = db.relationship('AnalysisLog', backref='operator', lazy=True)


class ErrorLog(db.Model):
    __tablename__ = 'error_log'

    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    operator_id = db.Column(db.Integer, db.ForeignKey('operator.id'), nullable=False)
    description = db.Column(db.String, nullable=False)


class Tire(db.Model):
    __tablename__ = 'tire'

    id = db.Column(db.Integer, primary_key=True)
    serial_number = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String)

    analysis_logs = db.relationship('AnalysisLog', backref='tire', lazy=True)
    defects = db.relationship('TireDefect', backref='tire', lazy=True)
    parameters = db.relationship('ParameterLog', backref='tire', lazy=True)


class AnalysisLog(db.Model):
    __tablename__ = 'analysis_log'

    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    operator_id = db.Column(db.Integer, db.ForeignKey('operator.id'), nullable=False)
    tire_id = db.Column(db.Integer, db.ForeignKey('tire.id'), nullable=False)


class DefectSeverity(db.Model):
    __tablename__ = 'defect_severity'

    id = db.Column(db.Integer, primary_key=True)
    severity_level = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    defects = db.relationship('Defect', backref='severity', lazy=True)


class Solution(db.Model):
    __tablename__ = 'solution'

    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String)
    description = db.Column(db.String)

    defects = db.relationship('Defect', backref='solution', lazy=True)


class Defect(db.Model):
    __tablename__ = 'defect'

    id = db.Column(db.Integer, primary_key=True)
    defect_name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    reason = db.Column(db.String, nullable=False)
    defect_severity_id = db.Column(db.Integer, db.ForeignKey('defect_severity.id'), nullable=False)
    solution_id = db.Column(db.Integer, db.ForeignKey('solution.id'), nullable=False)

    tire_defects = db.relationship('TireDefect', backref='defect', lazy=True)


class TireDefect(db.Model):
    __tablename__ = 'tire_defect'

    id = db.Column(db.Integer, primary_key=True)
    tire_id = db.Column(db.Integer, db.ForeignKey('tire.id'), nullable=False)
    defect_id = db.Column(db.Integer, db.ForeignKey('defect.id'), nullable=False)
    count = db.Column(db.Integer, default=1, nullable=False)


class ParameterLog(db.Model):
    __tablename__ = 'parameter_log'

    id = db.Column(db.Integer, primary_key=True)
    tire_id = db.Column(db.Integer, db.ForeignKey('tire.id'), nullable=False)
    diameter = db.Column(db.Float)
    temperature = db.Column(db.Float)
    pressure = db.Column(db.Float)
    time = db.Column(db.Float)
    thickness = db.Column(db.Float)
    mold_temperature = db.Column(db.Float)
    steam_pressure = db.Column(db.Float)
    heat_rate = db.Column(db.Float)
