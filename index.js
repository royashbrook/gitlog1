const { execFile } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// rollup plugin: at build end, write the last commit (hash / author email / author date) to
// public/build/commit.txt. cross-platform , no shell, so the same thing works on windows, mac, linux.
// (output file + location + format are unchanged from the original windows-only version.)
module.exports = {
  name: 'gitlog1',
  buildEnd() {
    execFile('git', ['log', '-1', '--pretty=format:%H%n%ae%n%ad'], (err, stdout) => {
      if (err) {
        console.log(`\ngitlog1: git log failed (${err.message.trim()}), skipping commit.txt\n`);
        return;
      }
      const out = path.join('public', 'build', 'commit.txt');
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, stdout);
      console.log(`\ngitlog1 wrote ${out}\n`);
    });
  },
};
