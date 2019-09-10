##
# Remove html tags from within questions e.g.
# from: "<a href=\"http://www.j-archive.com/media/2005-07-18_DJ_17.jpg\" target=\"_blank\">This</a> film's subject matter was controversial in its day"
## to: "This film's subject matter was controversial in its day"
import json
from os.path import dirname, join
from bs4 import BeautifulSoup

current_dir = dirname(__file__)
print(current_dir)
file_path = join(current_dir, "../public/jeopardy.json")
with open(file_path, 'r') as json_file:
    data = json.load(json_file)
    for p in data:
        question_soup = BeautifulSoup(p['question'], 'html.parser')
        answer_soup = BeautifulSoup(p['answer'], 'html.parser')
        p['question'] = question_soup.get_text()
        p['answer'] = answer_soup.get_text()

with open(file_path, 'w') as data_file:
    json.dump(data, data_file)
