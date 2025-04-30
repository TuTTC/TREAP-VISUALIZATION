import random

class TreapNode:
    def __init__(self, key, priority=None):
        self.key = key
        self.priority = priority if priority is not None else random.randint(1, 100)
        self.left = None
        self.right = None

class Treap:
    def __init__(self):
        self.root = None

    def rotate_right(self, node):
        new_root = node.left
        node.left = new_root.right
        new_root.right = node
        return new_root

    def rotate_left(self, node):
        new_root = node.right
        node.right = new_root.left
        new_root.left = node
        return new_root

    def insert(self, root, key, priority):
        if not root:
            return TreapNode(key, priority)

        if key < root.key:
            root.left = self.insert(root.left, key, priority)
            if root.left.priority > root.priority:
                root = self.rotate_right(root)
        else:
            root.right = self.insert(root.right, key, priority)
            if root.right.priority > root.priority:
                root = self.rotate_left(root)
        return root
    
    def insert_min(self, root, key, priority):
        if not root:
            return TreapNode(key, priority)

        if key < root.key:
            root.left = self.insert(root.left, key, priority)
            if root.left.priority < root.priority:
                root = self.rotate_right(root)
        else:
            root.right = self.insert(root.right, key, priority)
            if root.right.priority < root.priority:
                root = self.rotate_left(root)
        return root

    def delete(self, root, key):
        if root is None:
            return root
        if key < root.key:
            root.left = self.delete(root.left, key)
        elif key > root.key:
            root.right = self.delete(root.right, key)
        else:
        # Xóa node có 2 con
            if root.left and root.right:
                if root.left.priority > root.right.priority:
                    root = self.rotate_right(root)
                    root.right = self.delete(root.right, key)
                else:
                    root = self.rotate_left(root)
                    root.left = self.delete(root.left, key)
            else:
                root = root.left if root.left else root.right  # Xóa node có 1 hoặc 0 con
        return root  # Trả về cây đã cập nhật

    def delete_node(self, key):
        print(f"Deleting key {key}")  # Debug
        self.root = self.delete(self.root, key)  # Cập nhật self.root


    def to_dict(self, node):
        if not node:
            return None
        return {
            "key": node.key,
            "priority": node.priority,
            "left": self.to_dict(node.left),
            "right": self.to_dict(node.right)
        }
    
    def insert_node(self, key, priority=None):
        self.root = self.insert(self.root, key, priority)

    def insert_node_min(self, key, priority=None):
        self.root = self.insert_min(self.root, key, priority)

    def delete_node(self, key):
        self.root = self.delete(self.root, key)

    def get_tree(self):
        return self.to_dict(self.root)
    def search(self, root, key):
        if not root or root.key == key:
            return root
        if key < root.key:
            return self.search(root.left, key)
        return self.search(root.right, key)
    
    def _search(self, root, key):
        """Hàm tìm kiếm node trong Treap"""
        if root is None:
            return None
        if root.key == key:
            return root
        elif key < root.key:
            return self._search(root.left, key)
        else:
            return self._search(root.right, key)

    def search_node(self, key):
        node = self._search(self.root, key)
        if node:
            return {"key": node.key, "priority": node.priority}
        return None


