# Description

Implementation with [cytoscape.js](http://js.cytoscape.org/).
Attempt to replicate the previous prototype.

## Data: Extraction from eventmentions table for one day (partitioned)

The table is filtered locally to keep only events with >300 counts and sources with >**500** counts.

```sql
SELECT
  GLOBALEVENTID,
  MentionSourceName,
  Confidence,
  MentionDocTone
FROM
  [gdelt-bq.gdeltv2.eventmentions_partitioned]
WHERE
  _PARTITIONTIME = TIMESTAMP("2018-03-04")
```

[See filtered data](./eventmentions_20181119_1_filtered2.csv)

## Graph description ([compare with D3.js](../sources_events_graph_prototype/readme.md))

### Representation

- Nodes are events and news sources.
- The links represent the event mentions (aka articles).
- Color shows the mention tone (red is positive, blue is negative).
- Transparency is mapped from confidence.


### Actions

Available out of the box:

- Drag nodes
- Drag the canvas
- Zoom via scrolling


## Implementation comments

- Tried hard but failed to animate the layout simulation (force-directed)
- Used d3 colormap scaler but had to convert colors to cytoscape format (3 hex numbers: #4ac)

## Conclusion

Compared to d3-force, cytoscape.js provides:

- Less coding.
- Basic interactivity, available out of the box.
- Less control over force-directed layouts.
- Probably a limited functionality (e.g. colormaps).
