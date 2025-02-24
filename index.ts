import fs from 'node:fs';

const file = fs.readFileSync('changes.patch', 'utf8');

function hasLineChanged(line: string) {
  return (line.trim().startsWith('+') && !line.trim().startsWith('+++')) || (line.trim().startsWith('-') && !line.trim().startsWith('---'));
}
function hasSectionChanged(section: string): boolean {
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

function CountSections(file: string): number {
  return file.split('\ndiff --git').length;
}

function CountLineChanges(file: string): number {
  return file.split('\n').filter((line) => hasLineChanged(line)).length;
}

console.log(`Files changed in diff: ${CountSections(file)} ->`, CountSections(newFile));
console.log(`Lines changed (deletions and additions) in diff: ${CountLineChanges(file)} ->`, CountLineChanges(newFile));
