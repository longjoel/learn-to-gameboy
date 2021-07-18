const mkdirp = require('mkdirp');
const rmrf = require('rimraf');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const objPath = path.join(root, 'obj');
const binPath = path.join(root, 'bin');

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));




let ccFlags = pkg.ccFlags;
let ldFlags = pkg.ldFlags;

const query = (q) => {
    return cp.execSync(q).toString()
        .split('\n').filter(x=> x.trim().length > 0);
}

const srcToObj = (srcFile) => {
    const newPath = path.join(objPath,
        srcFile.split('src/')
            .pop()
            .split('.c')
            .join('.o'));

    const folder = path.dirname(newPath);

    if (!fs.existsSync(folder)) {
        mkdirp.sync(folder)
    }
    return newPath;

};

const compile = (srcFile) => {
    cp.execSync(['gcc',
        ...ccFlags,
        '-c', srcFile,
        '-o', srcToObj(srcFile)].join(' '));
}

const link = (objFiles, name) => {
    cp.execSync(['gcc',
    ...objFiles,
    ...ldFlags,    
        '-o', name].join(' '));
}

if (fs.existsSync(objPath)) {
    rmrf.sync(objPath);
}

if (fs.existsSync(binPath)) {
    rmrf.sync(binPath);
}

mkdirp.sync(objPath);
mkdirp.sync(binPath);


ccFlags = [...query('sdl-config --cflags'),...ccFlags];
ldFlags = [ ...query('sdl-config --libs'),...ldFlags];

const findSrcFiles = () => {
    const files = query(`find ./src -type f \\( -name "*.c" \\)`);
console.log(files)
    return files.map(x => path.resolve(x));
}

findSrcFiles().forEach(x => {
    console.log('building: ' + x);
    compile(x);
});

link(findSrcFiles()
    .map(x => srcToObj(x)),
    path.join(root, 'bin', pkg.name));