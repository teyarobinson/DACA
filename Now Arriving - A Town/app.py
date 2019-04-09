import os
import pandas as pd
import numpy as np
import json
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
import urllib.request, json 
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import requests

app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/DACA.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

Ages = Base.classes.Age
Sexes = Base.classes.Sex
Origin = Base.classes.BirthCountry

engine = create_engine("sqlite:///db/DACA.sqlite")
inspector = inspect(engine)


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")
    

@app.route("/ageChart")
def age():
    stmt = db.session.query(Ages).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    df = df.to_json()
     
    
    return df
@app.route("/originChart")
def origin():
    stmt = db.session.query(Origin).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    df = df.to_json()

    return df
@app.route("/genderChart")
def gender():
    stmt = db.session.query(Sexes).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    df = df.to_json()
    return df

@app.route("/map")
def mapurl():
    jsonData = json.loads(requests.get("https://raw.githubusercontent.com/msulrich1984/homework1/master/cbsaconvert.json").text)
    return jsonify(jsonData)

if __name__ == "__main__":
    app.run()
