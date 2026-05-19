# PixelGebeta 🟩

> Your habits are writing your story. Show up every day and watch it unfold — one pixel at a time.

PixelGebeta is a habit tracking web app that turns your daily consistency into a beautiful pixel grid. Built with Flask and SQLite.

## Features

- 🟩 **Pixel Grid** — visualize your consistency day by day, inspired by GitHub's contribution graph
- 🔥 **Streaks** — stay motivated by keeping your streak alive
- 📊 **Graph** — track your progress over time with a multi-line chart (1W, 1M, 3M, 6M, 1Y)
- 🔔 **Reminders** — set browser notifications per habit so you never miss a day
- 📈 **Stats** — see your total, max, min, and average progress per habit
- 🔐 **Auth** — register, login, and logout securely

## Tech Stack

- **Backend** — Python, Flask, SQLAlchemy, Flask-Login
- **Database** — SQLite
- **Frontend** — HTML, CSS, JavaScript, Chart.js
- **Auth** — Werkzeug password hashing

## Installation

```bash
# Clone the repo
git clone https://github.com/Ruhama-Getachew/pixelgebeta.git
cd pixelgebeta

# Install dependencies
pip install flask flask-sqlalchemy flask-login werkzeug

# Run the app
python app.py
```

Then open `http://127.0.0.1:5000` in your browser.

## Screenshots

*Coming soon*

## Roadmap

- [ ] Email reminders
- [ ] Full mobile responsive
- [ ] Dark mode
- [ ] Export data as CSV
- [ ] Profile page

## Author

[Ruhama Getachew](https://github.com/Ruhama-Getachew)

## License

MIT
