#!/usr/bin/python

import cgitb
import pymysql
import configparser

cgitb.enable()
print("Content-Type: text/html")
print()

config = configparser.ConfigParser()
config.read("../data/config.ini")


conn = pymysql.connect(
        db=config["DATABASE"]["DB"],
        user=config["DATABASE"]["USERNAME"],
        passwd=config["DATABASE"]["PASSWORD"],
        host=config["DATABASE"]["HOST"])
c = conn.cursor()

c.execute("INSERT INTO numbers VALUES (1, 'ONE')")
c.execute("INSERT INTO numbers VALUES (2, 'TWO')")
c.execute("INSERT INTO numbers VALUES (3, 'THREE')")
conn.commit()

c.execute("SELECT * FROM numbers")
print([(r[0], r[1]) for r in c.fetchall()])
