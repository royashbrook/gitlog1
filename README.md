## gitlog1

A very simple [rollup](https://rollupjs.org/) plugin that, at build end, runs `git log -1` and writes the
result to `public/build/commit.txt` , the commit hash, author email, and author date, one per line. Handy
for stamping a build with the commit it came from.

Cross-platform (windows, mac, linux): it uses node's `fs` + `git` directly, no shell. If `git` isn't
available or the directory can't be written, it logs and skips rather than failing your build.

```js
// rollup.config.js
import gitlog1 from 'gitlog1';

export default {
  // ...
  plugins: [gitlog1],
};
```

Output goes to `public/build/commit.txt` (created if needed). Source is one small file , read it.
