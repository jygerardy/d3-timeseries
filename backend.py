from flask import request, Flask, render_template, json
import pandas as pd
import numpy as np
from fbprophet import Prophet

app = Flask(__name__, static_folder='.', template_folder='.')


m = Prophet()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/script.js")
def get_script():
    return app.send_static_file("script.js")

@app.route("/d3_timeseries.js")
def get_d3_timeseries_script():
    return app.send_static_file("d3_timeseries.js")


@app.route("/d3_timeseries.css")
def get_style():
    return app.send_static_file("d3_timeseries.css")

@app.route('/columns')
def get_columns():
    columns = df.columns.tolist()
    timeseries = df.select_dtypes(include=[np.number]).columns.tolist()
    return  json.jsonify({"columns": columns, "timeseries": timeseries})    

@app.route("/graph")
def graph():
    series_col = request.args.get("series", None)
    date_col = request.args.get("date_col", None)
    periods = request.args.get("periods", None)
   
    try:
        df_copy = df[[date_col, series_col]].copy()
        df_copy.columns = ['ds', 'y']
        m.fit(df_copy)
        future = m.make_future_dataframe(periods=int(periods))
        forecast = m.predict(future)     
        return forecast.to_json(orient='records')

    except Exception as e:
        print(e)
        return None

if __name__ == "__main__":

    #date_col = ['Month']
    df = pd.read_csv( './passengers_prepared.csv')
    
    app.run(debug=True)