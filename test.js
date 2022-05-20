const test = require('tape');
const log  = require('@mapbox/fastlog')('test');
const path = require('path');
const exec = require('child_process').exec;

test('module can be imported', (t) => {
    let limits = require('./');
    t.ok(limits);
    t.ok(Object.keys(limits).length > 0, 'limits loaded');
    t.end();
});

test('override limits with environment variables: valid', (t) => {
    clearFromCache(t);
    process.env.LIMITS_MBTILES_MAX_FILESIZE = '1024';
    const limits = require('./');
    t.equals(limits.mbtiles.max_filesize, +process.env.LIMITS_MBTILES_MAX_FILESIZE);
    t.end();
});

test('override limits with environment variables: empty', (t) => {
    clearFromCache(t);
    process.env.LIMITS_MBTILES_MAX_FILESIZE = '';
    const limits = require('./');
    t.equals(limits.mbtiles.max_filesize, limits._defaults.mbtiles.max_filesize);
    t.end();
});

test('override limits with environment variables: malformed', (t) => {
    clearFromCache(t);
    process.env.LIMITS_MBTILES_MAX_FILESIZE = 'abcdef';
    const limits = require('./');
    t.equals(limits.mbtiles.max_filesize, limits._defaults.mbtiles.max_filesize);
    delete process.env.LIMITS_MBTILES_MAX_FILESIZE;
    t.end();
});

test('module can be imported', (t) => {
    exec('npm -s start', {
        cwd: path.join(__dirname, '/test-data')
    }, (e, stdout, stderr) => {
        process.stderr.write(stderr);
        t.error(e, 'process started');
        const limits = JSON.parse(stdout);
        t.ok(Object.keys(limits).length > 0, 'import seems good');
        t.end();
    });
});

const clearFromCache = (t) => {
    let k;
    for(let loadedModule in require.cache) {
        if(loadedModule.endsWith('/mapbox-upload-limits/index.js')) {
            k = loadedModule;
            break;
        }
    }
    t.ok(k, 'require cache cleared');
    if(k) {
        delete require.cache[k];
    }
}

