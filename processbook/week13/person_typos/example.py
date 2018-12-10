import pandas as pd
import difflib

def is_similar(first, second, ratio):
    return difflib.SequenceMatcher(None, first, second).ratio() > ratio

def show_diff():
    gdelt = pd.read_csv('persons.csv')['person']
    pantheon = pd.read_csv('pantheon.tsv', sep='\t')['name']
    result = [pant for gd in gdelt for pant in pantheon if is_similar(gd,pant, 0.7)]
    diff = [result[i] for i in range(len(gdelt)) if gdelt[i] != result[i]]
    print diff


if __name__ == '__main__':
    show_diff()
