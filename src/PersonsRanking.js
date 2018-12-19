class PersonsRanking {
	constructor(/**HTMLElement*/ container, /**Model*/ model) {
		this.model = model;
		this.createScale();
		this.createGraph(container);
        this.nPersons = 30;
	}

	createScale() {
		this.sizeScale = d3.scaleLog()
            .range([30,50])
            .domain([1,10000]);
        this.colorScale = d3.scaleOrdinal()
            .range(d3.schemeCategory10);
	}

	createGraph(/**HTMLElement*/ container) {
		this.svgEl = d3.select(container);
		this.defsGroup = this.svgEl.append("defs").attr("id", "defs");
		this.nodesGroup = this.svgEl.append("g").attr("id", "nodes");

		let viewBox = this.svgEl.attr('viewBox').split(" ");
		this.x = parseFloat(viewBox[0]),
		this.y = parseFloat(viewBox[1]);
		this.width = parseFloat(viewBox[2]),
		this.height = parseFloat(viewBox[3]);
	}

    imageExist(url){
        if(url){
            var req = new XMLHttpRequest();
            req.open('GET', url, false);
            req.send();
            return req.status==200;
        } else {
            return false;
        }
    }

    getPersonsFromMentions(mentions){
        let nodes = data.links;
	    let personsMap = d3.rollup(nodes, v => v.reduce((sum, el) => sum + parseFloat(el.tone), 0) / v.length, d => d.target);
        let persons = [];
        for (const k of personsMap) {
                persons.push({name:k[0], tone:k[1]});
        }
        return persons;
    }

	setData({persons, mentions}) {
        if (persons[0].hasOwnProperty('tone'))
            persons = this.getPersonsFromMentions(mentions);

		const defsEls = this.defsGroup.selectAll("pattern").data(persons, d => d.name);
		const patternEls = defsEls
			.enter()
			.append("pattern");
        patternEls
            .attr('id', d => 'image:' + d.name.replace(/\s+/g, '_'))
            .attr('patternContentUnits', "objectBoundingBox")
            .attr('height', "100%")
            .attr('width', "100%")
        patternEls
            .append('image')
            .attr('y', "-0.0")
            .attr('x', "-0.4")
            .attr('height', "1.8")
            .attr('width', "1.8")
            .attr('href', d => "data/photos/" + d.name + ".jpg");
		defsEls.exit().remove();

		const nodesJoin = this.nodesGroup.selectAll("circle").data(persons, d => d.name);
		const nodesEnterEls = nodesJoin
			.enter()
			.append("circle")
			.attr("r", this.height / this.nPersons * 1.5)
            .style("fill", d => this.imageExist("data/photos/" + d.name + ".jpg") ? `url(#image:${d.name.replace(/\s+/g, '_')})` : this.colorScale(d.name)) 
			.style("stroke", d => this.colorScale(d.name))
			.style("stroke-width", this.height / 500)
			.attr("class", d => "person");
		const nodesEnterUpdateEls = nodesEnterEls.merge(nodesJoin);
		nodesJoin.exit().remove();

        nodesEnterUpdateEls
            .sort((x,y) => d3.descending(x.tone, y.tone))
            .transition()
            .delay(2000)
            .attr("transform", (d,i) => `translate(${this.x + this.width/2 + this.width / 5 * (i % 2 - 0.5)}, ${this.y + this.height / (this.nPersons + 1) * (i+1)})`);
	}
}
