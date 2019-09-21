import numpy as np
import pandas as pd
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

# path where you want the db and what it's named
database = "chi_restaurant_data.sqlite"

# calls to functions to create the dataframes
google_reviews_df = pd.read_csv("google_reviews.csv")
# chi_inspections_df = get_chi_data()

# create a database connection
conn = create_connection(database)

# create db tables
with conn:

    cur = conn.cursor()

    # need to make the columns of the sql tables match the dataframe columns - data type and order
    inspections_table = """CREATE TABLE IF NOT EXISTS inspections (
                                id integer PRIMARY KEY,
                                name text NOT NULL,
                                license_number integer NOT NULL
                            );"""

    cur.execute(inspections_table)

    google_table = """CREATE TABLE IF NOT EXISTS reviews (
                                id integer PRIMARY KEY,
                                Average_of_Ratings real,
                                Average_Number_of_Reviews real,
                                Total_Number_of_Reviews real,
                                Total_Returned real,
                                Data_license integer,
                                FOREIGN KEY (Data_license) REFERENCES inspections (license_number)
                            ); """
    
    cur.execute(google_table)

    engine = create_engine("sqlite:///chi_restaurant_data.sqlite", echo=False)

    # populate the sql tables with the df data
    google_reviews_df.to_sql('reviews', con=engine, if_exists='append', index=False)
    # chi_inspections_df.to_sql('inspections', con=engine, if_exists='replace', index=False)

    # reflect an existing database into a new model
    Base = automap_base()

    # reflect the tables
    Base.prepare(engine, reflect=True)

    inspector = inspect(engine)
    print(inspector.get_table_names())
    print(Base.classes.keys())

    # Save reference to the table
    Reviews = Base.classes.reviews
    # inspections = Base.classes.inspections

    # merge tables
    # inner_join = """select reviews.name, stars, lat, long, inspections.license_number
    #             from reviews
    #             join inspections on inspections.license_number = reviews.license_number;
    #             """

    # merged_table = cur.execute(inner_join)


#################################################
# Database Setup, DataFrame creation
#################################################

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    session = Session(engine)

    # Query all 
    session = Session(engine)
    results = session.query(Reviews).all()

    # results2 = session.query(inspections.name, inspections.license_number).all()

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
    # all_names = list(np.ravel(results))

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)