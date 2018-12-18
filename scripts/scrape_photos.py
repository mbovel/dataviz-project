from bs4 import BeautifulSoup
import wikipedia
import urllib
import os
from utils import PHOTO_DIR

def get_photo_url(name='Donald Trump'):
    page = wikipedia.WikipediaPage(title = name)
    soup = BeautifulSoup(page.html(), 'html.parser')
    infobox = soup.find('table', {'class':'infobox vcard'})
    image = infobox.find('img')
    return 'https:' + image['src']

def download_photo(name='Donald Trump'):
    try:
        url = get_photo_url(name)
        PHOTO_FILE = os.path.join(PHOTO_DIR, name + ".jpg")
        urllib.request.urlretrieve(url, PHOTO_FILE)
    except:
        pass

def download_photos(names=['Donald Trump', 'Vladimir Putin']):
    if not os.path.exists(PHOTO_DIR):
        os.makedirs(PHOTO_DIR)
    for name in names:
        PHOTO_FILE = os.path.join(PHOTO_DIR, name + ".jpg")
        if not os.path.isfile(PHOTO_FILE):
            download_photo(name)

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
