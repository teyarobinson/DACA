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

# dacaURL = "https://raw.githubusercontent.com/msulrich1984/homework1/master/cbsaconvert.json"
# with open("https://raw.githubusercontent.com/msulrich1984/homework1/master/cbsaconvert.json", 'r') as myfile:
#     data=myfile.read()
# dacaJSON = json.loads(data)

# tableList = inspector.get_table_names()
# tableList = pd.DataFrame(tableList)
# tableList.columns=["listing"]
# tableList = tableList.to_json()

@app.route("/")
def index():
    """Return the homepage."""
    
    return render_template("/Templates/index.html")
    

@app.route("/ageChart")
def age():
    stmt = db.session.query(Ages).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    df = df.to_json()
     

    # Age = pd.read_sql_query("SELECT * FROM Age", engine)
    # Age.columns = ['Age','Total','Percent']
    # Age = Age.to_json()
    
    return df
@app.route("/originChart")
def origin():
    stmt = db.session.query(Origin).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    df = df.to_json()
     

    # Age = pd.read_sql_query("SELECT * FROM Age", engine)
    # Age.columns = ['Age','Total','Percent']
    # Age = Age.to_json()

    return df
@app.route("/genderChart")
def gender():
    stmt = db.session.query(Sexes).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    df = df.to_json()
    return df

@app.route("/map")
def mapurl():
    # jsonurl = "https://raw.githubusercontent.com/msulrich1984/homework1/master/cbsaconvert.json"
    # dictionary = requests.get(url).json()
    # print(jsonify(dictionary))
    # 
    jsonData = json.loads(requests.get("https://raw.githubusercontent.com/msulrich1984/homework1/master/cbsaconvert.json").text)
    # with urllib.request.urlopen("https://raw.githubusercontent.com/msulrich1984/homework1/master/cbsaconvert.json") as url:
    #     jsonData = json.loads(url.read().decode())
    #     print(jsonData)
    return jsonify(jsonData)
 

# @app.route("/routes")
# def names():
# #     """Return a list of sample names."""
   
#     chartList = ["Ages","Gender", "Country of Origin"]

   
#     # tableList = inspector.get_table_names()
#     # tableList = pd.DataFrame(tableList)
#     # tableList.columns=["listing"]
#     # tableList = tableList.to_json()
#     # print(tableList)
#     return jsonify(chartList)




if __name__ == "__main__":
    app.run()
