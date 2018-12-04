import hashlib
import os
import re
import textwrap
from typing import List

import pandas
from google.cloud import bigquery
from google.cloud.bigquery import QueryJobConfig

CACHE_DIR = 'cache'
WS = re.compile("\s*")


def run_bigquery(name: str, sql: str) -> pandas.DataFrame:
    filename = os.path.join(CACHE_DIR, name + '-' + digest_string(sql) + '.csv')
    print("Query:\n" + textwrap.indent(wrap(sql.strip()), '\t'))
    if not os.path.isfile(filename):
        print("Running on google bigquery…")
        client = bigquery.Client()
        query_job = client.query(sql, QueryJobConfig(use_query_cache=True))
        dataframe: pandas.DataFrame = query_job.to_dataframe()
        dataframe.to_csv(filename, index=False)
        print("Processed " + sizeof_fmt(query_job.total_bytes_processed) + ".")
    else:
        print("Using cache.")
    print()
    return pandas.read_csv(filename, )


# https://stackoverflow.com/a/1094933
def sizeof_fmt(num: int, suffix: str = 'B'):
    for unit in ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z']:
        if abs(num) < 1000.0:
            return "%3.2f%s%s" % (num, unit, suffix)
        num /= 1000.0
    return "%.1f%s%s" % (num, 'Yi', suffix)


def digest_string(string: str):
    m = hashlib.md5()
    m.update(string.encode('utf-8'))
    return m.hexdigest()


def strings_list(xs: List[str]):
    return str(xs)[1:-1]


def wrap(text: str):
    return '\n'.join(wrap_line(l) for l in text.split('\n'))


def wrap_line(line: str):
    indent = WS.match(line).group(0)
    wrapper = textwrap.TextWrapper(initial_indent='', subsequent_indent=indent + '  ', width=100)
    return '\n'.join(wrapper.wrap(line))
