class SortToneButton {
	constructor(/**HTMLButtonElement*/ buttonEl, /**Model*/ model) {
		this.buttonEl = buttonEl;
		this.model = model;
		this.buttonEl.addEventListener("click", this.handleClick.bind(this));
	}

	setState({}) {
		// Nothing to do here
	}

	handleClick() {
		this.model.sortMentionsBy((a, b) => a.source.name < b.source.name).catch(console.error);
	}
}
