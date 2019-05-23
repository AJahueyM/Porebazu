const fileNotifier = require('../common/file-notifier');
const path_module = require('path');

exports.GuidesManager= class GuidesManager extends fileNotifier.FileNotifier{
    constructor() {
        super('guides/*/*/*/*.md', (data, path) => this.parseGuide(data, path), (update, path) => this.onGuidesUpdated(update, path));
        this.guideTree = [];
        this.currentGuides = 0;
    }
    parseGuide(data, path){
        let guide =  {};
        guide.md = data;
        let baseName =  path_module.basename(path);
        baseName = baseName.replace('.md', '');
        baseName = baseName.replace('_', ' ');
        guide.name = baseName;

        let pathBreakup = path.split('/');
        guide.area = pathBreakup[1];
        guide.level = pathBreakup[2];
        guide.group = pathBreakup[3];
        guide.id = this.currentGuides;
        this.currentGuides = this.currentGuides + 1;
        return guide;
    }
    getCurrentGuides(){
        return this._getParsedFiles();
    }
    getGuide(level, group, name){
        return this.getCurrentGuides().find((item) => {
           return item.name === name;
        });
    }
    getGuideByID(id){
        return this.getCurrentGuides().find((item) => {
            return item.id === id;
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
            let descriptor = item;
            descriptor.data = undefined;
            guidesDescriptors.push(descriptor);
        });
        return guidesDescriptors;
    }
    onGuidesUpdated(change, path) {
       let currentGuides =  this.getCurrentGuidesDescriptors().slice();
       let newGuideTree = [];
       currentGuides.forEach((item) => {
           let areaIndex = newGuideTree.findIndex((value) => {
                return value.name === item.area;
           });

           if(areaIndex === -1){
               let newArea = {};
               newArea.name = item.area;
               newArea.levels = [];
               newGuideTree.push(newArea);
               areaIndex = newGuideTree.length - 1;
           }

           let levelIndex = newGuideTree[areaIndex].levels.findIndex((value) => {
                return value.name === item.level;
           });

            if(levelIndex === -1){
                let newLevel = {};
                newLevel.name = item.level;
                newLevel.groups = [];
                newGuideTree[areaIndex].levels.push(newLevel);
                levelIndex = newGuideTree[areaIndex].levels.length - 1;
            }
            let groupIndex =  newGuideTree[areaIndex].levels[levelIndex].groups.findIndex((group) => {
                return group.name === item.group;
            });

            if(groupIndex === -1){
                let newGroup = {};
                newGroup.name = item.group;
                newGroup.guides = [];
                newGuideTree[areaIndex].levels[levelIndex].groups.push(newGroup);
                groupIndex = newGuideTree[areaIndex].levels[levelIndex].groups.length - 1;
            }
            newGuideTree[areaIndex].levels[levelIndex].groups[groupIndex].guides.push(item);
       });
        this.guideTree = newGuideTree;
    }
    getGuideTree(){
        return this.guideTree;
    }
};