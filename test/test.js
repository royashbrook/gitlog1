// gitlog1 test , cross-platform, zero deps. makes a throwaway git repo, runs the plugin's buildEnd,
// and checks it wrote public/build/commit.txt with the HEAD hash / author email / author date.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const plugin = require('../index.js');

let fails = 0;
const ok = (m) => console.log('ok   - ' + m);
const bad = (m) => { console.log('FAIL - ' + m); fails++; };

(async () => {
  const repoRoot = process.cwd();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gitlog1-'));
  const git = (...a) => execFileSync('git', a, { cwd: tmp, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  try {
    git('init', '-q');
    git('config', 'user.email', 't@t');
    git('config', 'user.name', 't');
    fs.writeFileSync(path.join(tmp, 'a.txt'), 'x');
    git('add', 'a.txt');
    git('commit', '-qm', 'init');
    const sha = git('rev-parse', 'HEAD').trim();

    // shape must stay an object named gitlog1 (backward-compat for `plugins: [gitlog1]`)
    if (plugin && typeof plugin === 'object' && plugin.name === 'gitlog1' && typeof plugin.buildEnd === 'function')
      ok('exports the plugin object {name:"gitlog1", buildEnd}');
    else bad('plugin shape changed , would break `plugins: [gitlog1]`');

    process.chdir(tmp);
    plugin.buildEnd();

    // buildEnd writes asynchronously (execFile callback) , poll for the file
    const out = path.join('public', 'build', 'commit.txt');
    for (let i = 0; i < 50 && !fs.existsSync(out); i++) await new Promise((r) => setTimeout(r, 100));

    if (!fs.existsSync(out)) {
      bad('commit.txt was not written');
    } else {
      const lines = fs.readFileSync(out, 'utf8').split('\n');
      /^[0-9a-f]{40}$/.test(lines[0]) ? ok('line 1 = 40-char commit hash') : bad('line 1 not a sha: ' + lines[0]);
      lines[0] === sha ? ok('hash matches HEAD') : bad('hash != HEAD');
      lines[1] === 't@t' ? ok('line 2 = author email') : bad('line 2 wrong: ' + lines[1]);
      lines[2] && lines[2].length > 0 ? ok('line 3 = author date') : bad('no author date');
    }
  } finally {
    process.chdir(repoRoot);
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log('# done. failures: ' + fails);
  process.exit(fails ? 1 : 0);
})();
