function drawTreap(data) {
    const svg = d3.select("#treap-svg");
    svg.selectAll("*").remove();  // Xóa Treap cũ trước khi vẽ lại

    const width = 800;
    const height = 500;
    const nodeRadius = 30;

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

        nodes.each(function (d) {
            const g = d3.select(this);
            const r = nodeRadius;
        
            // Nửa trên: trắng
            g.append("path")
                .attr("d", `M 0 0 L ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0 Z`)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", 1);

        
            // Nửa dưới: lightblue
            g.append("path")
                .attr("d", `M 0 0 L ${r} 0 A ${r} ${r} 0 0 0 ${-r} 0 Z`)
                .attr("fill", "lightblue")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
        
            // Đường phân cách ngang
            // g.append("line")
            //     .attr("x1", -r)
            //     //.attr("y1", 0)
            //     .attr("x2", r)
            //     //.attr("y2", 0)
            //     .attr("stroke", "black")
            //     .attr("stroke-width", 1);
        
            // Tách key và priority từ chuỗi "key (P: priority)"
            const [key, pRaw] = d.data.name.split(" (P: ");
            const priority = pRaw.replace(")", "");
        
            // Text key
            g.append("text")
                .attr("x", 0)
                .attr("y", -10)
                .attr("text-anchor", "middle")
                .attr("font-family", "Verdana" )
                .attr("font-size", "10px")
                .text(key);
        
            // Text priority
            g.append("text")
                .attr("x", 0)
                .attr("y", 18)
                .attr("text-anchor", "middle")
                .attr("font-family", "Verdana" )
                .attr("font-size", "10px")
                .text("P: " + priority);
            });
}
