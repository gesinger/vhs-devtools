# vhs-devtools

A Chrome and Firefox DevTools extension for debugging
[videojs/http-streaming](https://github.com/videojs/http-streaming).

## Building

```bash
$ npm install
$ npm run build
```

## Installing

The tool will appear as VHS within DevTools.

First build, then:

### Chrome

* Open chrome://extensions
* Enable "Developer mode"
* Click "Load unpacked"
* Navigate to repo directory and select it

### Firefox

* Open about:debugging
* Click on "This Firefox"
* Click "Load Temporary Add-on..."
* Select the manifest.json file of this repo
