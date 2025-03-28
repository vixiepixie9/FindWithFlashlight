from flask import Flask, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import os


app = Flask(__name__, static_url_path='/static')
CORS(app, resources={r"/*": {"origins": "*"}})

#file_path = "D:\UE MWT\Клиентско уеб програмиране\FindWithMagnifier\items.xlsx"
file_path = os.path.join(os.path.dirname(__file__), "items.xlsx")

@app.route('/')
def index():
    return render_template('magnifier.html')

@app.route('/items', methods=['GET'])
def get_items():
    if not os.path.exists(file_path):
        return jsonify({"error": "Файлът items.xlsx не е намерен"}), 404
    
    df = pd.read_excel(file_path, skiprows=1, usecols=[1,2,3])
    df.columns = ["name", "correct", "image"]
    items = df.to_dict(orient="records")
    return jsonify(items)

if __name__ == '__main__':
    app.run(debug=True, port=5500)
