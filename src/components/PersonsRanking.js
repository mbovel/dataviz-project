class PersonsRanking {
	constructor(/**HTMLElement*/ container, /**Model*/ model) {
		this.model = model;
		this.createScale();
		this.createGraph(container);
		this.tooltip = d3
			.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0)
			.style("top", 0);
	}

	createScale() {
		this.colorScale = d3
			.scaleOrdinal()
			//.range(d3.schemeCategory10);
			.range(d3.schemeSet3);
		const maxtone = 7;
		const tmpScale = d3
			.scalePow()
			.exponent(0.3)
			.domain([-maxtone, maxtone])
			.range([0, 1]);
		this.toneScale = d => d3.interpolateRdYlGn(tmpScale(d));
	}

	setScales(nPersons) {
		this.circlePositionX = i => this.x + this.width / 2 + (this.width / 5) * ((i % 3) - 1);
		this.circlePositionY = i => this.y + (this.height / (nPersons + 1)) * (i + 1);
		this.circleSize = d3
			.scaleLog()
			.range([this.width / 2, this.width])
			.domain([100, 1000]);
	}

	createGraph(/**HTMLElement*/ container) {
		this.svgEl = d3.select(container);
		this.defsGroup = this.svgEl.append("defs").attr("id", "defs");
		this.nodesGroup = this.svgEl.append("g").attr("id", "nodes");

		let viewBox = this.svgEl.attr("viewBox").split(" ");
		(this.x = parseFloat(viewBox[0])), (this.y = parseFloat(viewBox[1]));
		(this.width = parseFloat(viewBox[2])), (this.height = parseFloat(viewBox[3]));
	}

	setState({ data: { persons } }) {
		this.setScales(persons.length);

		let pack = d3
			.pack()
			.size([this.width, this.height])
			.padding(1.5);

		let root = d3
			.hierarchy({ children: persons })
			//.sum(d =>  this.circleSize(d.mentionsCount))
			.sum(d => d.mentionsCount);

		persons = pack(root).leaves();

		const defsEls = this.defsGroup.selectAll("pattern").data(persons, d => d.data.name);
		const patternEls = defsEls.enter().append("pattern");
		patternEls
			.attr("id", d => "image:" + d.data.name.replace(/\s+/g, "_"))
			.attr("patternContentUnits", "objectBoundingBox")
			.attr("height", "100%")
			.attr("width", "100%");
		patternEls
			.append("rect")
			.attr("width", 1)
			.attr("height", 1)
			.attr("fill", "#bbb");
		patternEls
			.append("text")
			.attr("class", "circlename")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "middle")
			.attr("x", 0.5)
			.attr("y", 0.5)
			.text(d =>
				d.data.name
					.split(" ")
					.map(n => n.charAt(0))
					.join("")
			);
		patternEls
			.append("image")
			.attr("y", "-0.0")
			.attr("x", "-0.4")
			.attr("height", "1.8")
			.attr("width", "1.8")
			.on("error", function(d) {
				d3.select(this).attr("href", "data/photos/Empty.png");
			})
			.attr("href", d => "data/photos/" + d.data.name + ".jpg");

		// Not removing enables simple images caching.
		// defsEls.exit().remove();

		const nodesJoin = this.nodesGroup.selectAll("g.person").data(persons, d => d.data.name);
		nodesJoin
			.exit()
			//.transition(1000)
			.attr("transform", (d, i) => `translate(150,${d.y})`)
			//.transition()
			//.delay(1000)
			.remove();
		const nodesEnterEls = nodesJoin
			.enter()
			.append("g")
			.attr("class", "person")
			.attr("transform", (d, i) => `translate(150,${d.y})`);
		nodesEnterEls
			.append("circle")
			.style("fill", d => `url(#image:${d.data.name.replace(/\s+/g, "_")})`)
			.attr("stroke", d => this.toneScale(d.data.tone))
			.style("stroke-width", d => {
				return this.height / 300;
			})
			.attr("class", d => "person")
			.on("mouseover", this.showTooltip.bind(this))
			.on("mouseout", this.hideTooltip.bind(this))
			.on("click", d => this.model.setOptions({ selectedPerson: d.data.name }));

		const nodesEnterUpdateEls = nodesEnterEls.merge(nodesJoin);

		nodesEnterUpdateEls
			//.transition()
			//.duration(2000)
			.attr("transform", (d, i) => `translate(${d.x},${d.y})`);
		nodesEnterUpdateEls.select("circle").attr("r", d => d.r);
	}

	showTooltip(d, i, nodes) {
		const { bottom, left, right } = nodes[i].getBoundingClientRect();
		const width = right - left;
		this.tooltip
			.html(`<p>${d.data.name}</p><p>(${d.data.mentionsCount} mentions)</p>`)
			.style("top", bottom - 5 + "px")
			.style("left", left + (width - this.tooltip.node().clientWidth) / 2 + "px")
			.transition()
			.duration(500)
			.style("opacity", 0.9);
	}

	hideTooltip() {
		this.tooltip
			.transition()
			.duration(500)
			.style("opacity", 0);
	}
}
