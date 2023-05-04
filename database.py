import sqlite3
DBFILE = "tasks.db"


def save (date, text, id):
    conn = sqlite3.connect(DBFILE)
    cursor = conn.cursor()

    data = (text, date, id)
    sql = "INSERT INTO `task` (`text`, `date`, `user_id`, `completed`)VALUES (?, ?, ?, 0)"

    cursor.execute(sql, data)
    conn.commit()
    conn.close()
    return True


def update (data):
    conn = sqlite3.connect(DBFILE)
    cursor = conn.cursor()

    sql = "UPDATE `task` SET `completed`= ? WHERE `id` = ?"

    for k, v in data.items():
        cursor.execute(sql, (int(eval(v.capitalize())), int(k)))

    conn.commit()
    conn.close()
    return True


def signup_save(login, password):
    conn = sqlite3.connect(DBFILE)
    cursor = conn.cursor()

    data = (login, password)
    sql = "INSERT INTO `user` (`username`, `password`) VALUES (?, ?)"

    cursor.execute(sql, data)
    conn.commit()
    conn.close()
    return True


def delete(data):
    conn = sqlite3.connect(DBFILE)
    cursor = conn.cursor()

    sql = "DELETE FROM `task` WHERE `id` = ?"

    for k, v in data.items():
        if int(eval(v.capitalize())):
            cursor.execute(sql, (int(k),))

    conn.commit()
    conn.close()
    return True


def get(month, year, id):
    conn = sqlite3.connect(DBFILE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM `task` WHERE `date` >= date(? ||'-01-01','+'||(?-1)||' month') AND "
        "`date` < date(? ||'-01-01','+'||(?)||' month') AND `user_id` = ?",
        (year, month, year, month, id)
    )
    rows = cursor.fetchall()
    if len(rows) == 0:
        return None

    data = {}
    for r in rows:
        data[r[0]] = {
            "id": r[0], "text": r[1], "date": r[2], "user_id": r[3], "completed": r[4]
        }
    return data


def get_user(username, password):
    conn = sqlite3.connect(DBFILE)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM `user` WHERE (`username`, `password`) = (?, ?)",
        (username, password)
    )
    cur_l = cursor.fetchall()
    if len(cur_l) > 0:
        return True, cur_l[0][0]
    else:
        return False, None


def check_user(username):
    conn = sqlite3.connect(DBFILE)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM `user` WHERE `username` = ?",
        (username,)
    )
    cur_l = cursor.fetchall()
    if len(cur_l) != 0:
        return True
    else:
        return False
