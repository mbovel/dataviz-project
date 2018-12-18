class DataSource {
	constructor(pantheon, mainSources, { start_date, end_date }) {
		this.pantheon = pantheon;
		this.mainSources = mainSources;
		this.personsRegion = d3.rollup(pantheon, v => v[0]["continentName"], d => d.name);
		this.minDate = new Date(start_date);
		this.maxDate = new Date(end_date);
	}

	static async init() {
		const pantheon = await d3.tsv("data/pantheon.tsv");
		const mainSources = await d3.csv("data/sources.csv");
		const config = await d3.json("data/config.json");
		return new DataSource(pantheon, mainSources, config);
	}

	async load(/**Date*/ start, /**Date*/ end) {
		const mentions = await d3.csv(`data/mentions/${formatDate(start)}_${formatDate(end)}.csv`);
		const personsInfo = await d3.csv(
			`data/persons/${formatDate(start)}_${formatDate(end)}.csv`
		);

		const sources = getUniqueValues(mentions, "source_index").map(source_index => ({
			type: "source",
			name: this.mainSources[source_index],
			region: this.mainSources[source_index]["region"],
			id: source_index
		}));

		const persons = personsInfo.map((person, person_index) => ({
			type: "person",
			region: this.personsRegion.get(person["name"]),
			name: person["name"],
			id: person_index
		}));

		const nodes = persons.concat(sources);

		const links = mentions.map(mention => ({
			source: mention["source_index"],
			target: mention["person_index"],
			tone: mention["tone_avg"]
		}));

		return { nodes, links };
	}
}
