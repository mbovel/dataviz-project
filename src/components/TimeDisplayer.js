const d3TimeFormaters = {
	D: d3.timeFormat("%A %-d"),
	M: d3.timeFormat("%B"),
	Y: d3.timeFormat("%Y")
};

class TimeDisplayer {
	constructor(/**HTMLElement*/ container, /**Model*/ model) {
		this.container = container;
	}

	setState({ options: { date, freq } }) {
		this.container.textContent = d3TimeFormaters[freq](date);
	}
}
