from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
FLASK_SECRET = os.getenv("FLASK_SECRET", "shared-flask-secret-2026")

use_openai = bool(OPENAI_API_KEY)
openai_client = OpenAI(api_key=OPENAI_API_KEY) if use_openai else None
ai_model = os.getenv("OLLAMA_MODEL", "gemma3:1b")
ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")

def verify_auth(request):
    token = request.headers.get("X-Api-Key", "")
    if token != FLASK_SECRET:
        return jsonify({"error": "Unauthorized"}), 401
    return None

@app.route("/ai/chat", methods=["POST"])
def ai_chat():
    auth_err = verify_auth(request)
    if auth_err:
        return auth_err

    data = request.json
    system_prompt = data.get("systemPrompt", "")
    message = data.get("message", "")

    if not message:
        return jsonify({"reply": "No message provided."})

    try:
        if use_openai:
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=600,
                temperature=0.7,
            )
            reply = response.choices[0].message.content
        else:
            prompt = f"{system_prompt}\n\nUser ({data.get('role','user')}): {message}\n\nAI Assistant:"
            ollama_resp = requests.post(
                ollama_url,
                json={"model": ai_model, "prompt": prompt, "stream": False},
                timeout=30
            )
            output = ollama_resp.json()
            reply = output.get("response", "No response from Ollama.")
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": f"AI service error: {str(e)}"}), 500

@app.route("/ai/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "openai_configured": use_openai,
        "model": "gpt-4o-mini" if use_openai else ai_model,
    })

@app.route("/ping", methods=["GET", "POST"])
def ping():
    if request.method == "GET":
        name = request.args.get("name", "Guest")
        message = request.args.get("message", "no messages were sent!")
        return jsonify({"message": f"Hello {name}, you sent: {message}"})
    data = request.json
    return jsonify({"message": f"Hello {data.get('name')}, you sent: {data.get('message')}"})

@app.route("/")
def home():
    return "Flask AI Server is running!"

if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5000))
    app.run(debug=True, port=port)
