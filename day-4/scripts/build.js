const mkdirp = require('mkdirp');
const rmrf = require('rimraf');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const objPath = path.join(root, 'obj');
const binPath = path.join(root, 'bin');

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));

const GBDK_ROOT = path.join(__dirname, '..','..','tools','gbdk');
const LCC = path.join(GBDK_ROOT, 'bin','lcc.exe');

const WINE = process.platform.toLowerCase() == 'linux' ? 'wine':'';
const PS = process.platform.toLowerCase() == 'linux' ? '/':'\\';

// make sure to include the include path
let ccFlags = [...pkg.ccFlags, '-I'+path.join(GBDK_ROOT,'include')];

const query = (q) => {
    return cp.execSync(q).toString()
        .split('\n').filter(x=> x.trim().length > 0);
}

const srcToObj = (srcFile) => {
    const newPath = path.join(objPath,
        srcFile.split('src'+PS)
            .pop()
            .split('.c')
            .join('.o'));

    const folder = path.dirname(newPath);

    if (!fs.existsSync(folder)) {
        mkdirp.sync(folder,{recursive:true})
    }
    return newPath;

};

const compile = (srcFile) => {
    cp.execSync([WINE,LCC,
        ...ccFlags,
        '-c', srcFile,
        '-o', srcToObj(srcFile)].join(' '));
}

const link = (objFiles, name) => {
    cp.execSync([WINE,LCC,
        '-o', name+'.gb',
        ...objFiles,
        ].join(' '));
}

if (fs.existsSync(objPath)) {
    rmrf.sync(objPath);
}

if (fs.existsSync(binPath)) {
    rmrf.sync(binPath);
}

mkdirp.sync(objPath,{recursive:true});
mkdirp.sync(binPath,{recursive:true});

const findSrcFiles = () => {
    const files = query(`find ./src -type f \\( -name "*.c" \\)`);
    return files.map(x => path.resolve(x));
}

findSrcFiles().forEach(x => {
    console.log('building: ' + x);
    compile(x);
});

link(findSrcFiles()
    .map(x => srcToObj(x)),
    path.join(root, 'bin', pkg.name));