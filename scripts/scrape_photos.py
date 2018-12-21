import os
import urllib

import wikipedia
from bs4 import BeautifulSoup
from cachetools import cached

from utils import PHOTO_DIR, timeit

EMPTY_PHOTO = os.path.join(PHOTO_DIR, 'empty.png')


def get_photo_url(name='Donald Trump'):
    page = wikipedia.WikipediaPage(title=name)
    soup = BeautifulSoup(page.html(), 'html.parser')
    infobox = soup.find('table', {'class': 'infobox vcard'})
    image = infobox.find('img')
    return 'https:' + image['src']


@timeit
@cached(cache={})
def download_photo(output_file, name='Donald Trump'):
    try:
        url = get_photo_url(name)
        urllib.request.urlretrieve(url, output_file)
    except BaseException:
        pass


def download_photos(names=['Donald Trump', 'Vladimir Putin']):
    if not os.path.exists(PHOTO_DIR):
        os.makedirs(PHOTO_DIR)
    for name in names:
        photo_file = os.path.join(PHOTO_DIR, name + ".jpg")
        if not os.path.isfile(photo_file):
            download_photo(photo_file, name)


if __name__ == '__main__':
    # Example
    persons = [
        'Angela Merkel',
        'Barack Obama',
        'Barbara Bush',
        'Bill Clinton',
        'Donald Trump',
        'George Bush',
        'George Herbert Walker Bush',
        'George Hw Bush',
        'Jamal Khashoggi',
        'Jeb Bush',
        'Jim Mcgrath',
        'John Adams',
        'Kid Rock',
        'Lopez Obrador',
        'Mikhail Gorbachev',
        'Ronald Reagan',
        'Saddam Hussein',
        'Theresa May',
        'Vladimir Putin'
    ]
    download_photos(persons)
