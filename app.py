from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import requests

MONGO_URI = "mongodb+srv://kiruthik:29792979@cluster0.rcl14uv.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
ai_model="gemma3:1b"

db = client["teacher_app"]
users = db["users"]  # collection for storing teachers

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains so React can call this API

@app.route("/chatbot", methods=["POST"])
def chat():
    data=request.json
    user_message=data.get("message","")
    try:
        response=requests.post( "http://localhost:11434/api/generate",
            json={"model": ai_model, "prompt": user_message,"stream": False},)
        output_data=response.json()
        reply=output_data.get("response","No response")
        return jsonify({"reply":reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/ping", methods=["GET", "POST"])
def ping():
    if request.method == "GET":
        name=request.args.get("name","Guest")
        message=request.args.get("message","no messages were sent!")
        return jsonify({"message": f"Hello {name}, you sent: {message}"})
    if request.method == "POST":
        data=request.json
        name=data.get("name")
        message=data.get("message")
        return jsonify({"message": f"Hello {name}, you sent: {message}"})
@app.route("/")
def home():
    return "Flask API is working!"

@app.route("/register", methods=["POST","GET"])
def register():
    if request.method=="GET":
        return "Good boys send JSONs via POST method..!"
    data = request.json
    name = data.get("name")
    password = data.get("password")

    if users.find_one({"name": name}):
        return jsonify({"message": "User already exists"})

    users.insert_one({"name": name, "password": password})
    return jsonify({"message": "User registered successfully"})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    name = data.get("name")
    password = data.get("password")

    user = users.find_one({"name": name, "password": password})
    if user:
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route("/analyze", methods=["GET", "POST"])
def analyze():
    if request.method == "POST":
        data = request.json
        name = data.get("name", "")
        marks = data.get("marks", "")

        # Simple logic: just respond with a message using received data
        message = f"Received data for student {name} with marks {marks}."
        return jsonify({"message": message})

    # For GET requests, just return a test message
    return jsonify({"message": "Send POST requests to analyze student data."})

if __name__ == "__main__":
    app.run(debug=True)