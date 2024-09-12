from flask import Flask

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return "Hello, World!"

@app.route("/backend", methods=['GET'])
def hello():
    return "Hello, World!"

# everything is hosted @ https://127.0.0.1:5000/...
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)