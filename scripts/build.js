const mkdirp = require('mkdirp');
const rmrf = require('rimraf');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const { promisify } = require('util');
const { resolve } = require('path');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const ROOT = process.cwd();
const objPath = path.join(ROOT, 'obj');
const binPath = path.join(ROOT, 'bin');

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json')));

const GBDK_ROOT = path.join(ROOT, '..','tools',process.platform.toLowerCase() === 'linux' ?'gbdk-linux-64':'gbdk-win32');
const LCC = path.join(GBDK_ROOT, 'bin','lcc');

const WINE = process.platform.toLowerCase() == 'linux' ? 'wine':'';
const PS = process.platform.toLowerCase() == 'linux' ? '/':'\\';

async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
  }

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
    cp.execSync([LCC,
        ...ccFlags,
        '-c', srcFile,
        '-o', srcToObj(srcFile)].join(' '));
}

const link = (objFiles, name) => {
    cp.execSync([LCC,
        '-o', name+'.gb',
        ...objFiles,
        ].join(' '));
}



const findSrcFiles = async () => {
    const files = (await getFiles( path.join(ROOT,'src') )).filter(x=> x.endsWith('.c')); //readDirp() //query(`find ./src -type f \\( -name "*.c" \\)`);
    return files.map(x => path.resolve(x));
}

(async ()=>{

    if (fs.existsSync(objPath)) {
        rmrf.sync(objPath);
    }
    
    if (fs.existsSync(binPath)) {
        rmrf.sync(binPath);
    }
    
mkdirp.sync(objPath,{recursive:true});
mkdirp.sync(binPath,{recursive:true});

    (await findSrcFiles()).forEach(x => {
        console.log('building: ' + x);
        compile(x);
    });

    link((await findSrcFiles())
    .map(x => srcToObj(x)),
    path.join(ROOT, 'bin', pkg.name));
})();


