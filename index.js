module.exports = {
    name: 'gitlog1',
    buildEnd() {
        //git command to run
        const g = "git log -1 --pretty=format:%H%n%ae%n%ad";
        //where to pipe it to
        const o = ".\\public\\build\\commit.txt";
        //cmd to run g, pipe to o
        const c = `${g} > ${o}`
        //child process ref
        const { exec } = require('child_process');
        //exec c and show status
        exec(c,()=>console.log(`\n\ngitlog1 ran:\n\n\t${c}\n\n`))
    }
}
//module.exports = {generateBundle(){require('child_process').exec("git log -1 --pretty=format:%H%n%ae%n%ad > .\\public\\build\\commit.txt")}}