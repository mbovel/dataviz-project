class GraphPlot {
	constructor(/**HTMLElement*/ container) {
		this.container = d3.select(container);
		this.simulation = new GraphSimulation();

		this.container
			.append("circle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 230);

		this.container
			.append("text")
			.attr("x", 0)
			.attr("y", 0)
			.attr("text-anchor", "middle")
			.text("[Graph here]");
	}

	async setTimeRange(/**number*/ year, /**number*/ month, /**number*/ day) {}
}
