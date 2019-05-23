const chokidar = require('chokidar');
const fs = require('fs');

exports.FileNotifier = class FileNotifier {
    constructor(path = '.', parseFile = (data, path)=>{}, onFileEvent = (change, path) => {}){
        this.currentFiles = [];
        this.parseFile = parseFile;
        this.onFileEvent = onFileEvent;
        this.watcher = chokidar.watch( path, {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            awaitWriteFinish: true
        });

        this.watcher.on('add', path =>{
            this._updateFileAdded(path);
        });
        this.watcher.on('unlink', path =>{
            this._updateFileRemoved(path);
        });
        this.watcher.on('change', path =>{
            this._updateFileChanged(path);
        });
    }
    _updateFileChanged(path){
        let index = -1;
        this.currentFiles.find((item, i) => {
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
            this.currentFiles[index].parsed = this.parseFile(data, path);
            this.onFileEvent('change', path);
        });
    }
    _updateFileAdded (path) {
        let index = this.currentFiles.indexOf((item) => {
            return item.filePath === path;
        });
        if(index > -1){
            return;
        }

        fs.readFile(path, 'utf8' ,(err, data) => {
            let newFile = {};
            newFile.parsed =  this.parseFile(data, path);
            newFile.filePath = path;
            this.currentFiles.push(newFile);
            this.onFileEvent('add', path);
        });
    }
    _updateFileRemoved (data) {
        this.currentFiles = this.currentFiles.filter((value) => {
            return value.filePath !== data;
        });
        this.onFileEvent('unlink', data);
    }
    _getFiles(){
        return this.currentFiles;
    }
    _getParsedFiles() {
        let parsedFiles = [];
        this.currentFiles.forEach((item) => {
            parsedFiles.push(item.parsed);
        });
        return parsedFiles;
    }
};