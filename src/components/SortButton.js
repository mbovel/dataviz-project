class SortButton {
	constructor(/**HTMLButtonElement*/ buttonEl, /**Model*/ model, /**string*/ sortBy) {
		this.buttonEl = buttonEl;
		this.model = model;
		this.sortBy = sortBy;

		this.buttonEl.addEventListener("click", this.handleClick.bind(this));
	}

	setState() {
		// Nothing to do
	}

	handleClick() {
		this.model.setOptions({ sortBy: this.sortBy });
	}
}
