# mapbox-upload-limits

[![build status](https://secure.travis-ci.org/mapbox/mapbox-upload-limits.png)](http://travis-ci.org/mapbox/mapbox-upload-limits)

Constant values of the limits of Mapbox upload services. This module
is a JSON file: read [limits.json](limits.json) for the limits.

JSON values can be overridden with environment variables, for example:
```json
{
    "mbtiles": {
        "max_filesize": 10
    }
}
```
We can use the `LIMITS_<type>_<key>` template to update this value:
```sh
export LIMITS_MBTILES_MAX_FILESIZE='100'
```

## install

```sh
$ npm install --save mapbox-upload-limits
```
