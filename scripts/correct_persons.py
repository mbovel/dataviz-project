import pandas
from Levenshtein import distance as Ldistance
from cachetools import cached

from utils import timeit

pantheon = pandas.read_csv('../data/pantheon.tsv', sep='\t')


@cached(cache={})
def correct_person(person_name, maxdist):
    matches = filter(lambda n: Ldistance(person_name, n) <= maxdist, pantheon.name)
    sorted_matches = sorted(matches, key=lambda n: Ldistance(person_name, n))
    return sorted_matches


@timeit
def correct_persons(mentions, maxdist=2):
    mentions.person = mentions.person.apply(correct_person, args=(maxdist,))
