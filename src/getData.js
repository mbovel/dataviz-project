async function getData(/**number*/ year, /**number*/ month, /**number*/ day) {
	const mentions = await d3.csv("data/mentions.csv");
	const mainSources = await d3.csv("data/sources.csv");

	const sources = get_unique_values(mentions, "source_index").map(source_index => ({
		type: "source",
		name: mainSources[source_index],
		region: mainSources[source_index].region,
		id: source_index
	}));
	const persons = get_unique_values(mentions, "person").map(name => ({
		type: "person",
		id: name
	}));
	const nodes = persons.concat(sources);

	const links = mentions.map(mention => ({
		source: mention["source_index"],
		target: mention["person"],
		tone: mention["tone_avg"]
	}));

	return { nodes, links };
}
