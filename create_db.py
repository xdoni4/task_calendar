import sqlite3
import os

dbfile = "tasks.db"
sqlfile = "ddl.sql"

if os.path.exists(dbfile):
    os.remove(dbfile)

conn = sqlite3.connect(dbfile)
with open(sqlfile) as f:
    conn.executescript(f.read())
conn.commit()
conn.close()
