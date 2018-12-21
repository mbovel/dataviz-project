class RegionSelector {
	constructor(/**HTMLElement*/ container, /**Model*/ model) {
		this.container = container;
		this.selectEl = this.container.querySelector('select');
		this.model = model;
		console.log(this.selectEl)
	}

	setState({ region }) {
		console.log(this.selectEl)
	}
}
