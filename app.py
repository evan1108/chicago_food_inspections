import numpy as np

import sqlite3
from sqlite3 import Error
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify

#################
# Flask Setup
#################
app = Flask(__name__)


# path where you want the db and what it's named
database = "chi_restaurant_data.sqlite"

# calls to functions to create the dataframes
google_reviews_df = get_google_data()
chi_data_df = get_chi_data()

# create a database connection
conn = create_connection(database)

# create db tables
with conn:

    # need to make the columns of the sql tables match the dataframe columns - data type and order

    google_table = """CREATE TABLE IF NOT EXISTS reviews (
                                id integer PRIMARY KEY,
                                name text NOT NULL,
                                stars real,
                                license_number integer,
                                lat real,
                                long real
                            ); """

    inspections_table = """CREATE TABLE IF NOT EXISTS inspections (
                                id integer PRIMARY KEY,
                                name text NOT NULL,
                                license_number integer NOT NULL,
                                FOREIGN KEY (license_number) REFERENCES reviews (license_number)
                            );"""

    cur = conn.cursor()
    cur.execute(google_table)
    cur.execute(inspections_table)

    engine = create_engine("sqlite:///chi_restaurant_data.sqlite", echo=False)

    # populate the sql tables with the df data
    google_reviews_df.to_sql('reviews', con=engine, if_exists='replace', index=False)
    chi_data_df.to_sql('inspections', con=engine, if_exists='replace', index=False)

    # reflect an existing database into a new model
    Base = automap_base()

    # reflect the tables
    Base.prepare(engine, reflect=True)

    # Save reference to the table
    reviews = Base.classes.reviews
    inspections = Base.classes.inspections

#################################################
# Database Setup, DataFrame creation
#################################################

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by the db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
 
    return conn

def get_chi_data():

    # CODE HERE TO CREATE DF FROM CHI DATA PORTAL

    return chi_inspection_df

def get_google_data():

    # CODE HERE TO CREATE DF FROM GOOGLE REVIEWS

    return google_reviews_df


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    session = Session(engine)

    # Query all 
    session = Session(engine)
    results = session.query(reviews).all()

    results2 = session.query(inspections.name, inspections.license_number).all()

    # example on what you can do with queries. There's also .filter
    """
    session.query(Invoices.BillingPostalCode, func.sum(Items.UnitPrice * Items.Quantity)).\
    filter(Invoices.InvoiceId == Items.InvoiceId).\
    filter(Invoices.BillingCountry == 'USA').\
    group_by(Invoices.BillingPostalCode).\
    order_by(func.sum(Items.UnitPrice * Items.Quantity).desc()).all()
    """

    session.close()

    # Convert list of tuples into normal list
    all_names = list(np.ravel(results))

    return jsonify(all_names)


if __name__ == '__main__':
    app.run(debug=True)