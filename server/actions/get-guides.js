const chokidar = require('chokidar');
const fs = require('fs');
const path_module = require('path');

exports.GuidesManager= class GuidesManager {
    constructor() {
        this.currentGuides = [];
        this.currentGuidesDescriptors = [];
        this.watcher = chokidar.watch('guides/**/*.md', {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            awaitWriteFinish: true
        });

        this.watcher.on('add', path =>{
            this._updateGuideAdded(path);
        });
        this.watcher.on('unlink', path =>{
            this._updateGuideRemoved(path);
        });
        this.watcher.on('change', path =>{
            this._updateGuideChanged(path);
        });
    }
    _updateGuideChanged(path){
        let index = 0;
        this.currentGuides.find((item, i) => {
            if(item.filePath === path){
                index = i;
                return true;
            }
            return false;
        });

        if(index === -1){
            return;
        }

        fs.readFile(path, 'utf8' ,(err, data) => {
            this.currentGuides[index].md = data;
        });
    }
    _updateGuideAdded (path) {
        let index = this.currentGuides.indexOf((item) => {
            return item.filePath === path;
        });
        if(index > -1){
            return;
        }

        fs.readFile(path, 'utf8' ,(err, data) => {
            let newGuide = {};
            newGuide.md = data;
            newGuide.filePath = path;
            newGuide.name = path_module.basename(path);
            this.currentGuides.push(newGuide);
        });

    }
    _updateGuideRemoved (data) {
        this.currentGuides = this.currentGuides.filter((value) => {
            return value.filePath !== data;
        });
    }
    getCurrentGuides(){
        return this.currentGuides;
    }
};

