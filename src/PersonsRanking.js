class PersonsRanking {
	constructor(/**HTMLElement*/ container, /**Model*/ model) {
		this.model = model;
		this.createScale();
		this.createGraph(container);
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
			.range([this.height / nPersons / 1.5, (this.height / nPersons) * 1.5])
			.domain([10, 1000]);
	}

	createGraph(/**HTMLElement*/ container) {
		this.svgEl = d3.select(container);
		this.defsGroup = this.svgEl.append("defs").attr("id", "defs");
		this.nodesGroup = this.svgEl.append("g").attr("id", "nodes");

		let viewBox = this.svgEl.attr("viewBox").split(" ");
		(this.x = parseFloat(viewBox[0])), (this.y = parseFloat(viewBox[1]));
		(this.width = parseFloat(viewBox[2])), (this.height = parseFloat(viewBox[3]));
	}

	setState({ persons, mentions, selectedPerson }) {
		this.setScales(persons.length);
		persons.sort((x, y) => y.tone - x.tone);
		//persons.sort((x,y) => y.nmentions - x.mentions);

		const defsEls = this.defsGroup.selectAll("pattern").data(persons, d => d.name);
		const patternEls = defsEls.enter().append("pattern");
		patternEls
			.attr("id", d => "image:" + d.name.replace(/\s+/g, "_"))
			.attr("patternContentUnits", "objectBoundingBox")
			.attr("height", "100%")
			.attr("width", "100%");
		patternEls
			.append("rect")
			.attr("width", 1)
			.attr("height", 1)
			.attr("fill", d => this.colorScale(d.name));
		patternEls
			.append("text")
			.attr("class", "circlename")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "middle")
			.attr("x", 0.5)
			.attr("y", 0.5)
			.text(d =>
				d.name
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
			.attr("href", d => "data/photos/" + d.name + ".jpg");
		defsEls
			.exit()
			.transition()
			.delay(1000)
			.remove();

		const nodesJoin = this.nodesGroup.selectAll("g.person").data(persons, d => d.name);
		nodesJoin
			.exit()
			.transition(1000)
			.attr("transform", (d, i) => `translate(150,${this.circlePositionY(i)})`)
			.transition()
			.delay(1000)
			.remove();
		const nodesEnterEls = nodesJoin
			.enter()
			.append("g")
			.attr("class", "person")
			.attr("transform", (d, i) => `translate(150,${this.circlePositionY(i)})`);
		nodesEnterEls
			.append("circle")
			.style("fill", d => `url(#image:${d.name.replace(/\s+/g, "_")})`)
			.attr("stroke", d => this.toneScale(d.tone))
			.style("stroke-width", d => {
				console.log(d);
				return this.circleSize(d.mentionsCount) / 8;
			})
			.attr("class", d => "person")
			.on("mouseover", this.toggleHighlight)
			.on("mouseout", this.toggleHighlight)
			.on("click", d => this.model.selectPerson(d.name));

		const nodesEnterUpdateEls = nodesEnterEls.merge(nodesJoin);

		nodesEnterUpdateEls
			.transition()
			.duration(2000)
			.attr(
				"transform",
				(d, i) => `translate(${this.circlePositionX(i)},${this.circlePositionY(i)})`
			);
		nodesEnterUpdateEls.select("circle").attr("r", d => this.circleSize(d.mentionsCount));
	}

	toggleHighlight(d) {
		//d3.event.preventDefault();
		let s = d3.select(this);
		let fill = d3.hsl(s.attr("stroke"));
		if (s.classed("highlighted")) {
			fill.l -= 0.15;
			s.classed("highlighted", false).attr("stroke", fill);

			tooltip
				.transition()
				.duration(500)
				.style("opacity", 0);
		} else {
			fill.l += 0.15;
			s.classed("highlighted", true).attr("stroke", fill);

			tooltip
				.transition()
				.duration(200)
				.style("opacity", 0.9);
			tooltip
				.html(d.name)
				.style("left", d3.event.pageX + "px")
				.style("top", d3.event.pageY - 28 + "px")
				.style("color", "black");
		}
	}
}
