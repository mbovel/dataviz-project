import itertools
import json
import os
import textwrap
from typing import List

import pandas

from correct_persons import correct_persons
from utils import run_bigquery, strings_list, DATA_DIR, SOURCES_FILE

PERSONS_N = 30


def persons_query(period: pandas.Timestamp):
    return textwrap.dedent(f"""
        SELECT
          COUNT(*) AS mentions_count,
          name
        FROM (
          SELECT
            DocumentIdentifier,
            REGEXP_REPLACE(personOffset, r',.*', '') AS name
          FROM
            `gdelt-bq.gdeltv2.gkg_partitioned` gkg,
            UNNEST(SPLIT(V2Persons ,';')) AS personOffset
          WHERE
            _PARTITIONTIME >= TIMESTAMP('{period}')
            AND _PARTITIONTIME < TIMESTAMP('{period + 1}'))
        GROUP BY
          name
        ORDER BY
          mentions_count DESC
        LIMIT {PERSONS_N}
    """)


def mentions_query(period: pandas.Timestamp, in_sources: List[str], in_persons: List[str]):
    return textwrap.dedent(f"""
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
            _PARTITIONTIME >= TIMESTAMP('{period}')
            AND _PARTITIONTIME < TIMESTAMP('{period + 1}'))
        WHERE
          person IN ({strings_list(in_persons)})
          AND source_domain IN ({strings_list(in_sources)})
        GROUP BY
          person,
          source_domain
        ORDER BY
          mentions_count DESC,
          person,
          source_domain
        LIMIT
          5000
    """)


def compute_data_for_period(period):
    period_string = f"{period.strftime('%Y-%m-%d')}_{(period + 1).strftime('%Y-%m-%d')}"
    print(f"\n--- Computing mentions for period {period} ---")

    # Get data
    persons = run_bigquery(name='persons', sql=persons_query(period))
    persons_list = persons.name.values.tolist()
    sources = pandas.read_csv(SOURCES_FILE)
    sources_list = sources.domain.values.tolist()
    mentions = run_bigquery(name='mentions', sql=mentions_query(period, sources_list, persons_list))

    # Fix person names
    persons.name = correct_persons(persons.name)
    mentions.person = correct_persons(mentions.person)

    # Replace sources domains with indices
    source_index = pandas.Index(sources.domain).unique()
    person_index = pandas.Index(persons.name).unique()
    mentions['source_index'] = mentions.source_domain.apply(lambda d: source_index.get_loc(d))
    mentions['person_index'] = mentions.person.apply(lambda n: person_index.get_loc(n))
    mentions.drop(columns=['source_domain'], inplace=True)
    mentions.drop(columns=['person'], inplace=True)

    # Write CSV files
    mentions_file = os.path.join(DATA_DIR, 'mentions', f"{period_string}.csv")
    mentions.to_csv(mentions_file, index=False, float_format='%.3f')
    print(f"Wrote {mentions_file}.")
    persons_file = os.path.join(DATA_DIR, 'persons', f"{period_string}.csv")
    persons.to_csv(persons_file, index=False, float_format='%.3f')
    print(f"Wrote {persons_file}.")


if __name__ == "__main__":
    with open(os.path.join(DATA_DIR, 'config.json')) as f:
        config = json.load(f)

    START = config['start_date']
    END = config['end_date']

    days = pandas.date_range(START, END, freq='D')
    months = pandas.date_range(START, END, freq='MS')
    years = pandas.date_range(START, END, freq='YS')

    for period in itertools.chain(days, months, years):
        compute_data_for_period(period)
