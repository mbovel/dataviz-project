class Model {
	constructor(/**DataSource*/ dataSource) {
		this.dataSource = dataSource;
		this.components = new Set();
		this.state = { options: {}, data: {} };
	}

	// Model communicate with components through the Observer pattern.
	// See https://en.wikipedia.org/wiki/Observer_pattern
	register(/**Object*/ module) {
		this.components.add(module);
	}

	unregister(/**Object*/ module) {
		this.components.delete(module);
	}

	setOptions(/**Object*/ optionsChange) {
		const options = { ...this.state.options, ...optionsChange };
		this.loadData(options)
			.then(data => this.setState({ data, options }))
			.catch(console.error);
	}

	async setState(/**Object*/ state) {
		// Make state immutable
		deepFreeze(state);
		this.state = state;
		for (const module of this.components) {
			module.setState(state);
		}
	}

	async loadData({ date, freq, region, selectedPerson, sortBy }) {
		const timeRange = Model.getTimeRange(date, freq);
		const data = await this.dataSource.load(...timeRange, region);
		const mentionsFiltered = Model.filterMentionsByPerson(data.mentions, selectedPerson);
		const mentionsGrouped = Model.groupMentionsBySource(mentionsFiltered);
		const mentionsSorted = Model.sortMentionsBy(mentionsGrouped, sortBy);
		return { ...data, mentions: mentionsSorted };
	}

	static filterMentionsByPerson(/**Array<Object>*/ mentions, /**string*/ person) {
		if (!person) return mentions;
		return mentions.filter(m => m.target.name === person);
	}

	static groupMentionsBySource(/**Array<Object>*/ mentions) {
		const groups = d3.rollup(
			mentions,
			ms => ({ tone: ms.reduce((sum, m) => sum + m.tone, 0) / ms.length, ...ms[0] }),
			d => d.source
		);
		return [...groups].map(v => v[1]);
	}

	static sortMentionsBy(/**Array<Object>*/ mentions, /**string*/ sortBy) {
		const mentionsSorted = [...mentions];
		mentionsSorted.sort(Model.getMentionsComparator(sortBy));
		return mentionsSorted;
	}

	static getMentionsComparator(/**string*/ sortBy) {
		switch (sortBy) {
			case "name":
				return (a, b) => d3.ascending(a.source.name, b.source.name);
			case "tone":
				return (a, b) => d3.ascending(a.tone, b.tone);
		}
	}

	static getTimeRange(/**Date*/ date, /**string*/ freq) {
		const [year, month, day] = getDateComponents(date);
		switch (freq) {
			case "Y":
				return [new Date(year, 0, 1), new Date(year + 1, 0, 1)];
			case "M":
				// Note: JavaScript date automatically handle overflows: month 12 or day 32 will
				// be correctly understood as the first month of next year or the first day of
				// next month, so need to do manually take modulo or similar.
				return [new Date(year, month, 1), new Date(year, month + 1, 1)];
			case "D":
				return [new Date(year, month, day), new Date(year, month, day + 1)];
		}
		throw new Error(`Unknown frequency ${freq}`);
	}
}
