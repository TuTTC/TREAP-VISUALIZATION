async function insertNode(key, priority, heapType) {
  try {
    const payload = {
      key: parseInt(key),
      priority: priority !== null ? parseInt(priority) : null,
      heap_type: heapType
    };
    console.log("Request payload:", payload);

    const response = await fetch("http://localhost:5000/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error("Lỗi trong insertNode:", err);
    throw err;
  }
}
async function searchNode(key, heapType = 'max') {
  if (key === null || key === undefined || isNaN(key)) {
    alert("Please enter a valid key!");
    return null;
  }

  try {
    const response = await fetch("http://localhost:5000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: parseInt(key), heap_type: heapType }),
    });

    const result = await response.json();

    if (result.error) {
      return result;
    }

    return result;
  } catch (err) {
    console.error("Search error:", err);
    throw err;
  }
}

async function deleteNode(key, heapType = 'max') {
  if (key === null || key === undefined || isNaN(key)) {
    alert("Please enter a valid key!");
    
  }

  try {
    const response = await fetch("http://localhost:5000/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: parseInt(key), heap_type: heapType }),
    });

    const treap = await response.json();
    return treap;
  } catch (err) {
    console.error("Delete error:", err);
    throw err;
  }
}


// Trong file api.js, sửa hàm getTreap:
async function getTreap() {
  try {
    const response = await fetch("http://localhost:5000/treap");
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    return data || { key: null, priority: null, left: null, right: null }; // Trả về treap rỗng nếu data null
  } catch (err) {
    console.error("getTreap error:", err);
    return { key: null, priority: null, left: null, right: null }; // Luôn trả về object hợp lệ
  }
}

// Gửi kiểu heap (max hoặc min) lên server
async function setHeapType(type) {
    try {
        const response = await fetch("http://localhost:5000/heap_type", {  // ← Sửa ở đây
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ heap_type: type }),  // ← Và cả ở đây
        });

        const result = await response.json();

        if (result.error) {
            alert("Failed to set heap type: " + result.error);
            return null;
        }

        return result;
    } catch (err) {
        console.error("setHeapType error:", err);
        alert("Failed to set heap type.");
        return null;
    }
}


// Cho React hoặc các module khác dùng:
export { insertNode, searchNode, deleteNode, getTreap, setHeapType };

