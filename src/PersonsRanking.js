class PersonsRanking {
	constructor(/**HTMLElement*/ container, /**Model*/ model) {
		this.container = container;
		this.model = model;
	}

	setState({ persons }) {
		this.container.innerHTML =
			"<ol>" + persons.map(p => `<li>${p.name}</li>`).join("") + "</ol>";
	}
}
