const test = require('tape');
const log  = require('fastlog')('test');

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
    t.end();
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

