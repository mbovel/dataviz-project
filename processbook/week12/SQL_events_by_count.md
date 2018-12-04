# How to extract best N events and sources by COUNT and save costs

### Create BiqQuery VIEW with a limited data (e.g. one week within Salisbury poisoning)

Do not run the query, but save it as a VIEW:

- *Dataset*: EventMentions
- *Table*: one_week_Salisbury

![](https://cloud.google.com/bigquery/images/save-view.png)

[Details](https://cloud.google.com/bigquery/docs/views)

```sql
SELECT
  GLOBALEVENTID,
  MentionSourceName,
  Confidence,
  MentionDocTone,
  MentionIdentifier,
  MentionTimeDate
FROM
  [gdelt-bq.gdeltv2.eventmentions_partitioned]
WHERE
  _PARTITIONTIME >= TIMESTAMP("2018-03-04")
  AND _PARTITIONTIME <= TIMESTAMP("2018-03-10")
```

### Query using the created VIEW

```sql
SELECT
  GLOBALEVENTID,
  MentionSourceName,
  Confidence,
  MentionDocTone,
  MentionIdentifier,
  MentionTimeDate
FROM
  [EventMentions.one_week_Salisbury] 
WHERE GLOBALEVENTID IN (
    SELECT
      GLOBALEVENTID
    FROM
    (
      SELECT
        GLOBALEVENTID,
        COUNT(*) as count,
        RANK() OVER (ORDER BY count DESC) as rank
      FROM
        [EventMentions.one_week_Salisbury] 
      GROUP BY
        GLOBALEVENTID
      HAVING
        count > 400
      )
      WHERE rank < 30
    )
  AND MentionSourceName IN 
  (
    SELECT
      MentionSourceName
    FROM
    (
      SELECT
        MentionSourceName,
        COUNT(*) as count,
        RANK() OVER (ORDER BY count DESC) as rank
      FROM
        [EventMentions.one_week_Salisbury] 
      GROUP BY
        MentionSourceName
      HAVING
        count > 400
      )
      WHERE rank < 30
    )
```

[Result](./count_max30_eventssources_one_week_Salisbury.csv)
