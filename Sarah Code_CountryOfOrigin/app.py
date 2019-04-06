from flask import Flask, jsonify, render_template
app = Flask(__name__)

import sqlite3

DATABASE = 'database.db'

#goes to route 
@app.route("/")
def index():
    #goes to index.html and runs the code
    return render_template('origin.html')