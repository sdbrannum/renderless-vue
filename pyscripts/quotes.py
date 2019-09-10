##
# Remove single quotes around questions inside double quotes e.g.
# from: "'This film's subject matter was controversial in its day'"
## to: "This film's subject matter was controversial in its day"
import json
from os.path import dirname, join

current_dir = dirname(__file__)
print(current_dir)
file_path = join(current_dir, "../public/jeopardy.json")
with open(file_path, 'r') as json_file:
    data = json.load(json_file)
    for p in data:
        p['question'] = p['question'][1:-1]

with open(file_path, 'w') as data_file:
    json.dump(data, data_file)
