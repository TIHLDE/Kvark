from datetime import datetime

file_path = "CHANGELOG.md"

next_version_line = None

with open(file_path, "r") as f:
    file_data = f.readlines()
    for i, line in enumerate(file_data):
        if "## Neste versjon" in line:
            next_version_line = i + 1
            break

today = datetime.now().strftime("%Y.%m.%d")
new_version_line = f"## Versjon {today}\n"
if next_version_line is not None:
    file_data.insert(next_version_line, new_version_line)

with open(file_path, "w") as f:
    f.write("".join(file_data))
