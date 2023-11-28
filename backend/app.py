from flask import Flask, request, Response, jsonify, render_template, url_for
from flask_cors import CORS
import lightgbm as lgb
import pandas as pd
import pickle
from sklearn.cluster import KMeans
import numpy as np
import requests
import dill
import shap
import matplotlib.pyplot as plt
import seaborn as sns
from functionalities import *
import __main__
import os
import sys
__main__.pd = pd
from LLaMa import LLaMa

import json
import plotly
import plotly.express as px

# import user dummy data
import random
from dummyUserData import dummyUsers

# LLaMa init
import requests
import google.auth
import google.auth.transport.requests
from google.oauth2 import service_account
llama = LLaMa()

def create_directories(directory_paths):
    for directory_path in directory_paths:
        # Check if the directory already exists
        if not os.path.exists(directory_path):
            try:
                # Create the directory
                os.makedirs(directory_path)
                print(f"Directory '{directory_path}' created successfully.")
            except OSError as e:
                print(f"Error creating directory '{directory_path}': {e}")
        else:
            print(f"Directory '{directory_path}' already exists.")

directories_to_create = ["static/images/plot_cluster", "static/images/shap_feature_importance"]
create_directories(directories_to_create)

app = Flask(__name__)
CORS(app)

# Read Pipeline
with open("output_models/pipeline.pkl", "rb")  as pipeline_file: 
    serialized = pipeline_file.read()
pipeline = dill.loads(serialized)
# Read lgbm model
lgbm_model = lgb.Booster(model_file='output_models/lgbm_model.txt')
# Read Kmeans model
with open("output_models/kmeans_model.pkl", "rb")  as kmeans_file: 
    kmeans = pickle.load(kmeans_file)
# Read shap_values
with open("output_models/shap_values.pkl", "rb")  as shap_values_file: 
    shap_values = pickle.load(shap_values_file)
# Read X_sample
with open("output_models/sample_kmeans_explainer.pkl", "rb")  as X_sample_file: 
    X_sample = pd.read_pickle(X_sample_file)
# Read X_sample
with open("output_models/kmeans_pairplot_data.pkl", "rb")  as kmeans_pairplot_data_file: 
    X_pairplot_data = pd.read_pickle(kmeans_pairplot_data_file)
# Clusters kmeans dataframe
with open("output_models/dataframe_kmeans_plots.pkl", "rb")  as df_k_plots_file: 
    df_k_plots = pd.read_pickle(df_k_plots_file)
# df for MapChart mean probs
with open("output_models/df_mean_probabilities_stores.pkl", "rb")  as df_mean_probs_file: 
    mean_probabilities = pd.read_pickle(df_mean_probs_file)
# df for MapChart kmeans
with open("output_models/df_locations_kmeans.pkl", "rb")  as df_locations_file: 
    locations_ = pd.read_pickle(df_locations_file)
# df Churn cateogry counts
with open("output_models/df_churn_category_counts.pkl", "rb")  as df_churn_cat_file: 
    churn_category_counts = pd.read_pickle(df_churn_cat_file)
# df to analyze
with open("output_models/df_raw_to_lgbm.pkl", "rb") as df_raw_to_lgbm: 
    loc_df = pd.read_pickle(df_raw_to_lgbm)
    loc_df.rename(columns={'KMEANS_CLUSTERS': 'CLUSTER_KMEANS'}, inplace=True)
    cluster_mapping = {0: 2, 1: 3, 2: 0, 3: 1}
    loc_df['CLUSTER_KMEANS'] = loc_df['CLUSTER_KMEANS'].replace(cluster_mapping)
# df of masked dnis
masked_dni_series = pd.read_csv("https://objectstorage.us-phoenix-1.oraclecloud.com/n/axvqlzxj34zs/b/bucket-20230926-1647/o/masked_dni.csv")
masked_dni_series.set_index('MASKED_DNI', inplace=True)
masked_dni_series = masked_dni_series['DNI']

def predict_kmeans_model(raw_df):
    sample_transform, Xx, Yy = pipeline.transform_sample_kmeans(raw_df, use_ads_transform=True)
    prediction = kmeans.predict(Xx)
    return prediction

def predict_lgbm_model(raw_df, kmeans_t):
    sample_transform, Xx, Yy, kmeans_df = pipeline.transform_sample_lgbm(raw_df, kmeans_t)
    Xx = Xx.drop(["MONTO_ANTERIOR"], axis=1)
    prediction = lgbm_model.predict(Xx)
    return prediction

