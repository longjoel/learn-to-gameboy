const mkdirp = require('mkdirp');
const rmrf = require('rimraf');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const objPath = path.join(root, 'obj');
const binPath = path.join(root, 'bin');

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));

const BGB_ROOT = path.join(__dirname, '..','..','tools','bgb');
const BGB = path.join(BGB_ROOT, 'bgb');
const WINE = process.platform.toLowerCase() == 'linux' ? 'wine':'';


const query = (q) => {
    return cp.execSync(q).toString()
        .split('\n').filter(x=> x.trim().length > 0);
}

query([WINE,BGB,path.join(root,'bin',pkg.name+'.gb')].join(' '))