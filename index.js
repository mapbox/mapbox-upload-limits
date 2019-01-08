const fs     = require('fs');
const limits = JSON.parse(fs.readFileSync('limits.json').toString());
const log    = require('fastlog')('configuration', 'debug');

module.exports = (() => {
    limits._defaults = JSON.parse(JSON.stringify(limits));
    let envKey, envValue;
    for(let limitType in limits) {
        for(let limitKey in limits[limitType]) {
            envKey   = `LIMITS_${limitType.toUpperCase()}_${limitKey.toUpperCase()}`;
            envValue = process.env[envKey];
            if(typeof envValue !== 'undefined') {
                if(envValue.length === 0) {
                    log.warn(`Environment variable specified '${envKey}', but has no value. The default (${limits[limitType][limitKey]}) will be used.`);
                    continue;
                }
                if(isNaN(envValue)) {
                    log.warn(`Environment variable specified '${envKey}', but value is invalid: '${envValue}'. The default (${limits[limitType][limitKey]}) will be used.`);
                    continue;
                }

                limits[limitType][limitKey] = +envValue;
            }
        }
    }
    return limits;
})();
