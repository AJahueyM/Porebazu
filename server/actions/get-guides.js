const fileNotifier = require('../common/file-notifier');
const path_module = require('path');

exports.GuidesManager= class GuidesManager extends fileNotifier.FileNotifier{
    constructor() {
        super('guides/*/*/*.md', (data, path) => GuidesManager.parseGuide(data, path), (update) => this.onGuidesUpdated());
        this.guideTree = [];
    }
    static parseGuide(data, path){
        let guide =  {};
        guide.md = data;
        let baseName =  path_module.basename(path);
        baseName = baseName.replace('.md', '');
        baseName = baseName.replace('_', ' ');
        guide.name = baseName;

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
    onGuidesUpdated() {
       let currentGuides =  this.getCurrentGuidesDescriptors();
       let newGuideTree = [];
       currentGuides.forEach((item) => {
           let levelIndex = newGuideTree.findIndex((value) => {
              return value.level === item.level;
           });
    
            if(levelIndex === -1){
                let newLevel = {};
                newLevel.name = item.level;
                newLevel.groups = [];
                newGuideTree.push(newLevel);
                levelIndex = newGuideTree.length - 1;
            }

            let groupIndex =  newGuideTree[levelIndex].groups.indexOf((group) => {
                return group.name === item.group;
            });

            if(groupIndex === 1){
                let newGroup = {};
                newGroup.name = item.name;
                newGroup.guides = [];
                newGuideTree[levelIndex].groups.push(newGroup);
                groupIndex = newGuideTree[levelIndex].groups.length - 1;
            }
            newGuideTree[levelIndex].groups[groupIndex].push(item);
       });
        console.log(newGuideTree);
       this.guideTree = newGuideTree;
    }
    getGuideTree(){
        return this.guideTree;
    }
};