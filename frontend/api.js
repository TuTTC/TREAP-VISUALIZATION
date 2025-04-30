async function insertNode() {
    const key = document.getElementById("key").value;
    const priority = document.getElementById("priority").value || null;
    const heapType = document.getElementById("heapType").value; // Lấy kiểu Heap từ dropdown

    if (!key) {
        alert("Please enter a key.");
        return;
    }

    const response = await fetch("http://localhost:5000/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: parseInt(key), priority: priority ? parseInt(priority) : null,
            heapType: heapType  // Gửi kiểu heap (max hoặc min)
         }),
    });

    const treap = await response.json();
    drawTreap(treap);
}

async function searchNode() {
    let keyInput = document.getElementById("key"); // Lấy giá trị từ input
    const heapType = document.getElementById("heapType").value; // Lấy kiểu heap từ dropdown
    if (!keyInput) {
        console.error("Lỗi: Không tìm thấy input có ID 'key'");
        alert("Lỗi: Không tìm thấy ô nhập key!");
        return;
    }

    let key = keyInput.value.trim(); // Lấy giá trị và loại bỏ khoảng trắng

    if (key === "") {
        alert("Vui lòng nhập một key hợp lệ!");
        return;
    }

    key = Number(key); // Chuyển key thành số
    if (isNaN(key)) {
        alert("Key phải là một số!");
        return;
    }

    console.log("🔍 Searching for:", key);

    const response = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key, 
            heapType: heapType // Gửi kiểu heap (max hoặc min)
         }) // Gửi đúng định dạng JSON
    });

    const result = await response.json();
    console.log("📌 Search result:", result);

    if (result.error) {
        alert(result.error);
    } else {
        alert(`✅ Found: key ${result.key}, priority ${result.priority}`);
    }
}

async function deleteNode() {
    const key = document.getElementById("key").value;
    const heapType = document.getElementById("heapType").value; // Lấy kiểu heap từ dropdown
    if (!key) {
        alert("Please enter a key to delete.");
        return;
    }

    console.log("Sending delete request for key:", key); // Debug log

    const response = await fetch("http://localhost:5000/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: parseInt(key),
            heapType: heapType // Gửi kiểu heap (max hoặc min)
         }),
    });

    const treap = await response.json();
    console.log("Updated Treap:", treap); // Debug log
    drawTreap(treap); // Cập nhật lại UI
}




// Đảm bảo các hàm này có thể được gọi từ index.html
window.searchNode = searchNode;
window.deleteNode = deleteNode;
