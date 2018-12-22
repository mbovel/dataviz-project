class FreqSelect {
	constructor(/**HTMLButtonElement*/ selectEl, /**Model*/ model) {
		this.selectEl = selectEl;
		this.model = model;

		this.selectEl.addEventListener("change", this.handleSelect.bind(this));
	}

	setState({ options: { freq } }) {
		selectOption(this.selectEl, freq);
	}

	handleSelect() {
		this.model.setOptions({ freq: this.selectEl.value });
	}
}
