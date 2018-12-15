---
layout: default
title: Processbook
menu_order: 5
---

# Processbook
Welcome to the Processbook section of this project! The purpose of this processbook is to discuss the entire design pipeline of the project and is partitioned accordingly:

[TODO: Insert nav/table of contents here. If you want I can make section references with a list here in the same way that I have used section references elsewhere in the file, but I opted against in in case you wanted to use a code structure more like [this one](https://jekyllrb.com/tutorials/navigation/#scenario-3-two-level-navigation-list)]<br/>
[TODO: Make sure subsection linking works. The syntax I used is based on this answer:]
[TODO: In the "Inspiration and Related Work" section, do you think we need to add more information about aesthetic motivations (for example, the data art on Kirell's website)? In the "inspiration" section of the example processbook on Moodle, there is a picture of Lake Geneva and the surrounding mountains that the team said they used as inspiration for the "Landscape" theme. Do we have anything as artistic or abstract as that?]


The [**Introduction**](#introduction) section discusses the background, intent, and goals of the project.
The [**Data**](#data) section discusses the source of the dataset and how we cleaned and wranged the data into a visualizable format. It also discusses initial explorations we completed to view inital underlying patterns in the data.
The [**Design**](#design) section discusses the prototype iterations that led to our final product as well as the justifications for our design decisions.
The [**Evaluation**](#evaluation) section discusses the strengths and weaknesses of our visualization and recommendations for future additions.

## Introduction
Logistically, this website and the central visualization comprises the final project for the COM-480: Data Visualization course at Ecole Polytechnique F&eacute;d&eacute;rale de Lausanne (EPFL) in Lausanne, Switzerland. The deeper motivations of the authors are discussed in the [Motivation](#motivation) subsection.

### Overview
[The GDELT Project](https://www.gdeltproject.org/0) is, in short, a consistently-updated database of news articles from around the world. All of the data is publicly-available, as well as numerous (though specific) tools for both extracting subsets and visualizing the data in different ways. While the database has historically been used to to analyze *events* occuring in the world, the primary goal of this project was to create an interactive visualization to explore *sources* of the articles and their characteristics. 

The sponsor for this project was [Dr. Benjamin Ricaud](https://people.epfl.ch/benjamin.ricaud) of EPFL's [LTS2 Signal Processing Lab](https://lts2.epfl.ch/).

### Motivation
News media affects nearly everyone. While some readers use it as casual, relaxing entertainment and others read it actively to learn about the goings-on in the world, all readers use the information they read in the news as a factor in decisioins that they use ranging from simple ("Which brand of tea should I buy?") to extremely important ("Should I vaccinate my child?"). As politics around the world become increasingly polarized, the use of "news" media as persuasion mechanisms rather than objective conveyors of information is unfortunately widespread. 

While accurately quantifying bias is a difficult task, with so much information in the GDELT database (and elsewhere) our team was confident that objectivity indicators could be identified, extracted, and visualized. Drawing from our computer science, engineering, and neuroscience backgrounds, it was our goal to create a tool that let users do just that in a way that let them decide in a data-driven way what sources are trustworthy and which are not.

### Target Audience
Our visualization is appropriate and useful for anyone interested in learning about media bias. While the primary audience is consumers that are interested in evaluating the credibility of the news they view, our visualization may also be useful for those studying media bias at the level of academia or public policy.

### Inspiration and Related Work

The concept of biased media is not a new topic, and therefore, neither is visualizing it. It's not difficult to find many attempts to visualize news bias. However, nearly all of them have significant problems, particularly for the common user.

Many scales mapping sources to their bias exist, but they are often cluttered and fail to easily convey how these mappings were calculated (if at all). Notice in Figure 1 that the *left*-leaning sources are on the *right*-hand side of the visualization and vice versa ([Figure 1 Source](https://www.aaai.org/ocs/index.php/ICWSM/ICWSM12/paper/download/4775/5075)):

![Figure1](processbook/finalbookimgs/BackwardsScale.jpg)<br/>
<center>Figure 1. Backwards Bias Scale.</center>

Figure 2 shows an example of a cluttered, non-interactive graph visualization. Our sponsor strongly suggested a graph visualization, and current work such as Figure 2 suggests that there is a need for clear, descriptive graph visualizations in this subject area ([Figure 2 Source](http://blog.logicalrealism.org/2008/12/09/visualizing-political-blogs-linking/)):

![Figure2](processbook/finalbookimgs/PoliticalBlogGraph.jpg)
<center>Figure 2. Graph of Political Blogs.</center>


Many visualizations such as those in Figure 3 were survey-based and showed results of peoples' *perception* of bias but failed to convey objective information about the sources that could justify labelling a source as biased or not ([Figure 3 Source](http://www.journalism.org/2014/10/21/section-1-media-sources-distinct-favorites-emerge-on-the-left-and-right/)):

![Figure3](processbook/finalbookimgs/WhoReadsWhat.png)
<center>Figure 3. Survey-Based Visualization.</center>

Even more descriptive and clear visualizations have failed to provide interactivity. Charts such as those in Figure 4 (similar to Figure 1) simply state what sources are biased without clearly showing the reader how. This lack of interactivity means that the viewer is limited to the authors' conclusions and unable to develop any additional conclusions on her or his own ([Figure 4 Source](https://www.adfontesmedia.com/)): 

![Figure4](processbook/finalbookimgs/MediaBiasChart.jpg)
<center>Figure 4. Media Bias Chart.</center>

We drew most of our inspiration on interactivity from examples with simple, clean, clear interactivity from an extensive [d3 gallery on github](https://github.com/d3/d3/wiki/Gallery). Here are some examples:
* [Force-Directed Graph](https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8)
* [Collapsible Force Layout](http://mbostock.github.io/d3/talk/20111116/force-collapsible.html)
* [Hive Plots](https://bost.ocks.org/mike/hive/)

Note that, as we describe in the [Design](#design) section, we decided early in the design process that a graph/network visualization would be the most effective way of achieving our goals.

## Data
## Design
## Evaluation