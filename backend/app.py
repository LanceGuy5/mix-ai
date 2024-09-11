from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, World!"

@app.route("/backend", methods=['GET'])
def hello():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)