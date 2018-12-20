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

    getPersonsFromMentions(mentions){
	    let personsMap = d3.rollup(mentions, v => ({tone:v.reduce((sum, el) => sum + parseFloat(el.tone), 0) / v.length, nmentions: v.length}), d => d.target.name);
        let persons = [];
        for (const [k,v] of personsMap) {
                v.name = k
                persons.push(v);
        }
        return persons;
    }

	async load(/**Date*/ start, /**Date*/ end) {
		const timeRange = `${formatDate(start)}_${formatDate(end)}`;

		const personsRaw = await d3.csv(`data/persons/${timeRange}.csv`);
		let persons = personsRaw.map(person => ({
			type: "person",
			name: person["name"]
		}));

		const mentionsRaw = await d3.csv(`data/mentions/${timeRange}.csv`);
		const mentions = mentionsRaw.map(mention => ({
			source: this.sources[mention["source_index"]],
			target: persons[mention["person_index"]],
			tone: mention["tone_avg"],
			std: mention["tone_std"]
		}));

        persons = this.getPersonsFromMentions(mentions);

		return { persons, mentions };
	}
}
