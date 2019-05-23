import React from 'react';
import ReactDOM from 'react-dom';
import {makeHTTPRequestJSON} from '../common/html-request-handler.js';

export class Guides extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guidesTree: []
        };
    }
    componentDidMount() {
        makeHTTPRequestJSON({method: 'POST', url: 'get-guides', body: {request: 'get_tree'}},(response) => this.getGuideTreeRequestCallback(response));
    }
    getGuideTreeRequestCallback(response){
        if(response === undefined){
            return;
        }
        let guidesTree = JSON.parse(response);
        this.setState({guidesTree: guidesTree});
    }

    static renderGuide(guide){
        let htmlREQ = "./guide.html?area=" + guide.area + "&level=" + guide.level + "&group=" + guide.group + "&name=" + guide.name;
        return (
            <div key={guide.name + '-list-id'}>
                <a href={htmlREQ}>{guide.name}</a>
            </div>
        );
    }
    static renderGuideGroup(group){
        return (
            <div key={group.name + '-list-id'}>
                <h3>{group.name}</h3>
                {group.guides.map((guide) => Guides.renderGuide(guide))}
            </div>
        );
    }
    static renderGuideLevel(level){
        return(
            <div key={level.name + '-list-id'}>
                <h2>{level.name}</h2>
                {level.groups.map((group) => Guides.renderGuideGroup(group))}
            </div>
        );
    }
    static renderGuideArea(area){
        return(
            <div key={area.name + '-list-id'}>
                <h1>{area.name}</h1>
                {area.levels.map((level) => Guides.renderGuideLevel(level))}
            </div>
        );
    }

    render() {
        return (
            <div>
                <h1 className="content-title">
                    Guías
                </h1>
                <ul className='guides-list'>
                    <h3>
                    </h3>
                    {this.state.guidesTree.map((area) => Guides.renderGuideArea(area))}
                </ul>
            </div>
        );
    }
}