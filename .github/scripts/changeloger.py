from datetime import datetime

file_path = "CHANGELOG.md"

file_data = None
next = None
with open(file_path, "r") as f:
    file_data = f.readlines()
    for i in range(len(file_data)):
        line = file_data[i].rstrip()
        if "## Neste versjon" == line:
            next = i+1
        if "## Versjon" in line:
            break

today = datetime.now().strftime("%Y.%m.%d")
file_data.insert(
    next, f"## Versjon {today}\n")
with open(file_path, "w") as f:
    file_data = "".join(file_data)
    f.write(file_data)
