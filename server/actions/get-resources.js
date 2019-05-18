const chokidar = require('chokidar');
const fs = require('fs');

exports.ResourceManager= class ResourceManager {
    constructor() {
        this.currentFiles = {};
        this._updateResources();
        this.watcher = chokidar.watch('resources/', {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            awaitWriteFinish: true
        });

        this.watcher.on('add', path =>{
            this._updateResources();
        });
        this.watcher.on('unlink', path =>{
            this._updateResources();
        });
    }
    _updateResources () {
        fs.readdir('resources/', (err, files) => {
            this.currentFiles = files;
        });
    }
    currentResources(){
        return this.currentFiles;
    }
};

