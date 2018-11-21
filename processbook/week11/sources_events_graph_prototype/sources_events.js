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

function mod(a, n){
    return (a % n + n) % n
}


class GraphSimulation {
    constructor(id){
        this.getSVG(id);

        this.simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { return d.id; }))
			.force("charge", d3.forceManyBody().strength(this.manyForce))
			.force("radial", d3.forceRadial(this.width/3, this.width / 2, this.height / 2).radius(this.radRadius).strength(2.0))
			.force("center", d3.forceCenter(this.width / 2, this.height / 2));
        this.simulation.parentObj = this;
    }
	updateData(data){
        this.nodes = data.nodes;
        this.links = data.links;

		this.simulation
			.nodes(this.nodes)
            .on("end", this.drawFirst);
            //.on("tick", this.updatePlot);

		this.simulation.force("link")
		.links(this.links);
	}
    drawFirst(){
        this.parentObj.plot.updatePlot();
        this.on('tick', this.parentObj.updatePlot);
    }
    updatePlot(){
        this.parentObj.plot.updatePlot();
    }
    getSVG(id){
		this.svg = d3.select("#" + id);
		let viewBox = this.svg.attr('viewBox').split(" ");
		this.width = parseFloat(viewBox[2]),
		this.height = parseFloat(viewBox[3]);
    }
	manyForce(node){
		return node.type == 'event' ? -2 : -0.1;
	}
	radRadius(node){
		//return node.type == 'event' ? 50 : null;
		return node.type == 'event' ? 80 : 30;
	}
}

class GraphPlot {
	/* your code here */
    constructor(id, simulation){
        this.getSVG(id);
        this.simulation = simulation;

        this.link_type = 'path'; // 'line'
        //this.link_type = 'line';

		this.showCanvas();
		this.showLegend();
		this.showControls();
        this.createGraph();
        this.makeScalers();
	}
    createGraph(){
        this.svg.append('g')
            .attr('id', 'links')
        let nodes = this.svg.append('g').attr('id', 'nodes');
        nodes.append('g')
            .attr('id', 'eventnodes');
        nodes.append('g')
            .attr('id', 'sourcenodes');
    }
    getSVG(id){
		this.svg = d3.select("#" + id);
		let viewBox = this.svg.attr('viewBox').split(" ");
		this.width = parseFloat(viewBox[2]),
		this.height = parseFloat(viewBox[3]);
    }
    updateData(data){
        this.nodes = data.nodes;
        this.links = data.links;
    }
	updatePlot(){
		this.eventnode_circles = this.svg.select('#eventnodes').selectAll("circle")
            .data(this.nodes.filter(d => d.type == 'event'));
		this.sourcenode_circles = this.svg.select('#sourcenodes').selectAll("circle")
            .data(this.nodes.filter(d => d.type == 'source'));
		this.node_circles = this.svg.select('#nodes').selectAll("circle");

		this.link_lines = this.svg.select('#links').selectAll(this.link_type)
            .data(this.links);
		this.updateSelection();
		this.exitSelection();
		this.enterSelection();
	}
	updateSelection(){
		this.link_lines
			//.transition()
            .call(this.positionLinks, this);
		this.node_circles
			//.transition()
			.attr('cx', (d, i) => d.x)
			.attr('cy', (d, i) => d.y);
	}
	exitSelection(){
		this.node_circles.exit().remove();
		this.link_lines.exit().remove();
	}
    makeScalers(){
		let tmpScale = d3.scalePow()
			.exponent(0.3)
			.domain([-10, 10])
			.range([1, 0]);
        this.toneScale = (d) => d3.interpolateRdBu(tmpScale(d));
    }
	enterSelection(){
		this.link_lines = this.link_lines
		 .enter()
		 .append(this.link_type)
		    .classed('link', true)
			.attr('stroke', d => this.toneScale(d.MentionDocTone))
			.attr('stroke-opacity', (d) => d.Confidence / 300)
            .call(this.positionLinks, this);

		this.sourcenode_circles = this.sourcenode_circles
		 .enter()
		 .append('circle')
		    .classed('source', true)
		this.eventnode_circles = this.eventnode_circles
		 .enter()
		 .append('circle')
			.classed('event', true)
        this.node_circles = this.svg.select('#nodes').selectAll("circle")
		//this.node_circles = this.node_circles
			.attr('cx', (d, i) => d.x)
			.attr('cy', (d, i) => d.y)
            .call(d3.drag()
              .on("start", this.dragstarted)
              .on("drag", this.dragged)
              .on("end", this.dragended))
			.on("contextmenu", this.toggle_selected);
    }
	dragstarted(d) {
	  if (!d3.event.active) simulation.simulation.alphaTarget(0.3).restart();
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}
	dragged(d) {
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}
	dragended(d) {
      if (!d3.event.active) simulation.simulation.alphaTarget(0);
	  simulation.simulation.stop();
	  d.fx = null;
	  d.fy = null;
	}
    toggle_selected(d, i){
        d3.event.preventDefault();
        let s = d3.select(this);
        let l = d3.select('#links').selectAll(this.link_type)
            .filter(function(d2, i2) { return d2.source == d || d2.target == d; })
        if (s.classed('selected')) {
            s.classed('selected',false);
            l.classed('selected',false)
                .transition()
                .attr('stroke-opacity', (d) => d.Confidence / 300)
        } else {
            let size = l.size();
            l = l
                .raise();
            s.classed('selected',true);
            l.classed('selected',true)
                .transition()
                .attr('stroke-opacity', (d) => d.Confidence / 50)
        }
    }
    positionLinks(links, plotObj){
        if (this.link_type == 'line')
            links
                .attr('x1', (d, i) => d.target.x)
                .attr('y1', (d, i) => d.target.y)
                .attr('x2', (d, i) => d.source.x)
                .attr('y2', (d, i) => d.source.y);
        else
            links
                .attr('d', plotObj.linkAvoidCenter)
                .attr('fill', 'none');
    }
    linkAvoidCenter(d,i){
        let c = new Victor(100,100);
        let targetv = Victor.fromObject(d.target).subtract(c);
        let sourcev = Victor.fromObject(d.source).subtract(c);
        let angleDiff =  targetv.angleDeg() - sourcev.angleDeg();
        if (Math.abs(angleDiff) > 180){
            angleDiff = mod(angleDiff + 180, 360) - 180;
        }
        sourcev.rotateDeg(angleDiff/3);
        let scale =  Math.abs(angleDiff) / 180  / 3 * 8 + 1;
        sourcev.multiply(new Victor(scale, scale))
        sourcev.add(c);
        let x = sourcev.x;
        let y = sourcev.y;
        return "M " + d.target.x + " " + d.target.y
               + " S " + x + " " + y
               + ", " + d.source.x + " " + d.source.y;
    }

