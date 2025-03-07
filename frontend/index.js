function drawTreap(data) {
    const svg = d3.select("#treap-svg");
    svg.selectAll("*").remove();  // Xóa Treap cũ trước khi vẽ lại

    const width = 800;
    const height = 500;
    const nodeRadius = 20;

    const treapGroup = svg.append("g").attr("transform", "translate(50, 50)");

    function createHierarchy(node) {
        if (!node) return null;
        return {
            name: `${node.key} (P: ${node.priority})`,
            children: [createHierarchy(node.left), createHierarchy(node.right)].filter(Boolean),
        };
    }

    const root = d3.hierarchy(createHierarchy(data));
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    const treeData = treeLayout(root);

    const links = treapGroup.selectAll(".link")
        .data(treeData.links())
        .enter()
        .append("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke", "black");

    const nodes = treapGroup.selectAll(".node")
        .data(treeData.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

    nodes.append("circle")
        .attr("r", nodeRadius);

    nodes.append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .text(d => d.data.name);
}
