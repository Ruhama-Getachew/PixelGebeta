from extensions import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)

class Habit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    unit = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    reminder_time = db.Column(db.String, nullable=True)

class Log(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    quantity = db.Column(db.Integer)
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'))

    