import os

import pandas

from utils import run_bigquery, strings_list, DATA_DIR, SOURCES_FILE

FROM = '2018-12-01'
TO = '2018-12-02'

persons_query = f"""
SELECT
  COUNT(*) AS mentions_count,
  person
FROM (
  SELECT
    DocumentIdentifier,
    REGEXP_REPLACE(personOffset, r',.*', '') AS person
  FROM
    `gdelt-bq.gdeltv2.gkg_partitioned` gkg,
    UNNEST(SPLIT(V2Persons ,';')) AS personOffset
  WHERE
    _PARTITIONTIME >= TIMESTAMP('{FROM}')
    AND _PARTITIONTIME < TIMESTAMP('{TO}'))
GROUP BY
  person
ORDER BY
  mentions_count DESC
LIMIT 20
"""
persons = run_bigquery(name='persons', sql=persons_query)

sources = pandas.read_csv(SOURCES_FILE)

mentions_query = f"""
SELECT
  COUNT(*) mentions_count,
  source_domain,
  person,
  AVG(tone) AS tone_avg,
  STDDEV(tone) AS tone_std
FROM (
  SELECT
    DocumentIdentifier,
    SourceCommonName AS source_domain,
    CAST((SPLIT(V2Tone)[OFFSET(0)]) AS FLOAT64) AS tone,
    REGEXP_REPLACE(personOffset, r',.*', '') AS person
  FROM
    `gdelt-bq.gdeltv2.gkg_partitioned` gkg,
    UNNEST(SPLIT(V2Persons,';')) AS personOffset
  WHERE
    _PARTITIONTIME >= TIMESTAMP('{FROM}')
    AND _PARTITIONTIME < TIMESTAMP('{TO}'))
WHERE
  person IN ({strings_list(persons.person.values.tolist())})
  AND source_domain IN ({strings_list(sources.domain.values.tolist())})
GROUP BY
  person,
  source_domain
ORDER BY
  mentions_count DESC,
  person,
  source_domain
LIMIT
  5000
"""
mentions = run_bigquery(name='mentions', sql=mentions_query)

domain_index = pandas.Index(sources.domain).unique()
mentions['source_index'] = mentions.source_domain.apply(lambda domain: domain_index.get_loc(domain)).values.tolist()
mentions.drop(columns=['source_domain'], inplace=True)

output_file = os.path.join(DATA_DIR, 'mentions.csv')
mentions.to_csv(output_file, index=False, float_format='%.3f')
