const chokidar = require('chokidar');
const fs = require('fs');

exports.ResourceManager= class ResourceManager {
    constructor() {
        this.currentFiles = [];
        this._updateResourcesAdded();
        this.watcher = chokidar.watch('resources/*.json', {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            awaitWriteFinish: true
        });

        this.watcher.on('add', path =>{
            this._updateResourcesAdded(path);
        });
        this.watcher.on('unlink', path =>{
            this._updateResourcesRemoved(path);
        });
    }
    _updateResourcesAdded (path) {
        console.log("Found ",path);
        if(path === undefined){
            return;
        }
        fs.readFile(path,'utf8' ,(err, data) => {
            try{
                let newResource = JSON.parse(data);
                console.log("Successfully parsed ", path, " as JSON");
                newResource.filePath = path;
                this.currentFiles.push(newResource);
            }catch (e) {
                console.log(e);
            }
        });
    }
    _updateResourcesRemoved (data) {
        console.log("Removed ", data);
        this.currentFiles = this.currentFiles.filter((value, index, arr) => {
            return value.filePath !== data;
        });
    }
    currentResources(){
        return this.currentFiles;
    }
};

