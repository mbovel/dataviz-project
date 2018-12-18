class Model {
	constructor(/**DataSource*/ datasource) {
		this.datasource = datasource;
		this.modules = new Set();
		this.state = null;
	}

	async init() {
		this.setState({
			persons: [],
			mentions: [],
			date: this.datasource.minDate,
			minDate: this.datasource.minDate,
			maxDate: this.datasource.maxDate,
			freq: "D",
			selectedPerson: "Donald Trump",
			region: "America"
		});
	}

	/* Modules communicate with Model through the Observer pattern.
	 * See https://en.wikipedia.org/wiki/Observer_pattern.*/
	register(/**Object*/ module) {
		this.modules.add(module);
	}

	unregister(/**Object*/ module) {
		this.modules.delete(module);
	}

	setState(state) {
		// Make state immutable
		Object.freeze(state);
		this.state = state;
		for (const module of this.modules) {
			module.setState(state);
		}
	}

	async setDate(/**Date*/ date) {
		this.setState({
			// keep the same attributes as old state for the rest:
			...this.state,
			// replace persons and mentions attributes with new data:
			...(await this._updateData({ date, ...this.state })),
			// Update date
			date
		});
	}

	async setRegion(/**Date*/ region) {
		this.setState({
			// keep the same attributes as old state for the rest:
			...this.state,
			// replace persons and mentions attributes with new data:
			...(await this._updateData({ region, ...this.state })),
			// Update region
			region
		});
	}

	async selectPerson(/**string*/ selectedPerson) {
		this.setState({
			// keep the same attributes as old state for the rest:
			...this.state,
			// replace persons and mentions attributes with new data:
			...(await this._updateData({ selectedPerson, ...this.state })),
			// Update selectedPerson
			selectedPerson
		});
	}

	async sortMentionsBy(/**Function*/ comparator) {
		this.setState({
			// keep the same attributes as old state for the rest:
			...this.state,
			// sort mentions:
			mentions: this.state.mentions.sort(comparator)
		});
	}

	async _updateData({ date, freq, region, selectedPerson }) {
		const timeRange = Model._getTimeRange(date, freq);
		const { mentions, persons } = await this.datasource.load(...timeRange);
		// Todo: if no person is selected (selectedPerson === null), get means.
		const mentionsFiltered = mentions.filter(
			m => m.source.region === region && m.target.name === selectedPerson
		);
		return { mentions: mentionsFiltered, persons };
	}

	static _getTimeRange(/**Date*/ date, /**string*/ freq) {
		const [year, month, day] = getDateComponents(date);
		switch (freq) {
			case "Y":
				return [new Date(year, 0, 1), new Date(year, 11, daysInMonth(year, 11))];
			case "M":
				return [new Date(year, month, 1), new Date(year, month + 1, 1)];
			case "D":
				return [new Date(year, month, day), new Date(year, month, day + 1)];
		}
		throw new Error(`Unknown frequency ${freq}`);
	}
}
