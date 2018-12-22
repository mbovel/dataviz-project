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

	createGraph(/**HTMLElement*/ container) {
		this.svgEl = d3.select(container);
		this.defsGroup = this.svgEl.append("defs").attr("id", "defs");
		this.nodesGroup = this.svgEl.append("g").attr("id", "nodes");

		let viewBox = this.svgEl.attr("viewBox").split(" ");
		this.width = parseFloat(viewBox[2]);
		this.height = parseFloat(viewBox[3]);
	}

	setState({ data: { persons: personsRaw, selectedPerson } }) {
		const pack = d3
			.pack()
			.size([this.width, this.height])
			.padding(2);

		const root = d3.hierarchy({ children: personsRaw }).sum(d => d.mentionsCount);

		const persons = pack(root).leaves();

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

		// Not removing exiting elements enables simple images caching.
		// defsEls.exit().remove();

		const nodesJoin = this.nodesGroup.selectAll(".person").data(persons, d => d.data.name);

		// EXIT
		nodesJoin
			.exit()
			.attr("transform", d => `translate(150,${d.y})`)
			.remove();

		// ENTER
		const nodesEnterEls = nodesJoin
			.enter()
			.append("circle")
			.attr("r", d => d.r)
			.attr("transform", d => `translate(150,${d.y})`)
			.attr("class", "person")
			.style("fill", d => `url(#image:${d.data.name.replace(/\s+/g, "_")})`)
			.style("stroke-width", this.height / 100)
			.on("mouseover", this.showTooltip.bind(this))
			.on("mouseout", this.hideTooltip.bind(this))
			.on("click", d => this.model.setOptions({ selectedPerson: d.data.name }));

		// UPDATE
		nodesEnterEls
			.merge(nodesJoin)
			.transition()
			.duration(1000)
			.attr("r", d => d.r)
			.attr("transform", d => `translate(${d.x},${d.y})`)
			.attr("stroke", d => this.toneScale(d.data.tone));
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
