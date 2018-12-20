class BarChart {
	constructor(/**HTMLElement*/ container, /**Model*/ model) {
		this.model = model;
		this.createGraph(container);
		this.createScale();
        this.showGrid();
		this.barsGroup = this.svgEl.append("g").attr("id", "bars");
        this.showAxis();
	}

	createScale() {
        this.maxtone = 7;
        const tmpScale = d3.scalePow()
                .exponent(0.3)
                .domain([-this.maxtone, this.maxtone])
                .range([0, 1]);
        this.toneScale = d => d3.interpolateRdYlGn(tmpScale(d));
        this.scaleY = d3.scaleLinear()
                .domain([0, this.maxtone])
                .range([0, -this.height/3.5]);
        this.scaleHeight = d3.scaleLinear()
                .domain([0, this.maxtone])
                .range([0, this.height/3.5]);
        this.scaleBarTop = d3.scaleLinear()
                .domain([0, this.maxtone])
                .range([0, -this.height/3.5])
                .clamp(true);
	}

	setScalers(nsources){
        this.barwidth = 0.8; // percentage
		this.scaleWidth = d3.scaleLinear()
			.domain([0, 1])
			.range([0, this.width * 0.8 / nsources]);
		this.scalePosition = d3.scaleLinear()
			.domain([0, nsources-1])
			.range([this.width*0.1, this.width*0.9]);
	}

	createGraph(/**HTMLElement*/ container) {
		this.svgEl = d3.select(container);

		let viewBox = this.svgEl.attr('viewBox').split(" ");
		this.x = parseFloat(viewBox[0]),
		this.y = parseFloat(viewBox[1]);
		this.width = parseFloat(viewBox[2]),
		this.height = parseFloat(viewBox[3]);

	}

    showGrid(){
        this.grid = this.svgEl.append('g')
		 .attr('class', 'grids');
		this.showXgrid();
    }

	showAxis(){
		this.axis = this.svgEl.append('g')
		 .attr('class', 'axes');
		this.showXaxis();
        this.showTitle();
	}

    showTitle(){
        this.axis.append('text')
            .attr('class', 'title')
            .attr('text-anchor', 'middle')
            .text('Tonality of mentions in the news')
            .attr('x', this.width / 2)
            .attr('y', this.scaleY(this.maxtone*2));
    }

	showXaxis(){
        this.axis.append('line')
            .attr('class', 'xaxis')
            .attr('x1', this.width*0.05)
            .attr('x2', this.width*0.95)
            .attr('y1', 0)
            .attr('y2', 0);
		//this.xlabel = this.axis.append("text")
    }

    showXgrid(){
        let n = 9;
        let scaleGrid =  d3.scaleLinear()
                .domain([0, n-1])
                .range([-this.maxtone, this.maxtone])
        let yArray = Array.from({length: n}, (v, i) => ({y: this.scaleY(scaleGrid(i))}));
        this.grid.selectAll('line .xgrid').data(yArray)
            .enter()
            .append('line')
            .attr('class', 'xgrid')
            .attr('x1', this.width*0.05)
            .attr('x2', this.width*0.95)
            .attr('y1', d => d.y)
            .attr('y2', d => d.y);
    }

    showYgrid(nSources){
        let step = 5;
        let n = Math.floor((nSources )/ step);
        let xArray = Array.from({length: n}, (v, i) => ({x: this.scalePosition(i*step + Math.round(step / 2))}));
        const ygrid = this.grid.selectAll('line.ygrid').data(xArray);
        ygrid
            .enter()
            .append('line')
            .attr('class', 'ygrid')
            .attr('y1', this.scaleY(-this.maxtone))
            .attr('y2', this.scaleY(this.maxtone))
            .merge(ygrid)
            .transition()
            .attr('x1', d => d.x)
            .attr('x2', d => d.x);
        ygrid.exit().remove();
    }

    getTonePerSource(mentions){
	    let sourcesMap = d3.rollup(mentions, v => ({tone: v.reduce((sum, el) => sum + parseFloat(el.tone), 0) / v.length, domain: v[0].source.domain}), d => d.source.name);
        let tonePerSource = [];
        for (const [k,v] of sourcesMap) {
                v.name = k
                tonePerSource.push(v);
        }
        return tonePerSource;
    }

    sortFromPrevious(data){
        let olddata = this.barsGroup.selectAll("g.source").data();
        let inew = 0;
        let imatch;
        let tmp;
        for(let iold = 0; iold < olddata.length; iold++){
            imatch = data.findIndex(d => d.name === olddata[iold].name);
            if(imatch > -1){
                tmp = data[inew];
                data[inew] = data[imatch];
                data[imatch] = tmp;
                inew++;
            }
        }
    }

	setState({ mentions }) {
        let tonePerSource = this.getTonePerSource(mentions);
        this.setScalers(tonePerSource.length);
        this.showYgrid(tonePerSource.length);
        const maxtone = tonePerSource.reduce((max, d) => Math.max( max, d.tone ), 0);
        this.sortFromPrevious(tonePerSource);

        const barGroup = this.barsGroup.selectAll("g.source").data(tonePerSource, d => d.name);
		barGroup.exit().remove();
		const barGroupEnter = barGroup.enter();
		const barGroupEnterG = barGroupEnter
            .append('g')
			.attr("class", "source")
            .attr('transform', (d, i) => `translate(${this.scalePosition(i) - this.scaleWidth(this.barwidth) / 2},0)`);
        barGroupEnterG.append('rect')
            .attr('width', this.scaleWidth(this.barwidth))
            .on("mouseover", this.toggleHighlight)
            .on("mouseout", this.toggleHighlight)
            .on("click", this.onClick);
        barGroupEnterG.append('text')
            .attr('class', 'xticklabel')
            .text(d => d.name)
		this.barGroupEnterUpdate = barGroupEnterG.merge(barGroup);

        this.positionBars();
        this.barGroupEnterUpdate.select('rect')
            .transition()
            .duration(1000)
            .attr('fill', d => this.toneScale(d.tone))
            .attr('y', d => this.scaleBarTop(d.tone))
            .attr('height', d => this.scaleHeight(Math.abs(d.tone)));
        // Place text next to the axis
        this.barGroupEnterUpdate.select('text')
            .transition()
            //.attr('text-anchor', d => d.tone > 0 ? 'end' : 'start')
            //.attr('transform', d => `translate(${this.scaleWidth(this.barwidth) / 2},${this.scaleBarTop(0)})rotate(-90)`);
            .attr('transform', d => `translate(${this.scaleWidth(this.barwidth) / 2},${this.scaleBarTop(maxtone + 0.5)})rotate(-60)`);
            //.attr('transform', d => `translate(${this.scaleWidth(this.barwidth) / 2},${this.scaleY(this.maxtone*1.1)})rotate(-60)`);
    }

    positionBars(sorting){
        let sortfunc = (x,y) => 0;
        switch (sorting){
            case 'tone':
                sortfunc = (x,y) => d3.descending(x.tone, y.tone);
                break;
            case 'alpha':
                sortfunc = (x,y) => d3.descending(x.name, y.name);
                break;
        }
        this.barGroupEnterUpdate
            .sort(sortfunc)
            .transition()
            .duration(1000)
            .attr('transform', (d, i) => `translate(${this.scalePosition(i) - this.scaleWidth(this.barwidth) / 2},0)`);
    }

    toggleHighlight(){
        //d3.event.preventDefault();
        let s = d3.select(this);
        let fill = d3.hsl(s.attr('fill'));
        if (s.classed('highlighted')) {
            fill.l -= 0.15;
            s.classed('highlighted',false)
            .attr('fill', fill)
        } else {
            fill.l += 0.15;
            s.classed('highlighted',true)
            .attr('fill', fill)
        }
    }

    onClick(d){
        let webpage = 'https://' + d.domain;
        window.open(webpage, '_blank');
    }
}
