This is a visulazion of the average tone per country in articles talking about Jair Bolsonaro in the 10 days following his election.

The SQL for Google BigQuery is the following:

```sql
SELECT
  AVG(CAST((SPLIT(V2Tone)[OFFSET(0)]) AS FLOAT64)) AS avg,
  STDDEV(CAST((SPLIT(V2Tone)[OFFSET(0)]) AS FLOAT64)) AS std,
  COUNT(*) AS count,
  geo.CountryName,
  geo.FIPS
FROM
  `gdelt-bq.gdeltv2.gkg_partitioned`,
  `gdelt-bq.extra.sourcesbycountry` geo
WHERE
  _PARTITIONTIME >= TIMESTAMP('2018-10-28')
  AND _PARTITIONTIME < TIMESTAMP('2018-11-10')
  AND 'Jair Bolsonaro' IN (
  SELECT
    REGEXP_REPLACE(person, r',.*', '')
  FROM
    UNNEST(SPLIT(V2Persons,';')) AS person)
  AND SourceCommonName = geo.Domain
GROUP BY
  geo.CountryName, geo.FIPS
HAVING
  count > 5
  AND std < 3.0
ORDER BY avg
```

The visualization uses [LeafletJS](https://leafletjs.com/) (and in particular its [GeoJSON layer](https://leafletjs.com/reference-1.3.4.html#geojson)) to draw the map using data from [world.geo.json](https://github.com/johan/world.geo.json). It also makes use of some D3 utilities:  [d3-scale](https://github.com/d3/d3-scale) and [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic) for coloring, and [d3-fetch](https://github.com/d3/d3-fetch) for loading data.