def generate_kmeans_report_graphs():
    # Feature importance General
    shap.summary_plot(shap_values, X_sample, plot_type="bar", show=False)
    plt.xlabel('Average impact on model output magnitude')
    plt.savefig("static/images/shap_feature_importance/general.png")
    plt.close()

    # Feature importance Clusters
    shap.summary_plot(shap_values[0], X_sample, plot_type="violin", show=False)
    plt.savefig("static/images/shap_feature_importance/0.png")
    plt.close()
    shap.summary_plot(shap_values[1], X_sample, plot_type="violin", show=False)
    plt.savefig("static/images/shap_feature_importance/1.png")
    plt.close()
    shap.summary_plot(shap_values[2], X_sample, plot_type="violin", show=False)
    plt.savefig("static/images/shap_feature_importance/2.png")
    plt.close()
    shap.summary_plot(shap_values[3], X_sample, plot_type="violin", show=False)
    plt.savefig("static/images/shap_feature_importance/3.png")
    plt.close()

    # Pairplot
    kmeans_pairplot = sns.pairplot(X_pairplot_data, hue="CLUSTER_KMEANS", diag_kind='kde', palette=sns.color_palette(n_colors=4))
    kmeans_pairplot.savefig("static/images/kmeans_pairplot.png")
    plt.close()

    # Numerical Columns
    numerical_columns = [
        'MONTO_ANTERIOR',
        'MONTO_POSTERIOR',
        'SUM_CANTIDAD_RECARGAS',
        'SUM_MONTO_RECARGAS',
        'DIAS_FRECUENCIA_RECARGA',
        'SUM_SS_TRAFICO_IVR',
        'SUM_ESC_TRAFICO_LOCAL_VOZ',
        'SUM_ESC_TRAFICO_IVR_VOZ',
        'AGE'
    ]

    categorical_columns_hist = [
        'STORE',
        'MANUFACTURER',
        'MODEL',
        'YEAR'
    ]

    # For each column in numerical_columns, call plot_clusters
    for column in numerical_columns:
        plot_clusters(df_k_plots, value_column=column, save=True)

    plot_clusters(df_k_plots, value_column='SUM_ESC_TRAFICO_INTERNACIONAL_VOZ', save=True)#, xlimit=(0, 150))
    plot_clusters(df_k_plots, value_column='SUM_ESC_ROAMING_ENTRANTE_VOZ', save=True)#, xlimit=(0, 150))
    plot_clusters(df_k_plots, value_column='SUM_ESC_ROAMING_SALIENTE_VOZ', save=True)#, xlimit=(0, 50))
    plot_clusters(df_k_plots, value_column='SUM_ESC_FAMILIA_Y_AMIGOS_VOZ', save=True)#, xlimit=(0, 8))

    # For each column in categorical_columns_hist, call plot_clusters_numeric_features_hist
    for column in categorical_columns_hist:
        plot_clusters_numeric_features_hist(loc_df, numeric_col=column, save=True)

    plot_clusters_numeric_features_pie(loc_df, numeric_col='EMPLYEE_STATUS', save=True, labels=['Employed', 'Self-Employed', 'Unemployed'])
    plot_clusters_numeric_features_pie(loc_df, numeric_col='FLAG_CON_SALDO', save=True, labels=['No Balance', 'Balance'])
    plot_clusters_numeric_features_pie(loc_df, numeric_col='FLAG_CLIENTE_ACTIVO', save=True, labels=['Inactive', 'Active'])
    plot_clusters_numeric_features_pie(loc_df, numeric_col='GENDER', save=True, labels=['Men', 'Women'])


@app.route('/api/lgmb/single', methods=['POST'])
def predict_lgbm():
    """
        Predict for a single data point for lgbm
    """
    data = request.get_json()
    print(data)
    
    # Convert json to dataframe
    df = pd.DataFrame.from_dict(data)
    # pipeline.transform_sample_kmeans(df, use_ads_transform=True)

    # Predict
    # prediction = lgbm_model.predict(df)

    # Return prediction
    # return jsonify({'prediction': list(prediction)})
    return "hola"

@app.route('/api/lgmb/dni_predict', methods=['POST'])
def predictByDni():
    data    = request.get_json()
    dni     = data["DNI"]
    dni     = masked_dni_series[dni]
    r = requests.get('https://g2f225dbbc50ff7-churntelcodb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/getdataframe?q={"dni":"' + dni + '"}')
    df = pd.DataFrame(r.json()["items"])
    df.columns = df.columns.str.upper()
    prediction_kmeans = predict_kmeans_model(df)
    prediction_lgbm = predict_lgbm_model(df, kmeans)

    return jsonify({
        'prediction_kmeans' : prediction_kmeans.tolist(),
        'prediction_lgbm'   : prediction_lgbm.tolist(),
        'user_data' : random.choice(dummyUsers)
    })

