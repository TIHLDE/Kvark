import fs from 'node:fs';

const file = fs.readFileSync('changes.patch', 'utf8');

function hasSectionChanged(section: string): boolean {
  function hasLineChanged(line: string) {
    return (line.trim().startsWith('+') && !line.trim().startsWith('+++')) || (line.trim().startsWith('-') && !line.trim().startsWith('---'));
  }

  return section.split('\n').some((line) => hasLineChanged(line));
}

const newFile = file
  .split('\n')
  .filter((line) => {
    if (line.trim() === '-' || line.trim() === '+') {
      return false;
    }
    return true;
  })
  .join('\n')
  .split('\ndiff --git')
  .map((section) => `diff --git${section}`)
  .filter((section) => hasSectionChanged(section))
  .join('\n');

fs.writeFileSync('changes.patch', newFile);
