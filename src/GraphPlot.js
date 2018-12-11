class GraphPlot {
	constructor(/**HTMLElement*/ container) {
		this.simulation = new GraphSimulation();
		this.createScale();
		this.createGraph(container);
	}

	createScale() {
		const tmpScale = d3
			.scalePow()
			.exponent(0.3)
			.domain([-10, 10])
			.range([1, 0]);
		this.toneScale = d => d3.interpolateRdYlGn(tmpScale(d));
	}

	createGraph(/**HTMLElement*/ container) {
		this.svgEl = d3.select(container);
		this.linksGroup = this.svgEl.append("g").attr("id", "links");
		this.nodesGroup = this.svgEl.append("g").attr("id", "nodes");
	}

	updateData(/**{nodes: array, links: array}*/ data) {
		const linksJoin = this.linksGroup.selectAll("path").data(data.links);
		const linksEls = linksJoin
			.enter()
			.append("path")
			.classed("link", true)
			.attr("stroke", d => this.toneScale(d["tone"]));
		linksJoin.exit().remove();

		const nodesJoin = this.nodesGroup.selectAll("circle").data(data.nodes);
		const nodesEls = nodesJoin
			.enter()
			.append("circle")
			.attr("r", 1)
			.attr("class", d => "node " + d.type);
		nodesJoin.exit().remove();

		this.simulation.updateData(data);
		this.simulation.onTick(() => {
			nodesEls.attr("transform", d => `translate(${d.x}, ${d.y})`);
			linksEls.attr("d", GraphPlot.linkAvoidCenter);
		});
	}

	static linkAvoidCenter(/**object*/ link) {
		const targetv = Victor.fromObject(link.target);
		const sourcev = Victor.fromObject(link.source);

		let angleDiff = targetv.angleDeg() - sourcev.angleDeg();
		if (Math.abs(angleDiff) > 180) {
			angleDiff = mod(angleDiff + 180, 360) - 180;
		}
		sourcev.rotateDeg(angleDiff / 2);

		const scale = (Math.abs(angleDiff) / 180 / 3) * 8 + 1;
		sourcev.multiply(new Victor(scale, scale));

		return `M${link.target.x} ${link.target.y}
                S${sourcev.x} ${sourcev.y}, ${link.source.x} ${link.source.y}`;
	}
}
