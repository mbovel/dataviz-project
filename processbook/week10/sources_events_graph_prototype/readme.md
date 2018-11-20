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

[See result](./eventmentions_20181119_1_filtered.csv)

## Graph description

The links represent the event mentions (aka articles). Color shows the mention tone (red is positive, blue is negative) whereas transparency is directly mapped from confidence.
