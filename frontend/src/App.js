import { useState, useEffect, useRef } from "react";
import { insertNode } from "./api";
import * as d3 from "d3";
import "./styles.css";

function App() {
    const [key, setKey] = useState("");
    const [priority, setPriority] = useState("");
    const [treap, setTreap] = useState([]);
    const svgRef = useRef();

    const handleInsert = async () => {
        const response = await insertNode(parseInt(key), parseInt(priority));
        setTreap(response.treap);
    };

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous content

        // Create nodes
        svg.selectAll("circle")
            .data(treap)
            .enter()
            .append("circle")
            .attr("cx", (d, i) => i * 50 + 50)
            .attr("cy", 50)
            .attr("r", 20)
            .attr("fill", "blue");

        // Create labels
        svg.selectAll("text")
            .data(treap)
            .enter()
            .append("text")
            .attr("x", (d, i) => i * 50 + 50)
            .attr("y", 55)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text(d => `${d[0]} (P: ${d[1]})`);
    }, [treap]);

    return (
        <div className="container">
            <h1>Treap Visualization</h1>
            <div>
                <input type="number" placeholder="Key" value={key} onChange={(e) => setKey(e.target.value)} />
                <input type="number" placeholder="Priority" value={priority} onChange={(e) => setPriority(e.target.value)} />
                <button onClick={handleInsert}>Insert</button>
            </div>
            <svg ref={svgRef} width="800" height="200"></svg>
        </div>
    );
}

export default App;
