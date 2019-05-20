const fileNotifier = require('../common/file-notifier');
const path_module = require('path');

exports.GuidesManager= class GuidesManager extends fileNotifier.FileNotifier{
    constructor() {
        super('guides/*/*/*.md', (data, path) => GuidesManager.parseGuide(data, path));
    }
    static parseGuide(data, path){
        let guide =  {};
        guide.md = data;
        guide.name = path_module.basename(path);

        let pathBreakup = path.split('/');
        guide.level = pathBreakup[1];
        guide.group = pathBreakup[2];
        return guide;
    }
    getCurrentGuides(){
        return this._getParsedFiles();
    }
    getGuide(name){
        return this.getCurrentGuides().find((item) => {
           return item.name === name;
        });
    }
    getCurrentGuidesNames() {
        let guidesNames = [];
        this._getParsedFiles().forEach((item) => {
        guidesNames.push(item.name);
        });
        return guidesNames;
    }
    getCurrentGuidesDescriptors() {
        let guidesDescriptors = [];
        this._getParsedFiles().forEach((item) => {
            let descriptor = {};
            descriptor.name = item.name;
            descriptor.level = item.level;
            descriptor.group = item.group;
            guidesDescriptors.push(descriptor);
        });
        return guidesDescriptors;
    }
};