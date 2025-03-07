from flask import Flask, request, jsonify
from flask_cors import CORS
from treap import Treap

app = Flask(__name__)
CORS(app)

treap = Treap()

@app.route("/insert", methods=["POST"])
def insert():
    data = request.json
    key = data.get("key")
    priority = data.get("priority")
    if key is None:
        return jsonify({"error": "Missing key"}), 400

    treap.insert_node(key, priority)
    return jsonify(treap.get_tree())

@app.route("/delete", methods=["POST"])
def delete():
    data = request.json
    key = data.get("key")

    if key is None:
        return jsonify({"error": "Missing key"}), 400

    print("Before delete:", treap.get_tree())  # Debug trước khi xóa
    treap.delete_node(key)
    print("After delete:", treap.get_tree())   # Debug sau khi xóa

    return jsonify(treap.get_tree())  # Trả về cây sau khi xóa

@app.route("/search", methods=["POST"])
def search():
    data = request.json
    key = data.get("key")

    if key is None:
        return jsonify({"error": "Missing key"}), 400

    key = int(key)  # Ép kiểu về int

    node = treap.search_node(key)
    if node:
        return jsonify(node)
    return jsonify({"error": f"Key {key} not found"}), 404

@app.route("/get", methods=["GET"])
def get_tree():
    return jsonify(treap.get_tree())

if __name__ == "__main__":
    app.run(debug=True)
