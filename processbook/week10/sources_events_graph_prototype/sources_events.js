/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

simulation = d3.forceSimulation();

class GraphPlot {
	/* your code here */
    constructor(id, datafilename){
		this.svg = d3.select("#" + id);
		this.nodes = [];
		this.links = [];

		let viewBox = this.svg.attr('viewBox').split(" ");
		this.width = parseFloat(viewBox[2]),
		this.height = parseFloat(viewBox[3]);

		//this.simulation = d3.forceSimulation()
		this.simulation = simulation
			.force("link", d3.forceLink().id(function(d) { return d.id; }))
			.force("charge", d3.forceManyBody().strength(this.manyForce))
			.force("radial", d3.forceRadial(this.width/3, this.width / 2, this.height / 2).radius(this.radRadius).strength(0.3))
			.force("center", d3.forceCenter(this.width / 2, this.height / 2));

		this.simulation.GraphPlot = this;
		this.showCanvas();
		this.makeLegend();

		this.loadEventmentions(datafilename)
			.then(data => this.updateSimulation(data));
	}
	showCanvas(){
		this.svg.append('rect')
		 .attr('class', 'plotarea')
		 .attr('x', 0)
		 .attr('y', 0)
		 .attr('width', this.width)
		 .attr('height', this.height);
	}
	updateSimulationTest(data){
		this.updateNodes(data);
		console.log(this.nodes);
		console.log(data);
	}
	manyForce(node){
		return node.type == 0 ? -20 : -1;
	}
	radRadius(node){
		//return node.type == 0 ? 50 : null;
		return node.type == 0 ? null : 80;
	}
	updateNodes(data){
		this.node_set = new Set(Array.from(data, d => d.source));
		this.nodes = Array.from(this.node_set, x => ({id:x, x:0, y:0, type:0}));
		this.node_set = new Set(Array.from(data, d => d.target));
		this.nodes = this.nodes.concat(Array.from(this.node_set, x => ({id:x, x:0, y:0, type:1})));
	}
	updateSimulation(data){
		this.updateNodes(data);
		this.links = data;
		this.simulation
			.nodes(this.nodes)
			//.on("end", this.updatePlot);
			.on("tick", this.updatePlot);

		this.simulation.force("link")
		.links(this.links);
	}
	dragstarted(d) {
	  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}
	dragged(d) {
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}
	dragended(d) {
	  if (!d3.event.active) simulation.alphaTarget(0);
	  d.fx = null;
	  d.fy = null;
	}
	print(){
		console.log(this.svg.attr("width"))
	}
	updatePlot(){
		this.GraphPlot.node_circles = this.GraphPlot
			.svg.selectAll("circle.node")
		 .data(this.GraphPlot.nodes);
		this.GraphPlot.link_lines = this.GraphPlot
			.svg.selectAll("line.link")
		 .data(this.GraphPlot.links);
		this.GraphPlot.updateSelection();
		this.GraphPlot.exitSelection();
		this.GraphPlot.enterSelection();
	}

	updateSelection(){
		this.link_lines
			//.transition()
			.attr('x1', (d, i) => d.source.x)
			.attr('y1', (d, i) => d.source.y)
			.attr('x2', (d, i) => d.target.x)
			.attr('y2', (d, i) => d.target.y);
		this.node_circles
			//.transition()
			.attr('cx', (d, i) => d.x)
			.attr('cy', (d, i) => d.y);
	}
	enterSelection(){
		let toneScale = d3.scalePow()
			.exponent(0.3)
			.domain([-10, 10])
			.range([1, 0]);
		this.link_lines = this.link_lines
		 .enter()
		 .append('line')
			.attr('class', 'link')
			.attr('stroke', d => d3.interpolateRdYlBu(toneScale(d.MentionDocTone)))
			.attr('stroke-opacity', (d) => d.Confidence + "%")
			.attr('stroke-width', 0.05)
			.attr('x1', (d, i) => d.source.x)
			.attr('y1', (d, i) => d.source.y)
			.attr('x2', (d, i) => d.target.x)
			.attr('y2', (d, i) => d.target.y);
		this.node_circles = this.node_circles
		 .enter()
		 .append('circle')
			.attr('class', 'node')
			.classed('event', (d) => d.type == 0)
		    .classed('source', (d) => d.type == 1)
			.attr('r', (d) => d.type == 0 ? 1 : 0.6)
			.attr('cx', (d, i) => d.x)
			.attr('cy', (d, i) => d.y)
			.call(d3.drag()
			  .on("start", this.dragstarted)
			  .on("drag", this.dragged)
			  .on("end", this.dragended))
			.on("click", function(d,i) {
				let s = d3.select(this);
				let l = d3.selectAll("line.link").filter(function(d2, i2) { return d2.source == d; });
				let t = d3
						.transition()
						.ease(d3.easeBack);
				if (l.empty())
					l = d3.selectAll("line.link").filter(function(d2, i2) { return d2.target == d; });
				if (s.classed('selected')) {
					s.classed('selected',false);
					s.filter(".event")
						.transition(t)
						.attr('r', 1);
					s.filter(".source")
						.transition(t)
						.attr('r', 0.6);
					l.classed('selected',false)
						.transition(t)
						.attr('stroke-width', 0.05);
				} else {
					s.classed('selected',true);
					s.filter(".event")
						.transition(t)
						.attr('r', 2);
					s.filter(".source")
						.transition(t)
						.attr('r', 1.2);
					l.classed('selected',true)
						.transition(t)
						.attr('stroke-width', 0.6);
				}
			});
	}
	exitSelection(){
		this.node_circles.exit().remove();
		this.link_lines.exit().remove();
	}

	makeLegend(){
		let data = [{x: 5, y: 5, type: 0},
				{x: 5, y: 10, type: 1},
				];
		let group = this.svg.selectAll("g.legend")
		 .data(data)
		 .enter()
		 .append('g')
  			.attr('class', 'legend');
		group.append('circle')
  			.attr('class', 'legend')
			.attr('class', (d) => d.type == 0 ? 'event' : 'source')
			.attr('r', (d) => d.type == 0 ? 1 : 0.6)
			.attr('cx', (d, i) => d.x)
			.attr('cy', (d, i) => d.y);
		group.append('text')
			.attr('class', 'legend')
			.attr('class', (d) => d.type == 0 ? 'event' : 'source')
			.text((d) => d.type == 0 ? 'Events' : 'Sources')
			.attr('x', (d, i) => d.x + 3)
			.attr('y', (d, i) => d.y + 1.5);
	}
	loadEventmentions(filename){
		return d3.csv(filename,
			function(d) {
				d.source = d.GLOBALEVENTID;
				d.target = d.MentionSourceName;
				return d
		});
	}
}


whenDocumentLoaded(() => {

	filename = "eventmentions_20181119_1_filtered.csv";
	// prepare the data here
	const plot = new GraphPlot('plot', filename);
});

