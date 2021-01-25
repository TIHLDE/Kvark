from datetime import datetime
file_path = "CHANGELOG.md"

file_data = None
next = None
version = None
with open(file_path, "r") as f:
    file_data = f.readlines()
    for i in range(len(file_data)):
        line = file_data[i].rstrip()
        if "## Neste versjon" == line:
            next = i+1
        if "## Versjon" in line:
            version = line.split(" ")[2].split(".")
            break

last_index = len(version)-1
version[last_index] = str(int(version[last_index]) + 1)
for i in range(last_index, 0, -1):
    if int(version[i]) > 99:
        version[i] = "0"
        version[i-1] = str(int(version[i-1]) + 1)
version = '.'.join(version)

today = datetime.now().strftime("%d.%m.%Y")
file_data.insert(
    next, f"### Frontend\n\n\n## Versjon {version} ({today})\n")
with open(file_path, "w") as f:
    file_data = "".join(file_data)
    f.write(file_data)
