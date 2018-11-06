# Some test SQL queries

## Number of articles published for each source and event

```sql
SELECT
  GLOBALEVENTID,
  MentionSourceName,
  COUNT(*)
FROM
  `gdelt-bq.gdeltv2.eventmentions`
WHERE
  MentionTimeDate > 20181004110000
  AND MentionTimeDate < 20181004111500
  AND Confidence > 90
GROUP BY
  GLOBALEVENTID,
  MentionSourceName
```

[See result](./number_of_articles_about.csv)

## Sources sorted by number of articles published

```sql
SELECT
  MentionSourceName,
  COUNT(*) count
FROM
  `gdelt-bq.gdeltv2.eventmentions`
WHERE
  MentionTimeDate > 20181001120000
  AND MentionTimeDate < 20181001130000
GROUP BY
  MentionSourceName
ORDER BY
  count DESC
LIMIT
  50
```

[See result](./sources_sorted_by_number_of_articles.csv)

## Number of common articles for each sources pairs

```sql
SELECT
  t1.MentionSourceName source1,
  t2.MentionSourceName source2,
  COUNT(*) count
FROM
  `gdelt-bq.gdeltv2.eventmentions` t1,
  `gdelt-bq.gdeltv2.eventmentions` t2
WHERE
  t1.MentionTimeDate > 20181001120000
  AND t1.MentionTimeDate < 20181001130000
  AND t2.MentionTimeDate > 20181001120000
  AND t2.MentionTimeDate < 20181001130000
  AND t1.MentionSourceName < t2.MentionSourceName 
  AND t1.GLOBALEVENTID = t2.GLOBALEVENTID
GROUP BY
  source1, source2
ORDER BY
  count DESC
```

[See result](./number_of_common_articles.csv)
