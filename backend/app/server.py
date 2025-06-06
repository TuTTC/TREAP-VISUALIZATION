from flask import Blueprint, request, jsonify
from .models import Treap
from flask_cors import CORS
import random

app = Blueprint('server', __name__)
CORS(app)
# Initialize treap with default max-heap behavior
treap = Treap()

def make_response_json(data=None, error=None, code=200):
    if error:
        return jsonify({"error": error}), code
    return jsonify(data), code

# API to insert a node
# @app.route("/insert", methods=["POST"])
# def insert():
#     global treap
#     data = request.get_json() or {}
#     key = data.get("key")
#     priority = data.get("priority")
#     heap_type = data.get("heap_type", treap.heap_type)

#     if key is None:
#         return make_response_json(error="Missing key for insertion", code=400)
#     if heap_type not in ['max', 'min']:
#         return make_response_json(error="Invalid heap_type, must be 'max' or 'min'", code=400)

#     try:
#         if heap_type != treap.heap_type:
#             treap = Treap(heap_type=heap_type)
#         treap.insert_node(key, priority)
#         return make_response_json(data=treap.get_tree())
    
#     except ValueError as e:
#         return make_response_json(error=str(e), code=400)
@app.route("/insert", methods=["POST"])
def insert():
    
    
    # Debug: In ra dữ liệu nhận được
    
    
    global treap
    data = request.get_json()
    
    try:
        key = int(data['key'])
        # Xử lý khi priority là null hoặc không có
        priority = int(data['priority']) if 'priority' in data and data['priority'] is not None else random.randint(1, 100)
        
        treap.insert_node(key, priority)
        
        return jsonify({
            "success": True,
            "tree": {
                "key": treap.root.key,
                "priority": treap.root.priority,
                "left": node_to_dict(treap.root.left),
                "right": node_to_dict(treap.root.right)
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
def node_to_dict(node):
    if not node:
        return None
    return {
        "key": node.key,
        "priority": node.priority,
        "left": node_to_dict(node.left),
        "right": node_to_dict(node.right)
    }


@app.route("/delete", methods=["POST"])
def delete():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        key = data.get('key')
        if key is None:
            return jsonify({"success": False, "error": "Key is required"}), 400

        try:
            key = int(key)
        except (ValueError, TypeError):
            return jsonify({"success": False, "error": "Key must be a number"}), 400

        if not hasattr(treap, 'root') or treap.root is None:
            return jsonify({"success": False, "error": "Treap is empty"}), 404

        treap.delete_node(key)
        
        return jsonify({
            "success": True,
            "tree": serialize_node(treap.root) if treap.root else None
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
def serialize_node(node):
    if not node:
        return None
    return {
        "key": node.key,
        "priority": node.priority,
        "left": serialize_node(node.left),
        "right": serialize_node(node.right)
    }


# API to search for a node
@app.route("/search", methods=["POST"])
def search():
    global treap
    data = request.get_json()
    if not data or 'key' not in data:
        return jsonify({"success": False, "error": "Invalid request"}), 400

    try:
        key = int(data['key'])
        found = treap.search_node(key)  # Giả sử bạn đã có method search trong Treap
        return jsonify({
            "success": True,
            "found": found,
            "key": key
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# API to get the whole treap
@app.route("/treap", methods=["GET"])
def get_treap():
    global treap
    return make_response_json(data=treap.get_tree())
    

# API to set heap type (max or min)
@app.route("/heap_type", methods=["POST"])
def set_heap_type():
    global treap
    data = request.get_json() or {}
    heap_type = data.get("heap_type")

    if heap_type not in ['max', 'min']:
        return make_response_json(error="Invalid heap_type, must be 'max' or 'min'", code=400)

    
    treap = Treap(heap_type=heap_type)  # Reset the treap with new heap type
    return make_response_json(data={"heap_type": treap.heap_type})
