class GraphSimulation {
	constructor() {
		const linksForce = d3
			.forceLink()
			.id(d => d.id)
			.strength(d => d.tone / 10000)
			.distance(50);

		const chargeForce = d3
			.forceManyBody()
			.strength(node => (node.type === "source" ? 0.1 : -2));

		const radialForce = d3
			.forceRadial(node => (node.type === "source" ? 200 : 100))
			.strength(2.0);

		this._simulation = d3
			.forceSimulation()
			.force("links", linksForce)
			.force("charge", chargeForce)
			.force("radial", radialForce);
	}

	onTick(/**function*/ callback) {
		this._simulation.on("tick", callback);
	}

	updateData(/**{nodes: array, links: array}*/ data) {
		this._simulation.nodes(data.nodes);
		this._simulation.force("links").links(data.links);
		this._simulation.alphaTarget(0.3).restart();
	}
}
