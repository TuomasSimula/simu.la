#!/usr/bin/python

import cgitb
import pymysql
import configparser

cgitb.enable()
print("Content-Type: text/html")
print()

config = configparser.ConfigParser()
config.read("../data/config.ini")

# Just testing basic mysql on python
conn = pymysql.connect(
        db=config["DATABASE"]["DB"],
        user=config["DATABASE"]["USERNAME"],
        passwd=config["DATABASE"]["PASSWORD"],
        host=config["DATABASE"]["HOST"])
c = conn.cursor()

# Add empty item to numbers in test database
c.execute("INSERT INTO numbers VALUES ()")
conn.commit()

# Return all items from numbers in test database
c.execute("SELECT * FROM numbers")
print([(r[0]) for r in c.fetchall()])
