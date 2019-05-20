const fileNotifier = require('../common/file-notifier');


exports.ResourceManager= class ResourceManager extends fileNotifier.FileNotifier{
    constructor() {
        super('resources/*.json',(data) => ResourceManager._parseResource(data) );
    }
    static _parseResource(data) {
        return JSON.parse(data);
    }
    getCurrentResources(){
        return this._getParsedFiles();
    }
};

