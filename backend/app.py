from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return "Hello, World!"

@app.route("/backend/test", methods=['GET'])
def hello():
    return jsonify("Hello, World!")

# everything is hosted @ https://127.0.0.1:5000/...
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)