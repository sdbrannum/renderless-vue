##
# Remove html anchor tags from within questions e.g.
# from: "<a href=\"http://www.j-archive.com/media/2005-07-18_DJ_17.jpg\" target=\"_blank\">This</a> film's subject matter was controversial in its day"
## to: "This film's subject matter was controversial in its day"
import json
from os.path import dirname, join

current_dir = dirname(__file__)
print(current_dir)
file_path = join(current_dir, "../public/jeopardy.json")
with open(file_path, 'r') as json_file:
    data = json.load(json_file)
    for p in data:
        p['question'] = p['question'].replace('<a>', '')
        p['question'] = p['question'].replace('</a>', '')
        startIndex = p['question'].find('<a')
        endIndex = p['question'].find('>')

        if startIndex > -1 and endIndex > -1:
            p['question'] = p['question'][0: startIndex] + \
                p['question'][endIndex + 1::]

with open(file_path, 'w') as data_file:
    json.dump(data, data_file)
