const parseDate = d3.timeParse("%Y-%m-%d");

class DataSource {
	constructor({ start_date, end_date }) {
		this.minDate = new Date(parseDate(start_date));
		this.maxDate = new Date(parseDate(end_date));
	}

	static async init() {
		const config = await d3.json("data/config.json");
		return new DataSource(config);
	}

	async load(/**Date*/ start, /**Date*/ end, /**string*/ region) {
		const sources = await d3.csv(`data/sources/${region}.csv`);

		const formatDate = d3.timeFormat("%Y-%m-%d");
		const timeRange = `${formatDate(start)}_${formatDate(end)}`;

		const mentionsRaw = await d3.csv(`data/mentions/${region}/${timeRange}.csv`);
		const mentionsBase = mentionsRaw.map(mention => ({
			sourceIndex: parseInt(mention["source_index"]),
			targetIndex: parseInt(mention["person_index"]),
			mentionsCount: parseInt(mention["mentions_count"]),
			tone: parseFloat(mention["tone_avg"])
		}));

		const personsRaw = await d3.csv(`data/persons/${region}/${timeRange}.csv`);
		const personsStats = d3.rollup(
			mentionsBase,
			v => ({
				tone: v.reduce((sum, el) => sum + el.tone, 0) / v.length,
				mentionsCount: v.reduce((sum, el) => sum + el.mentionsCount, 0)
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
			source: sources[mention.sourceIndex],
			target: persons[mention.targetIndex],
			...mention
		}));

		return { sources, persons, mentions };
	}
}
