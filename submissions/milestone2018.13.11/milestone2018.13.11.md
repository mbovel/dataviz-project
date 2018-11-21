## Project ID
37
[Link to IDs](https://moodle.epfl.ch/pluginfile.php/2459475/mod_resource/content/0/ID%20-%20sciper%20mapping.pdf)

## SCIPERs
250300 - Matthieu Bovel;
237913 - Ruslan Aydarkhanov;
295269 - Daniel Smarda

## Dataviz url
[https://mbovel.github.io/dataviz-project/](https://mbovel.github.io/dataviz-project/)

## Github link
[https://github.com/mbovel/dataviz-project](https://github.com/mbovel/dataviz-project)

## Exploratory data analysis
### Prompt: "What viz have you used to gain insights on the data? What are your preprocessing steps, etc? (200 words)"
Our process of exploring the data has gone hand-in-hand with our process of choosing the best visualizations to tell a story, so the answers to this question and the next one overlap significantly in content.

The original data set is extremely large so the question of how to partition and reduce the data were very important. While much of the GDELT databases is focused on the content of events, our focus is on gaining insights on news sources and the relationships between them. The data is stored on Google BigQuery which has a built-in SQL-like query interface as well as previews for the tables. We initially brainstormed several ways to aggregate the articles: by day, by geographic region, by religion of those involved, by the impact (Goldstein scale), by sentiment. For some of these groupings, it was apparent simply by looking at the output table (e.g., based on orders of magnitude of the data) that extracting important conclusions would be difficult. For the topics whose usefulness was ambiguous and those that looked promising, we iterated through different graphs using Gephi and the d3 forceSimulation library as well as maps using geoJSON and Leaflet.js. For each of the visualization types we tried several subsets of the data. For example, when showing the relationships of news sources with edge weights between them proportional to the number of events they both published about, we tried subsets of the data ranging from a few hundred events to a few thousand events. In deciding if the data was conducive to geographical mapping, we tried 3 different 10-day periods following important news events (Charlie Hebdo, Asia Bibi arrest, Bolsonaro election).

## Design
### Prompt: "What are the different visualizations you considered? Did you deviate from your initial proposal? (it’s ok). Justify the design decisions you made using the perceptual and design principles. (300 words min)"
For screenshots and links to the interactive visualizations see the zip file uploaded to the "sketches and wireframes" section.

The goal of the visualization from the users’ perspective revolves largely around discovery (e.g., discovering news sources that are independent and unbiased). Preferably, identification and comparison of the news sources that the users use, but doing so in a meaningful way may require aggregating data from outside of the GDELT dataset which at present appears to make it out of the scope of this project. While the news is often quite dull and pessimistic, offering some enjoyment to the users as they use our visualization would likely motivate them to seek out the new sources they discover as well.

The main visualization types we considered were graphs and geographical maps. We considered natural language text visualization but unfortunately doing so would require significant data preprocessing. We considered more traditional visualization techniques such as scatter plots but also decided against each of these for a variety of reasons. For example, multi-line plots would require lots of pre-processing to align the evolving of a single event over time; scatter plots are less unique and therefore less engaging to users; proportionality-based charts, even beyond the pie charts that we know to be unhelpful, would not prove particularly insightful due to the limited information that such a visual could communicate.

Based on the nature of the conclusions that we wanted to explore and draw--showing the relationships between news sources with tens to hundreds of articles displayed at once—graph/network visualization seemed to make the most sense. We first created a graph with news sources as the nodes and the number of events they both published about from a set of events as the edge weights. We were thinking that clusters may merge – e.g., religiously-backed sources may publish more information about pro-religion topics and anti-religion activities – but with several modifications on Gephi no clusters emerged.

 We then thought that geographic region might be a good feature by which to explore the data, for which a natural presentation type is a geographical map. For each visualization, we picked a single news event and highlighted countries based on the overall sentiment of the media in the country (e.g., regarding the Bolsonaro election in Brazil, Russian media spoke positively while media in Guyana, a small country immediately adjacent to Brazil, spoke negatively).  While were in fact able to tell a story, we ultimately decided that interactivity choices were limited with the geographical map, and important conclusions would likely need to be explained with many words. Too many words for explanation deters from the user experience and engagement. 

In parallel with the geographical map creation, we tried creating a network with both articles and sources as nodes, with links from articles to sources varying based on sentiment/tone, and again iterated through several and encoding options (juxtaposition, size, color, and shape of nodes and edges, of course exploring only one at a time to prevent confusion and inadvertently implying false conclusions).

From the geographical map and the both-sources-and-articles graph, we have drawn two important constraint observations. First, partitioning the data based on a news events shows promise in telling a meaningful story. Second, the graphs with both events and articles balances the uniqueness, aesthetic appeal, and interactivity flexibility that graph visualization naturally carries with the potential for interesting stories to be told by continuing to explore and optimize many parameters (i.e., encodings). Exploring these encodings, likely by revisiting the design sheets with these new constraints in mind, will be our next step.

## Sketches & Wireframes
(Submitting all files in the dataviz-project/submissions/milestone2018.23.11 directory as a zip file)