	showCanvas(){
		this.svg
            .append('rect')
		    .attr('class', 'plotarea')
		    .attr('x', 0)
		    .attr('y', 0)
		    .attr('width', this.width)
		    .attr('height', this.height);
	}
	showLegend(){
		let data = [{x: 5, y: 5, type: 'event'},
				{x: 5, y: 10, type: 'source'},
				];
		let group = this.svg.append('g')
  			.attr('class', 'legend');
        group = group.selectAll("g")
		 .data(data)
		 .enter()
		 .append('g')
		group.append('circle')
			.attr('class', (d) => d.type)
			.attr('cx', (d, i) => d.x)
			.attr('cy', (d, i) => d.y-1.5);
		group.append('text')
			.attr('class', (d) => d.type)
			.text((d) => d.type )
			.attr('x', (d, i) => d.x + 3)
			.attr('y', (d, i) => d.y);
	}
	showControls(){
		let data = [{x: 155, y: 5, action: 'click', effect: 'drag'},
				{x: 155, y: 10, action: 'right-click', effect: 'highlight'},
				];
		let group = this.svg.append('g')
  			.attr('class', 'controls');
        group = group.selectAll("g")
		 .data(data)
		 .enter()
		 .append('g')
		group.append('text')
			.text((d) => d.action +':' )
			.attr('x', (d, i) => d.x)
			.attr('y', (d, i) => d.y);
		group.append('text')
			.text((d) => d.effect )
			.attr('x', (d, i) => d.x + 25)
			.attr('y', (d, i) => d.y);
	}
}

function loadEventmentions(filename){
    return d3.csv(filename,
        function(d) {
            d.source = d.MentionSourceName;
            d.target = d.GLOBALEVENTID;
            d.Confidence = parseFloat(d.Confidence);
            return d
    });
}

function extractNodes(data){
    node_set = new Set(Array.from(data, d => d.source));
    nodes = Array.from(node_set, x => ({id:x, x:0, y:0, type:'source'}));
    node_set = new Set(Array.from(data, d => d.target));
    nodes = nodes.concat(Array.from(node_set, x => ({id:x, x:0, y:0, type:'event'})));
    let result = {nodes: nodes, links: data}
    return result
}

svgID = 'plot';
const simulation = new GraphSimulation(svgID);
const plot = new GraphPlot(svgID, simulation);
simulation.plot = plot; 

whenDocumentLoaded(() => {

	// prepare the data here
	filename = "eventmentions_20181119_1_filtered.csv";
    loadEventmentions(filename)
        .then(function(data){
            data = extractNodes(data);
            simulation.updateData(data);
            plot.updateData(data);
        });
});

