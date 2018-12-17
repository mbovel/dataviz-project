import os

import pandas
from Levenshtein import distance as ldistance
from cachetools import cached

from utils import timeit, DATA_DIR

pantheon = pandas.read_csv(os.path.join(DATA_DIR, 'pantheon.tsv'), sep='\t')


@cached(cache={})
def correct_person(person_name, maxdist):
    matches = filter(lambda n: ldistance(person_name, n) <= maxdist, pantheon.name)
    sorted_matches = sorted(matches, key=lambda n: ldistance(person_name, n))
    return sorted_matches[0] if sorted_matches else person_name


@timeit
def correct_persons(persons, maxdist=2):
    return persons.apply(correct_person, args=(maxdist,))
