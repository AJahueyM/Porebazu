const chokidar = require('chokidar');
const fs = require('fs');

exports.ResourceManager= class ResourceManager {
    constructor() {
        this.currentFiles = [];
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
        this.watcher.on('change', path =>{
            this._updateResourcesChanged(path);
        });
    }
    static _checkresource(resource){
        return (resource.name !== undefined && resource.url !== undefined);
    }
    _sortResources(){
        this.currentFiles.sort((a, b) =>{
            return a.name.localeCompare(b.name);
        });
    }
    _updateResourcesChanged(path){
        console.log(path, " changed, tyring to update...");
        fs.readFile(path, (err, data) => {
            let newResource = {};
            try{
            newResource = JSON.parse(data);
            }catch (e) {
                console.log(e);
                return;
            }
            let index = -1;
                this.currentFiles.find((item, i) => {
                    if(item.filePath === path){
                        index = i;
                        return true;
                    }
                    return false;
            });

            if(ResourceManager._checkresource(newResource)){
                console.log("Successfully parsed ", path, " as JSON");
                newResource.filePath = path;

                if( index !== -1){
                    this.currentFiles[index] = newResource;
                }else{
                    this.currentFiles.push(newResource);
                }
                this._sortResources();

            }else{
                console.error(path, " not a valid resource");
                if(index !== -1){
                    console.error(path, " removed as it is no longer a valid resource");
                    this.currentFiles.splice(index, 1);
                }
            }
        });
    }
    _updateResourcesAdded (path) {
        console.log("Found ",path);
        fs.readFile(path,'utf8' ,(err, data) => {
            try{
                let newResource = {};
                try{
                    newResource = JSON.parse(data);
                }catch (e) {
                    console.log(e);
                    return;
                }
                if(ResourceManager._checkresource(newResource)){
                    console.log("Successfully parsed ", path, " as JSON");
                    newResource.filePath = path;
                    this.currentFiles.push(newResource);
                    this._sortResources();
                }else{
                    console.error(path, " not a valid resource");
                }
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
        this._sortResources();

    }
    currentResources(){
        return this.currentFiles;
    }
};