@app.route('/api/llama/salesman', methods=['POST'])
def getSalesmanRecommendations():
    data    = request.get_json()
    prediction_kmeans = data["prediction_kmeans"]
    prediction_lgbm = data["prediction_lgbm"][0]
    label_cluster = data["labels"][prediction_kmeans[0]]
    base_prompt = f"""
        Generate a proposal for a telephone company salesman, utilizing the client's assigned label cluster '{label_cluster}' and the predicted 
        probability of the client remaining with the telephone company services '{prediction_lgbm}'. If the client's probability exceeds 0.90, 
        they are considered to be in a safe zone.
    """
    try:
        sms = llama.getMessage(base_prompt)
    except:
        llama = LLaMa()
        sms = llama.getMessage(base_prompt)
    return jsonify({
        "recommendations" : sms
    })

# Kmeans
@app.route('/api/kmeans/single', methods=['POST'])
def predict_cluster_kmeans():
    """
        Predict for a single data point in kmeans
    """
    data    = request.get_json()
    df      = pd.DataFrame.from_dict(data)
    prediction = kmeans.predict(df)
    print(list(prediction))

    return jsonify({'prediction': prediction.tolist()})

@app.route('/api/llama/message', methods=["POST"])
def getRecommendedMessage():
    input_prompt = request.get_json()["prompt"]
    base_prompt = f"""
        As a marketing Bot named 'BeCode Bot', generate a short and brief SMS as a promo for client of a telephone company names TELCO, for users with this characteristics: '{input_prompt}'
    """
    try:
        sms = llama.getMessage(base_prompt)
    except:
        llama = LLaMa()
        sms = llama.getMessage(base_prompt)
    print(sms)
    return jsonify({
        "message" : sms
    })

@app.route("/chart/map-1")
def getMapChart_1():
    fig = px.scatter_geo(
        mean_probabilities,
        lat="LATITTUDE",
        lon="LONGITUDE",
        size="probability",
        color="probability",
        hover_name="STORE",
        scope="usa",
        title="Mean Probability for Each Store"
    )
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return render_template("plotlyChart.html", graphJSON=graphJSON)

@app.route("/chart/map-2")
def getMapChart_2():
    fig = px.scatter_geo(locations_,
                         lat="LAT",
                         lon="LONG",
                         size="scaled_probs",
                         color="scaled_probs",
                         scope="usa"
                        )
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return render_template("plotlyChart.html", graphJSON=graphJSON)

@app.route("/chart/map-3")
def getMapChart_3():
    fig = px.bar(churn_category_counts, 
                 x='KMEANS_CLUSTERS', 
                 y='Count', 
                 color='ChurnCategory', 
                 title='Churn Category Counts by KMEANS Cluster',
                 labels={'KMEANS_CLUSTERS': 'KMEANS_CLUSTERS', 'Count': 'Count'},
                 color_discrete_map={'Critical Risk': 'red', 'High Risk': 'orange', 'Moderate Risk': 'yellow', 'Low Risk': 'green'})

    # Update layout and show the chart
    fig.update_layout(xaxis_title='KMEANS_CLUSTERS', yaxis_title='Count', barmode='group')
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return render_template("plotlyChart.html", graphJSON=graphJSON)

@app.route("/api/churn_category_counts", methods=["POST"])
def getChurnCategoryCounts():
    print(churn_category_counts) 
    
    local_churn_category_counts = churn_category_counts
    local_churn_category_counts['ChurnCategory'] = local_churn_category_counts['ChurnCategory'].map(lambda x: x.split()[0].lower())
    pivoted_df = local_churn_category_counts.pivot(index='KMEANS_CLUSTERS', columns='ChurnCategory', values='Count').reset_index()
    pivoted_df = pivoted_df.fillna(0)
    result_list = pivoted_df.to_dict(orient='records')
    print(result_list)
    return jsonify({
        "kCounts": result_list
    })
# Pipeline

# Pytorch

# Get Dataframe

# Pages
def float_format(value):
    return f"{value:,.2f}"

@app.route('/cluster-report/<id>')
def index(id):
    formatted_df = loc_df[loc_df["CLUSTER_KMEANS"] == int(id)].drop(["CLUSTER_KMEANS"], axis=1).describe().T
    count = formatted_df["count"].values[0]
    formatted_df.drop(["count"], axis=1, inplace=True)
    formatted_df.columns = formatted_df.columns.str.capitalize()
    formatted_df.insert(loc=0, column='Feature', value=formatted_df.index)
    table = formatted_df.to_html(table_id='metrics', float_format=float_format, index=False)
    return render_template('report.html', id=id, table=table, count=count, img_path=url_for('static', filename=f'images/plot_cluster/'), default_img_path=url_for('static', filename=f'images/predetermined.png'))

if __name__ == '__main__':
    args = sys.argv[1:]
    if len(args) == 1:
        if args[0] == "report":
            generate_kmeans_report_graphs()
        else:
            print("Invalid argument")
    elif len(args) > 1:
        print("Invalid number of arguments")

    app.run(host='0.0.0.0', debug=False)
