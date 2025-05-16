import random

class TreapNode:
    def __init__(self, key, priority=None):
        self.key = key
        self.priority = priority if priority is not None else random.randint(1, 10000)
        self.left = None
        self.right = None

class Treap:
    def __init__(self, heap_type='max'):
        """
        heap_type: 'max' for max-heap by priority, 'min' for min-heap by priority
        """
        self.root = None
        self.heap_type = heap_type

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

    def _insert(self, root, key, priority):
        if not root:
            return TreapNode(key, priority)

        if key < root.key:
            root.left = self._insert(root.left, key, priority)
            if (self.heap_type == 'max' and root.left.priority > root.priority) or \
               (self.heap_type == 'min' and root.left.priority < root.priority):
                root = self.rotate_right(root)
        else:
            root.right = self._insert(root.right, key, priority)
            if (self.heap_type == 'max' and root.right.priority > root.priority) or \
               (self.heap_type == 'min' and root.right.priority < root.priority):
                root = self.rotate_left(root)
        return root

    def insert_node(self, key, priority=None):
        if key is None:
            raise ValueError("Key must be provided for insertion")
        self.root = self._insert(self.root, key, priority)

    def _delete(self, root, key):
        if root is None:
            return None
        if key < root.key:
            root.left = self._delete(root.left, key)
        elif key > root.key:
            root.right = self._delete(root.right, key)
        else:
            # node to delete found
            if root.left and root.right:
                # rotate child with higher priority up
                if (self.heap_type == 'max' and root.left.priority > root.right.priority) or \
                   (self.heap_type == 'min' and root.left.priority < root.right.priority):
                    root = self.rotate_right(root)
                    root.right = self._delete(root.right, key)
                else:
                    root = self.rotate_left(root)
                    root.left = self._delete(root.left, key)
            else:
                root = root.left if root.left else root.right
        return root

    def delete_node(self, key):
        if key is None:
            raise ValueError("Key must be provided for deletion")
        self.root = self._delete(self.root, key)

    def _search(self, root, key):
        if root is None or root.key == key:
            return root
        if key < root.key:
            return self._search(root.left, key)
        return self._search(root.right, key)

    def search_node(self, key):
        if key is None:
            return None
        node = self._search(self.root, key)
        if node:
            return {"key": node.key, "priority": node.priority}
        return None

    def _to_dict(self, node):
        if not node:
            return None
        return {
            "key": node.key,
            "priority": node.priority,
            "left": self._to_dict(node.left),
            "right": self._to_dict(node.right)
        }

    def get_tree(self):
        return self._to_dict(self.root)

    def generate_random_tree(self, n, value_range=(1, 100)):
        keys = random.sample(range(value_range[0], value_range[1] + 1), n)
        self.root = None
        for key in keys:
            self.insert_node(key, random.randint(1, 10000))

    def serialize_treap(self, node=None):
        return self.get_tree() if node is None else self._to_dict(node)
