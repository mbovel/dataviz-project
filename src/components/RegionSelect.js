class RegionSelect {
	constructor(/**HTMLElement*/ selectEl, /**Model*/ model) {
		this.selectEl = selectEl;
		this.model = model;

		this.selectEl.addEventListener("change", this.handleSelect.bind(this));
	}

	setState({ options: { region } }) {
		selectOption(this.selectEl, region);
	}

	handleSelect() {
		this.model.setOptions({ region: this.selectEl.value });
	}
}
