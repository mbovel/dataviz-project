class DataSource {
	constructor(/**Array<Object>*/ sources, { /**Date*/ start_date, /**Date*/ end_date }) {
		this.sources = sources;
		this.minDate = new Date(start_date);
		this.maxDate = new Date(end_date);
	}

	static async init() {
		const sources = await d3.csv("data/sources.csv");
		const config = await d3.json("data/config.json");
		return new DataSource(sources, config);
	}

	async load(/**Date*/ start, /**Date*/ end) {
		const timeRange = `${formatDate(start)}_${formatDate(end)}`;

		const mentionsRaw = await d3.csv(`data/mentions/${timeRange}.csv`);
		const mentionsBase = mentionsRaw.map(mention => ({
			sourceIndex: parseInt(mention["source_index"]),
			targetIndex: parseInt(mention["person_index"]),
			mentionsCount: parseInt(mention["mentions_count"]),
			tone: parseFloat(mention["tone_avg"])
		}));

		const personsRaw = await d3.csv(`data/persons/${timeRange}.csv`);
		const personsStats = d3.rollup(
			mentionsBase,
			v => ({
				tone: v.reduce((sum, el) => sum + el.tone, 0) / v.length,
				mentionsCount: v.reduce((sum, el) => sum + el.mentionsCount, 0) / v.length
			}),
			d => d.targetIndex
		);
		// Augment persons with statistics.
		const persons = personsRaw.map((person, index) => ({
			name: person["name"],
			...personsStats.get(index)
		}));

		// Augment mentions with direct references to person and source objects.
		const mentions = mentionsBase.map(mention => ({
			source: this.sources[mention.sourceIndex],
			target: persons[mention.targetIndex],
			...mention
		}));

		return { persons, mentions };
	}
}
