from flask import Flask, render_template, redirect, url_for, request, flash
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from datetime import date, timedelta

SECRETKEY = "jjkse3786eobsd990q37"

from datetime import date, timedelta


app = Flask(__name__)
app.config['SECRET_KEY'] = SECRETKEY
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///habits.db'
db.init_app(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(int(user_id))

@app.route('/')
def home():
    habits = []
    total_weeks = []
    graph_labels = []
    graph_data = []
    graph_habits = []
    total_month_labels = []
    habit_month_labels = {}
    habit_pixels = {}
    habit_stats = {}
    streak_count = 0
    
    if current_user.is_authenticated:
        habits = Habit.query.filter_by(user_id=current_user.id).all()
        
        today = date.today()
        days = [today - timedelta(days=i) for i in range(370, -1, -1)]
        
        for habit in habits:
            logs = Log.query.filter_by(habit_id=habit.id).all()
            log_dict = {log.date if isinstance(log.date, date) else log.date.date(): log.quantity for log in logs}
            
            max_quantity = max([log.quantity for log in logs], default=1)
            
            pixels = []
            for day in days:
                quantity = log_dict.get(day, 0)
                if quantity == 0:
                    level = 0
                else:
                    ratio = quantity / max_quantity
                    level = min(int(ratio * 10) + 1, 10)
                pixels.append({'date': day, 'level': level, 'quantity': quantity})    
            habit_pixels[habit.id] = pixels

            weeks = []
            week = []
            for i, pixel in enumerate(pixels):
                week.append(pixel)
                if len(week) == 7:
                    weeks.append(week)
                    week = []
            if week:
                weeks.append(week)

            habit_pixels[habit.id] = weeks

            quantities = [log.quantity for log in logs]
            total_amount = sum(quantities)
            max_amount = max(quantities, default=0)
            min_amount = min(quantities, default=0)
            avg_amount = round(total_amount / len(quantities), 1) if quantities else 0
            total_pixels = len([q for q in quantities if q > 0])
            today_amount = log_dict.get(today, 0)

            habit_streak = 0
            check = today
            while log_dict.get(check, 0) > 0:
                habit_streak += 1
                check -= timedelta(days=1)

            habit_stats[habit.id] = {
                'total_amount': total_amount,
                'max_amount': max_amount,
                'min_amount': min_amount,
                'avg_amount': avg_amount,
                'total_pixels': total_pixels,
                'today_amount': today_amount,
                'habit_streak': habit_streak,
            }

        check = today
        while True:
            all_logged = all(
                Log.query.filter_by(habit_id=h.id, date=check).first()
                for h in habits
            )
            if all_logged and habits:
                streak_count += 1
                check -= timedelta(days=1)
            else:
                break            

        
        all_dates = {}
        for habit in habits:
            logs = Log.query.filter_by(habit_id=habit.id).all()
            for log in logs:
                d = log.date if isinstance(log.date, date) else log.date.date()
                all_dates[d] = all_dates.get(d, 0) + log.quantity

        total_max = max(all_dates.values(), default=1)
        total_pixels_grid = []
        for day in days:
            quantity = all_dates.get(day, 0)
            if quantity == 0:
                level = 0
            else:
                ratio = quantity / total_max
                level = min(int(ratio * 10) + 1, 10)
            total_pixels_grid.append({'date': day, 'level': level, 'quantity': quantity})

        total_weeks = []
        week = []
        for pixel in total_pixels_grid:
            week.append(pixel)
            if len(week) == 7:
                total_weeks.append(week)
                week = []
        if week:
            total_weeks.append(week)

        
        # graph data per habit
        graph_labels = []
        for i in range(370, -1, -1):
            day = today - timedelta(days=i)
            graph_labels.append(day.strftime('%b %d'))

        graph_habits = []
        for habit in habits:
            logs = Log.query.filter_by(habit_id=habit.id).all()
            log_dict_h = {log.date if isinstance(log.date, date) else log.date.date(): log.quantity for log in logs}
            data = []
            for i in range(370, -1, -1):
                day = today - timedelta(days=i)
                data.append(log_dict_h.get(day, 0))
            graph_habits.append({
                'name': habit.name,
                'data': data
            })

     

    return render_template('home.html', 
                         current_user=current_user, 
                         habits=habits,
                         habit_pixels=habit_pixels,
                         habit_stats=habit_stats,
                         streak_count=streak_count,
                         total_weeks=total_weeks,
                         graph_labels=graph_labels,
                         graph_habits=graph_habits)

with app.app_context():
    from models import User, Habit, Log
    db.create_all()

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm = request.form.get('confirm')

        if password != confirm:
            flash("Passwords don't match!")
            flash('show_register')
            return redirect(url_for('home'))

        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email already exists!')
            flash('show_register')
            return redirect(url_for('home'))
        
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        
        return redirect(url_for('home') + '#dashboard')
    

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember')


        user = User.query.filter_by(email=email).first()
        if not user:
            flash('Email not found!')
            flash('show_login')
            return redirect(url_for('home'))
        
        check_password = check_password_hash(user.password, password)
        if not check_password:
            flash('Incorrect password or email!')
            flash('show_login')
            return redirect(url_for('home'))
        
        login_user(user, remember=remember)
        return redirect(url_for('home') + '#dashboard')
    


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/add-habit', methods=['GET', 'POST'])
@login_required
def add_habit():
    name = request.form.get('name')
    description = request.form.get('description')
    unit = request.form.get('unit')

    new_habit = Habit(
        name=name,
        description=description,
        unit=unit,
        user_id=current_user.id
    )
    db.session.add(new_habit)
    db.session.commit()
    return redirect(url_for('home') + '#dashboard')

@app.route('/delete_habit', methods=['POST'])
@login_required
def delete_habit():
    habit_id = request.form.get('habit_id')
    Log.query.filter_by(habit_id=habit_id).delete()
    Habit.query.filter_by(id=habit_id).delete()
    db.session.commit()
    return redirect(url_for('home') + '#dashboard')

@app.route('/edit_habit', methods=['POST'])
@login_required
def edit_habit():
    habit_id = request.form.get('habit_id')
    name = request.form.get('name')
    description = request.form.get('description')
    unit = request.form.get('unit')

    habit = Habit.query.get(int(habit_id))
    habit.name=name
    habit.description=description
    habit.unit=unit
    habit.user_id=current_user.id
    db.session.commit()
    return redirect(url_for('home') + '#dashboard')

from datetime import date

@app.route('/log_today', methods=['POST'])
@login_required
def log_today():
    habit_id = request.form.get('habit_id')
    amount = request.form.get('amount')

    existing_log = Log.query.filter_by(habit_id=habit_id,date=date.today()).first()
    if existing_log:
        existing_log.quantity = int(amount)
    else:
        new_log = Log(
            date=date.today(),
            quantity=int(amount),
            habit_id=int(habit_id)
        )
        db.session.add(new_log)
    db.session.commit()
    return redirect(url_for('home') + '#dashboard')

@app.route('/set_reminder', methods=['POST'])
@login_required
def set_reminder():
    habit_id = request.form.get('habit_id')
    reminder_time = request.form.get('reminder_time')
    habit = Habit.query.get(int(habit_id))
    habit.reminder_time = reminder_time
    db.session.commit()
    return redirect(url_for('home') + '#dashboard')    

if __name__ == '__main__':
    app.run(debug=True)