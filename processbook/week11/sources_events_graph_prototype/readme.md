# Description

## Data: Extraction from eventmentions table for one day (partitioned)

The table is filtered locally to keep only events with >300 counts and sources with >200 counts.

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

The table is filtered locally to keep only events with >300 counts and sources with >200 counts
([bash script](./filter_eventmentions.sh)).

[See filtered data](./eventmentions_20181119_1_filtered.csv)

## Graph description

### Representation

- Nodes are events and news sources.
- The links represent the event mentions (aka articles).
- Color shows the mention tone (red is positive, blue is negative) .
- Transparency is mapped from confidence.

### Actions

- Mouse dragging with left-button  moves the node and switch on the simulation. The simulation is stopped upon the button release.
- Right-click on a node will highlight the nodes (increase size) and the attached links (increase size and opacity as well as raise on top of visualization).

Simulation is off when not dragging because I observe an unpredicted behavior when raising links on top is done simultaneously with active simulation (random links are highlighted). I spent hours and failed to fix it, that's why simulation is on only during dragging.

## Implementation comments

2 major classes:

- GraphSimulation - to define simulation
- GraphPlot - to visualize graph

Dirty hack: simulation object has to be globally defined so that I can access it from dragging-related methods of GraphPlot object (word *this* refer to the element which evoked the dragging event).
