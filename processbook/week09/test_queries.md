# Some test SQL queries

## Number of common articles for each sources pairs (partitioned)

```sql
SELECT
  t1.MentionSourceName source1,
  t2.MentionSourceName source2,
  COUNT(*) count
FROM
  `gdelt-bq.gdeltv2.eventmentions_partitioned` t1,
  `gdelt-bq.gdeltv2.eventmentions_partitioned` t2
WHERE
  t1._PARTITIONTIME >= TIMESTAMP('2018-10-01')
  AND t1._PARTITIONTIME < TIMESTAMP('2018-10-02')
  AND t2._PARTITIONTIME >= TIMESTAMP('2018-10-01')
  AND t2._PARTITIONTIME < TIMESTAMP('2018-10-02')
  AND t1.MentionSourceName < t2.MentionSourceName 
  AND t1.GLOBALEVENTID = t2.GLOBALEVENTID
GROUP BY
  source1, source2
ORDER BY
  count DESC
```

[See result](./number_of_common_articles_partitioned.csv)
