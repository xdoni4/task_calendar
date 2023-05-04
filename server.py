import sys
import database as db
from flask import Flask, request, render_template, make_response

HOST_NAME = "localhost"
HOST_PORT = 8080
app = Flask(__name__)


@app.route('/login', methods=["GET", "POST"])
def login():
    data = dict(request.form)
    print(data)
    valid, id = db.get_user(data['username'], data['password'])
    if valid:
        return render_template("calendar.html", user_id=id)
    else:
        return render_template("login.html", incorrect=1)


@app.route('/auth')
def auth():
    return render_template("login.html", incorrect=0)


@app.route('/signup/', methods=["GET", "POST"])
def signup(exists=0):
    return render_template('signup.html', exists=exists)


@app.route('/signup/save', methods=["GET", "POST"])
def signup_save():
    data = dict(request.form)
    print(data)
    exists = db.check_user(data["login"])
    if exists:
        return render_template('signup.html', exists=1)
    else:
        ok = db.signup_save(data["login"], data["password"])
        return render_template('success.html')


@app.route('/logout')
def logout():
    return 'Logout'


@app.route("/", methods=["GET", "POST"])
def index():
    return auth()


@app.route("/get/", methods=["POST"])
def get():
    data = dict(request.form)
    print(data)
    events = db.get(int(data["month"]), int(data["year"]), int(data["id"]))
    return "{}" if events is None else events


@app.route("/save/", methods=["POST"])
def save():
    data = dict(request.form)
    print(data)
    ok = db.save(data["date"], data["text"], int(data["id"]))
    msg = "OK" if ok else sys.last_value
    return make_response(msg, 200)


@app.route("/update/", methods=["POST"])
def update():
    data = dict(request.form)
    print(data)
    ok = db.update(data)
    msg = "OK" if ok else sys.last_value
    return make_response(msg, 200)


@app.route("/delete/", methods=["POST"])
def delete():
    data = dict(request.form)
    print(data)
    ok = db.delete(data)
    msg = "OK" if ok else sys.last_value
    return make_response(msg, 200)


def main():
    app.run(HOST_NAME, HOST_PORT)


if __name__ == "__main__":
    main()
