class AttrSelect {
	constructor(/**HTMLElement*/ selectEl, /**Model*/ model, /**string*/ attr) {
		this.selectEl = selectEl;
		this.model = model;
		this.attr = attr;

		this.selectEl.addEventListener("change", this.handleSelect.bind(this));
	}

	setState({ options }) {
		selectOption(this.selectEl, options[this.attr]);
	}

	handleSelect() {
		this.model.setOptions({ [this.attr]: this.selectEl.value });
	}
}
