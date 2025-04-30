import { useState, useEffect, useRef } from "react";
import { insertNode } from "./api";
import * as d3 from "d3";
import "./styles.css";

function App() {
  const [key, setKey] = useState("");
  const [priority, setPriority] = useState("");
  const [treap, setTreap] = useState(null);
  const svgRef = useRef();

  const handleInsert = async () => {
    if (!key) return;
    
    // Tự động sinh priority ngẫu nhiên nếu không nhập
    const nodePriority = priority ? parseInt(priority) : Math.floor(Math.random() * 100);
    
    const response = await insertNode(parseInt(key), nodePriority);
    const treapWithDirections = addDirections(response.treap);
    setTreap(treapWithDirections);
    setPriority("");
  };

  
  const handleChangeHeapType = async (type) => {
    setHeapTypeLocal(type);
    await setHeapType(type); // Gửi request lên backend để đổi heap
    setTreap(null); // Reset cây (tuỳ bạn muốn giữ hay không)
  };


  // Thêm thông tin hướng vào các node
  const addDirections = (node, parentKey = null) => {
    if (!node) return null;
    
    return {
      ...node,
      direction: parentKey !== null 
        ? (node.key < parentKey ? 'left' : 'right') 
        : null,
      left: addDirections(node.left, node.key),
      right: addDirections(node.right, node.key)
    };
  };
 
  useEffect(() => {
    if (!treap) return;
  
    const width = 1000;
    const height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
  
    const g = svg.append("g").attr("transform", "translate(500, 50)");
  
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);
  
    function buildHierarchy(node) {
      if (!node) return null;
      return {
        name: `${node.key}\nP: ${node.priority}`,
        direction: node.direction,
        children: [buildHierarchy(node.left), buildHierarchy(node.right)].filter(Boolean)
      };
    }
  
    const root = d3.hierarchy(buildHierarchy(treap));
  
    const treeLayout = d3.tree()
      .size([width - 400, height - 200])
      .separation((a, b) => {
        if (a.data.direction === 'left') return 2.5;
        if (b.data.direction === 'right') return 0.8;
        return 1;
      });
  
    treeLayout(root);
  
    // Điều chỉnh vị trí x để tăng độ lệch
    root.each(node => {
      if (node.data.direction === 'left') {
        node.x -= 50;
      } else if (node.data.direction === 'right') {
        node.x += 50;
      }
    });
  
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
  
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y))
      .attr("fill", "none")
      .attr("stroke", d => d.target.data.direction === 'left' ? "#ff6b6b" : "#4dabf7")
      .attr("stroke-width", 2)
      .attr("marker-end", d => `url(#arrow-${d.target.data.direction || 'right'})`);
  
    const nodes = g.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);
  
    nodes.append("circle")
      .attr("r", 25)
      .attr("fill", "#fff")
      .attr("stroke", d => d.data.direction === 'left' ? "#ff6b6b" : "#4dabf7")
      .attr("stroke-width", 2);
  
    nodes.append("text")
      .attr("dy", -5)
      .attr("text-anchor", "middle")
      .text(d => d.data.name.split('\n')[0])
      .style("font-size", "12px");
  
    nodes.append("text")
      .attr("dy", 10)
      .attr("text-anchor", "middle")
      .text(d => d.data.name.split('\n')[1])
      .style("font-size", "10px");
  }, [treap]);
  
  
  
  
  
  // useEffect(() => {
  //   if (!treap) return;

  //   const width = 1000;
  //   const height = 600;
  //   const svg = d3.select(svgRef.current);
  //   svg.selectAll("*").remove();

  //   const g = svg.append("g").attr("transform", "translate(100, 50)");

  //   // Cấu hình zoom
  //   const zoom = d3.zoom()
  //     .scaleExtent([0.5, 3])
  //     .on("zoom", (event) => {
  //       g.attr("transform", event.transform);
  //     });
  //   svg.call(zoom);

  //   // Xây dựng hierarchy
  //   function buildHierarchy(node) {
  //     if (!node) return null;
  //     return {
  //       name: `${node.key}\nP:${node.priority}`,
  //       direction: node.key < parentKey ? 'left' : 'right',  // So sánh key để xác định hướng
  //       children: [
  //         buildHierarchy(node.left),
  //         buildHierarchy(node.right)
  //       ].filter(Boolean)
  //     };
  //   }

  //   const root = d3.hierarchy(buildHierarchy(treap));

  //   // Cấu hình layout
  //   const treeLayout = d3.cluster()
  //     .size([width - 200, height - 150])
  //     .separation((a, b) => a.data.direction === 'left' ? 1.5 : 1);

  //   treeLayout(root);

  //   // Thêm marker mũi tên
  //   svg.append("defs").selectAll("marker")
  //     .data(["left", "right"])
  //     .enter()
  //     .append("marker")
  //     .attr("id", d => `arrow-${d}`)
  //     .attr("viewBox", "0 -5 10 10")
  //     .attr("refX", 25)
  //     .attr("refY", 0)
  //     .attr("markerWidth", 6)
  //     .attr("markerHeight", 6)
  //     .attr("orient", d => d === 'left' ? "180" : "0")
  //     .append("path")
  //     .attr("d", "M0,-5L10,0L0,5")
  //     .attr("fill", d => d === 'left' ? "#ff6b6b" : "#4dabf7");

  //   // Vẽ đường nối
  //   g.selectAll(".link")
  //     .data(root.links())
  //     .enter()
  //     .append("path")
  //     .attr("class", "link")
  //     .attr("d", d3.linkHorizontal()
  //       .x(d => d.x)
  //       .y(d => d.y))
  //     .attr("fill", "none")
  //     .attr("stroke", d => d.target.data.direction === 'left' ? "#ff6b6b" : "#4dabf7")
  //     .attr("stroke-width", 2)
  //     .attr("marker-end", d => `url(#arrow-${d.target.data.direction || 'right'})`);

  //   // Vẽ node
  //   const nodes = g.selectAll(".node")
  //     .data(root.descendants())
  //     .enter()
  //     .append("g")
  //     .attr("class", "node")
  //     .attr("transform", d => `translate(${d.x},${d.y})`);

  //   nodes.append("circle")
  //     .attr("r", 20)
  //     .attr("fill", "#fff")
  //     .attr("stroke", d => d.data.direction === 'left' ? "#ff6b6b" : "#4dabf7")
  //     .attr("stroke-width", 2);

  //   nodes.append("text")
  //     .attr("dy", 5)
  //     .attr("text-anchor", "middle")
  //     .text(d => d.data.name)
  //     .style("font-size", "10px");
  // }, [treap]);

  return (
    <div className="container">
      <h1>Treap Visualization</h1>

      
      <div className="controls">
        <input
          type="number"
          placeholder="Key (required)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          type="number"
          placeholder="Priority (random if empty)"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <button onClick={handleInsert}>Insert Node</button>
      </div>
      <svg
        ref={svgRef}
        width="1000"
        height="600"
        style={{ 
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9"
        }}
      ></svg>
    </div>
  );
}

export default App;