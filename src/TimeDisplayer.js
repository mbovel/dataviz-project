class TimeDisplayer {
	constructor(/**HTMLElement*/ container, /**Model*/ model) {
		this.container = container;
	}

	setState({ date, freq }) {
		switch (freq) {
			case "D":
				this.container.textContent = formatDay(date);
				break;
			case "M":
				this.container.textContent = formatMonth(date);
				break;
			case "Y":
				this.container.textContent = formatYear(date);
				break;
		}
	}
}
