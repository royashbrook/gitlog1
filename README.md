## gitlog1

This is a very simple rollup plugin that runs git log -1 and outputs the results to a file in the build folder. Check the source for the actual command run. it will simply pass the command specified to the default shell for execution so YMMV. I wrote this for windows so it uses cmd.exe. YMMV, caveat emptor, use at your own risk, etc etc.

**update (v0.0.2):** added mac/linux support. it now runs git and writes the file via node directly (no shell), so it works cross-platform. same output (`public/build/commit.txt`) and same usage, so the cmd.exe bit above is history now. =)
