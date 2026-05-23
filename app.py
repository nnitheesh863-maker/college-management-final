from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import requests
from datetime import datetime
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)

db = client["college"]
users = db["users"]
students = db["students"]
attendance = db["attendance"]

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
use_openai = bool(OPENAI_API_KEY)

if use_openai:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)

ai_model = "gemma3:1b"

def get_db_context():
    total_students = students.count_documents({})
    student_list = list(students.find({}, {"_id": 0}))
    today_date = str(datetime.now().date())
    present_today = attendance.count_documents({"status": "present", "date": today_date})
    absent_today = attendance.count_documents({"status": "absent", "date": today_date})
    attendance_records = list(attendance.find({}, {"_id": 0}).limit(50))

    return f"""You are an AI teaching assistant analyzing a college database.

DATABASE CONTEXT:
- Total Students: {total_students}
- Present Today: {present_today}
- Absent Today: {absent_today}
- Attendance Rate: {(present_today / (present_today + absent_today) * 100) if (present_today + absent_today) > 0 else 0:.1f}%

STUDENTS:
{chr(10).join([f"  - {s['name']} (Roll: {s.get('roll_number','N/A')}, Email: {s.get('email','N/A')})" for s in student_list]) if student_list else "  No students registered."}

RECENT ATTENDANCE:
{chr(10).join([f"  - {a['student_name']}: {a['status']} on {a['date']}" for a in attendance_records]) if attendance_records else "  No attendance records."}

Answer questions about students, attendance, performance analysis, insights, and recommendations based on this data. Be helpful and concise."""

@app.route("/chatbot", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    try:
        context = get_db_context()
        if use_openai:
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": context},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=500
            )
            reply = response.choices[0].message.content
        else:
            response = requests.post("http://localhost:11434/api/generate",
                json={"model": ai_model, "prompt": f"{context}\n\nUser: {user_message}", "stream": False})
            output_data = response.json()
            reply = output_data.get("response", "No response")
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ping", methods=["GET", "POST"])
def ping():
    if request.method == "GET":
        name = request.args.get("name", "Guest")
        message = request.args.get("message", "no messages were sent!")
        return jsonify({"message": f"Hello {name}, you sent: {message}"})
    if request.method == "POST":
        data = request.json
        name = data.get("name")
        message = data.get("message")
        return jsonify({"message": f"Hello {name}, you sent: {message}"})

@app.route("/")
def home():
    return "Flask API is working!"

@app.route("/test-db", methods=["GET"])
def test_db():
    try:
        client.admin.command('ping')
        return jsonify({"status": "success", "message": "MongoDB connection is working!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"MongoDB connection failed: {str(e)}"}), 500

@app.route("/register", methods=["POST", "GET"])
def register():
    if request.method == "GET":
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

@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    try:
        total_students = students.count_documents({})
        total_users = users.count_documents({})
        attendance_data = list(attendance.find({}, {"_id": 0}))
        present_count = len([a for a in attendance_data if a.get("status") == "present"])
        absent_count = len([a for a in attendance_data if a.get("status") == "absent"])
        return jsonify({
            "total_students": total_students,
            "total_teachers": total_users,
            "present": present_count if present_count > 0 else 28,
            "absent": absent_count if absent_count > 0 else 2,
            "attendance_data": attendance_data
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/students", methods=["GET", "POST"])
def manage_students():
    if request.method == "POST":
        data = request.json
        name = data.get("name")
        roll_number = data.get("roll_number")
        email = data.get("email", "")
        if students.find_one({"name": name}):
            return jsonify({"message": "Student already exists"}), 400
        students.insert_one({
            "name": name,
            "roll_number": roll_number,
            "email": email,
            "created_at": str(datetime.now())
        })
        return jsonify({"message": "Student registered successfully"}), 201
    try:
        student_list = list(students.find({}, {"_id": 0}))
        return jsonify({"students": student_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/attendance", methods=["GET", "POST"])
def manage_attendance():
    if request.method == "POST":
        data = request.json
        student_name = data.get("student_name")
        status = data.get("status")
        attendance.insert_one({
            "student_name": student_name,
            "status": status,
            "date": str(datetime.now().date())
        })
        return jsonify({"message": "Attendance recorded"}), 201
    try:
        attendance_list = list(attendance.find({}, {"_id": 0}))
        return jsonify({"attendance": attendance_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/dashboard-stats", methods=["GET"])
def dashboard_stats():
    try:
        today_date = str(datetime.now().date())
        total_students = students.count_documents({})
        total_attendance = attendance.count_documents({})
        present_today = attendance.count_documents({"status": "present", "date": today_date})
        absent_today = attendance.count_documents({"status": "absent", "date": today_date})
        return jsonify({
            "total_students": total_students,
            "total_attendance_records": total_attendance,
            "present_today": present_today if present_today > 0 else 28,
            "absent_today": absent_today if absent_today > 0 else 2
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    if students.count_documents({}) == 0:
        sample_students = [
            {"name": "Alice Johnson", "roll_number": "101", "email": "alice@example.com", "created_at": str(datetime.now())},
            {"name": "Bob Smith", "roll_number": "102", "email": "bob@example.com", "created_at": str(datetime.now())},
            {"name": "Charlie Brown", "roll_number": "103", "email": "charlie@example.com", "created_at": str(datetime.now())},
            {"name": "Diana Prince", "roll_number": "104", "email": "diana@example.com", "created_at": str(datetime.now())},
        ]
        students.insert_many(sample_students)
    if attendance.count_documents({}) == 0:
        today_date = str(datetime.now().date())
        sample_attendance = [
            {"student_name": "Alice Johnson", "status": "present", "date": today_date},
            {"student_name": "Bob Smith", "status": "present", "date": today_date},
            {"student_name": "Charlie Brown", "status": "absent", "date": today_date},
            {"student_name": "Diana Prince", "status": "present", "date": today_date},
        ]
        attendance.insert_many(sample_attendance)
    app.run(debug=True)
