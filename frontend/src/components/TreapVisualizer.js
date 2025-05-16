import React, { useEffect, useRef, useState } from "react";
import { insertNode, deleteNode, searchNode, getTreap, setHeapType } from "../api";
import * as d3 from "d3";
import axios from "axios";


function TreapVisualizer() {
  const [error, setError] = useState(null);
  const svgRef = useRef();
  const [treap, setTreap] = useState(null);
  const [key, setKey] = useState("");
  const [priority, setPriority] = useState("");
  const [heapType, setHeap] = useState("max");
  const [zoomLevel, setZoomLevel] = useState(1);
  
  useEffect(() => {
    fetchTree();
  }, []);

const fetchTree = async () => {
    try {
        const data = await getTreap();
        if (data) {
            setTreap(addDirections(data));
        } else {
            // Khởi tạo treap rỗng nếu server trả về null
            setTreap(null);
        }
    } catch (err) {
        console.error("Fetch tree error:", err);
    }
  };

    // Tạo dummy node
  const createDummyNode = () => ({
    key: null,
    priority: null,
    isDummy: true,
    direction: "dummy"
  });

  // Hàm XOR để kiểm tra node có 1 con
  const myXOR = (a, b) => (a || b) && !(a && b);

  

  const addDirections = (node, direction = "root") => {
  if (!node || node.key === null) return null;
  
  return {
    ...node,
    direction,
    left: node.left ? addDirections(node.left, "left") : null,
    right: node.right ? addDirections(node.right, "right") : null
  };
};


  // Hàm xây dựng hierarchy với dummy nodes
  const buildHierarchy = (data) => {
    return d3.hierarchy(data, function(d) {
      d.children = [];
      
      if (d.left) {
        d.children.push(d.left);
        if (myXOR(d.left, d.right)) {
          // Thêm dummy node sau left child nếu là only child
          d.children.push(createDummyNode());
        }
      }
      
      if (d.right) {
        if (myXOR(d.left, d.right)) {
          // Thêm dummy node trước right child nếu là only child
          d.children.unshift(createDummyNode());
        }
        d.children.push(d.right);
      }
      
      return d.children;
    });
  };


// const handleInsert = async () => {
//     if (!key) {
//         alert("Please enter a key.");
//         return;
//     }
    
//     try {
//         // Gọi đúng thứ tự tham số
//         const response = await insertNode(
//             parseInt(key), 
//             priority ? parseInt(priority) : null,
//             heapType
//         );
        
//         if (response) {
//             setTreap(addDirections(response.data));
//             setKey("");
//             setPriority("");
//         }
//     } catch (err) {
//         console.error("Insert failed:", err);
//         alert("Insert failed: " + err.message);
//     }
//   };

// const handleInsert = async () => {
//   // Kiểm tra input
//   if (!key || isNaN(key)) {
//     setError("Vui lòng nhập key hợp lệ (phải là số)");
//     return;
//   }

//   try {
//     console.log("Đang thêm node với:", { key, priority, heapType }); // Debug log
    
//     const response = await insertNode(
//       parseInt(key),
//       priority ? parseInt(priority) : null,
//       heapType
//     );
    
//     console.log("Kết quả từ server:", response); // Debug log
    
//     if (response && !response.error) {
//       setTreap(addDirections(response));
//       setKey("");
//       setPriority("");
//       setError(null);
//     } else {
//       setError(response?.error || "Không thể thêm node");
//     }
//   } catch (err) {
//     console.error("Lỗi khi thêm node:", err);
//     setError(err.message || "Lỗi khi thêm node");
//   }
// };
const handleInsert = async () => {
  if (!key || isNaN(key)) {
    setError("Vui lòng nhập key hợp lệ (phải là số)");
    return;
  }

  try {
    console.log("Đang gửi yêu cầu thêm node:", { 
      key: parseInt(key),
      priority: priority ? parseInt(priority) : null,
      heapType 
    });

    const response = await insertNode(
      parseInt(key),
      priority ? parseInt(priority) : null,
      heapType
    );

    console.log("Phản hồi từ server:", response);

    if (response && response.tree) {  // Kiểm tra response.tree
      setTreap(addDirections(response.tree));  // Sử dụng response.tree
      setKey("");
      setPriority("");
      setError(null);
    } else {
      setError(response?.error || "Dữ liệu trả về không hợp lệ");
    }
  } catch (err) {
    console.error("Lỗi khi thêm node:", err);
    setError(err.message || "Lỗi khi thêm node");
  }
};


//   const handleDelete = async () => {
//   if (!key) {
//     alert("Please enter a key to delete.");
//     return;
//   }
//   try {
//     const response = await deleteNode(parseInt(key), heapType);
//     if (response.error) {
//       alert(response.error);
//       return;
//     }
//     setTreap(addDirections(response));
//     setKey("");
//   } catch (err) {
//     console.error("Delete failed:", err);
//     alert("Delete failed.");
//   }
// };

const handleDelete = async (keyToDelete) => {
   console.log('Key nhận được:', keyToDelete);
  if (keyToDelete === null || keyToDelete === undefined || keyToDelete === "") {
    alert("Vui lòng nhập key hợp lệ!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        key: Number(keyToDelete),
        heap_type: heapType // Make sure this is defined in your component
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      // Use the error message from backend if available
      throw new Error(result.error || "Lỗi API không xác định");
    }

    if (!result.success) {
      throw new Error(result.error || "Xóa không thành công");
    }

    setTreap(result.tree || null);
    // alert("Xóa thành công!");

  } catch (err) {
    console.error("Lỗi khi xóa:", err);
    alert(`Lỗi khi xóa: ${err.message}`);
    // Optional: Set error state for UI feedback
    setError(err.message);
  }
};

// const handleSearch = async () => {
//   if (!key) {
//     alert("Please enter a key to search.");
//     return;
//   }
//   try {
//     const result = await searchNode(parseInt(key), heapType);
//     if (result.error) {
//       alert(result.error);
//       return;
//     }
//     alert(`Found: key = ${result.key}, priority = ${result.priority}`);
//   } catch (err) {
//     alert("Node not found.");
//   }
//   };

const handleSearch = async (keyToSearch) => {
  // Kiểm tra giá trị key
  if (keyToSearch === '' || isNaN(Number(keyToSearch))) {
    alert("Vui lòng nhập key hợp lệ!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        key: Number(keyToSearch)
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Lỗi khi tìm kiếm");
    }

    if (result.found) {
      alert(`Tìm thấy key ${keyToSearch}!`);
      // Highlight node tìm được trên giao diện
      highlightNode(keyToSearch); 
    } else {
      alert(`Không tìm thấy key ${keyToSearch}`);
    }

  } catch (err) {
    console.error("Lỗi khi tìm kiếm:", err);
    alert(`Lỗi tìm kiếm: ${err.message}`);
  }
};
  const highlightNode = (key) => {
  // Logic để highlight node trên giao diện
  // Ví dụ: thay đổi màu sắc node tìm được
  d3.select(`circle.node-${key}`)
    .attr("fill", "red")
    .transition()
    .duration(1000)
    .attr("fill", "steelblue");
};
  const handleChangeHeapType = async (type) => {
    try {
      await setHeapType(type);
      setHeap(type);
      fetchTree(); // reload tree
    } catch (err) {
      alert("Failed to change heap type.");
    }
  };

  
  useEffect(() => {
    console.log("Current treap data:", treap); 
    if (!treap || treap.key === null) {
    d3.select(svgRef.current).selectAll("*").remove(); // Clear SVG if treap is empty
    return;
  }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const nodeRadius = 25;

    const g = svg.append("g").attr("transform", `translate(${width/2},50) scale(${zoomLevel})`);

    // Zoom and pan functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Build tree hierarchy
    const root = buildHierarchy(treap);
    const treeLayout = d3.tree()
      .size([width - 200, height - 150])
      .separation((a, b) => {
        if (a.data.direction === 'left') return 1.5;
        if (b.data.direction === 'right') return 0.8;
        return 1;
      });
    treeLayout(root);

    // Draw links with arrows
    svg.append("defs").selectAll("marker")
      .data(["left", "right"])
      .enter()
      .append("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", d => d === 'left' ? "#ff6b6b" : "#4dabf7");

    // Vẽ links (ẩn link đến dummy nodes)
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", d => d.target.data.isDummy ? "link hidden" : "link")
      .attr("d", d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y))
      .attr("fill", "none")
      .attr("stroke", d => d.target.data.direction === 'left' ? "#ff6b6b" : "#4dabf7")
      .attr("stroke-width", 2)
      .attr("marker-end", d => 
        d.target.data.isDummy ? "" : `url(#arrow-${d.target.data.direction || 'right'})`
      );

    // Draw nodes (ẩn dummy nodes)
    const nodes = g.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", d => d.data.isDummy ? "node hidden" : "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Node background circle (chỉ vẽ cho node thật)
    nodes.filter(d => !d.data.isDummy).append("circle")
      .attr("r", nodeRadius)
      .attr("fill", "#fff")
      .attr("stroke", d => d.data.direction === 'left' ? "#ff6b6b" : "#4dabf7")
      .attr("stroke-width", 2)
      .attr("class", d => `node-${d.data.key}`);

    // Horizontal divider line
    nodes.filter(d => !d.data.isDummy).append("line")
      .attr("x1", -nodeRadius)
      .attr("y1", 0)
      .attr("x2", nodeRadius)
      .attr("y2", 0)
      .attr("stroke", "#333")
      .attr("stroke-width", 1);

    // Colored semicircles
    nodes.filter(d => !d.data.isDummy).append("path")
      .attr("d", `M ${-nodeRadius} 0 A ${nodeRadius} ${nodeRadius} 0 0 1 ${nodeRadius} 0 Z`)
      .attr("fill", d => d.data.direction === 'left' ? "rgba(255, 107, 107, 0.2)" : "rgba(77, 171, 247, 0.2)");

    // Key text (top half)
    nodes.filter(d => !d.data.isDummy).append("text")
      .attr("dy", -10)
      .attr("text-anchor", "middle")
      .text(d => d.data.key)
      .style("font-size", "12px")
      .style("font-weight", "bold");

    // Priority text (bottom half)
    nodes.filter(d => !d.data.isDummy).append("text")
      .attr("dy", 15)
      .attr("text-anchor", "middle")
      .text(d => `${d.data.priority}`)
      .style("font-size", "10px");
  }, [treap, zoomLevel]);

return (
  <div>
    <div className="controls">
      <input
        type="number"
        placeholder="Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <input
        type="number"
        placeholder="Priority (optional)"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      />
      <button onClick={handleInsert}>Insert</button>
      <button onClick={() => handleDelete(key)}>Delete</button> {/* Fixed here */}
      <button onClick={() => handleSearch(key)}>Search</button>
    </div>
    
    <div className="heap-toggle">
      <span>Heap Type: </span>
      <button onClick={() => handleChangeHeapType("max")} disabled={heapType === "max"}>
        Max Heap
      </button>
      <button onClick={() => handleChangeHeapType("min")} disabled={heapType === "min"}>
        Min Heap
      </button>
    </div>

    <svg ref={svgRef} width={800} height={600} />
  </div>
);
}

export default TreapVisualizer;
