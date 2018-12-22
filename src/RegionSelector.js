class RegionSelector {
	constructor(/**HTMLElement*/ container, /**Model*/ model) {
		this.container = container;
		this.selectEl = this.container.querySelector("select");
		this.model = model;
		this.selectEl.addEventListener("change", this.onSelect.bind(this));
	}

	setState({ region }) {
		this.selectEl.selectedIndex = [this.selectEl.options].map(el => el.value).indexOf(region);
	}

	onSelect() {
		this.model.setRegion(this.selectEl.value).catch(console.log);
	}
}
