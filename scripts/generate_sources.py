import csv
import re
from urllib.parse import urlparse

import requests

from utils import SOURCES_FILE

url = "https://en.wikipedia.org/w/api.php"

regions = "Africa", "Americas", "Oceania", "Europe", "China", "India", "Asia"


def get_wiki_links(pagetitle):
    params = {
        'action': "parse",
        'page': pagetitle,
        'format': "json",
        'prop': "wikitext"
    }
    req = requests.get(url, params)
    wikitext = req.json()['parse']['wikitext']['*']
    return re.findall(r"[^[]\[([^[ ]*) ([^\]]*)]", wikitext)


if __name__ == "__main__":
    with open(SOURCES_FILE, "w") as f:
        writer = csv.writer(f)
        writer.writerow(['domain', 'name', 'region'])

        for region in regions:
            for link, name in get_wiki_links("Wikipedia:News sources/" + region):
                uri_parsed = urlparse(link)
                domain = uri_parsed.netloc.replace('www.', '')
                writer.writerow([domain, name, region])

    print("Sources CSV written in " + SOURCES_FILE)
