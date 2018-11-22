# Meeting #1 with Mr. Ricaud

- **Should we make a force-directed graph?** This was indeed what Mr. Ricaud had in mind when writing the description. He however seemed very open about us moving away from his proposition, including trying other types of visualizations like maps.
- **How to choose “main” sources?** We presented him two ideas: 1. manually subsetting the sources list and 2. taking the sources with the most articles published (see the [SQL query](./test_queries.md#sources-sorted-by-number-of-articles-published) here). Both seemed to work for him.
- **How to compute the links weights?** We suggested that we may need more complexe calculations for links weights than simply the number of articles about the same subject. One possibility would be to include tones comparison, grouping sources that have a similar tone about a specific subject together for example. He agreed.
- **Should our work be “real-time”?** We asked this question to know if it was ok to take a static subset of data for our visualization as opposed to allowing dynamic queries to arbitrary events from the user for exemple. Indeed, he confirmed that it was ok and that we should not spend too much time on server infrastructure as this is only a visualization course.
- **How should we subset data?** As we figured out ourselves: by events, time ranges or locations.
- **How to create the dataset?** Mr. Ricaud personally uses the [GDELT Analysis Service](http://analysis.gdeltproject.org/) to download CSVs and then process them with Python.