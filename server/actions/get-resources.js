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
        let fileNames = [];
        fs.readdir('resources/', (err, files) => {
            fileNames = files;
            let readFiles = [];
            fileNames.forEach(item => {
                fs.readFile('resources/' + item, 'utf8',(err, data) => {
                    let currentFile = JSON.parse(data);
                    readFiles.push(currentFile);
                    this.currentFiles = readFiles;
                });
            });
        });
    }
    currentResources(){
        return this.currentFiles;
    }
};

