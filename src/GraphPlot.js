class GraphPlot {
	constructor(/**HTMLElement*/ container) {
		this.simulation = new GraphSimulation();
		this.createScale();
		this.createGraph(container);
        makeMapLegend();
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
        let innerring = link.target;
        let outerring = link.source;
		const innerVec = Victor.fromObject(innerring);
		const outerVec = Victor.fromObject(outerring);

		let angleDiff = outerVec.angleDeg() - innerVec.angleDeg();
		if (Math.abs(angleDiff) > 180) {
			angleDiff = mod(angleDiff + 180, 360) - 180;
		}
		innerVec.rotateDeg(angleDiff / 3);

		const scale = (Math.abs(angleDiff) / 180 / 1) * 2 + 1;
		innerVec.multiply(new Victor(scale, scale));

		return `M${innerring.x} ${innerring.y}
                S${innerVec.x} ${innerVec.y}, ${outerring.x} ${outerring.y}`;
	}
}
