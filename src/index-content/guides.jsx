import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkDown from 'react-markdown';
import {makeHTTPRequestJSON} from '../common/html-request-handler.js';

export class Guides extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guidesTree: []
        };
    }
    componentDidMount() {
        makeHTTPRequestJSON({method: 'POST', url: 'get-guides', body: {request: 'get_tree'}},(response) => this.getDescriptorsRequestCallback(response));
    }
    getDescriptorsRequestCallback(response){
        if(response === undefined){
            return;
        }
        let guidesTree = JSON.parse(response);
        this.setState({guidesTree: guidesTree});
    }
    renderGuide(guide){
        return (
            <div>
                <p>{guide.name}</p>
            </div>
        );
    }
    renderGuideGroup(group){
        return (
            <div>
                <h3>{group.name}</h3>
                {group.guides.map((guide) => renderGuide(guide))}
            </div>
        );
    }
    renderGuideLevel(level){
        return(
            <div>
                <h2>{level.name}</h2>
                {level.groups.map((group) => renderGuideGroup(group))}
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
                    {this.guidesTree.map((level) => renderGuideLevel(level))}
                </ul>
            </div>
        );
    }

}

class GuideDescriptor extends React.Component {
    constructor(props){
        super(props);
        this.state= {
          descriptor: props.descriptor
        };
    }
    render() {
        return(
            <div className='guide-descriptor'>
                <h3 className='guide-descriptor-name'>
                    {this.state.descriptor.name}
                </h3>
            </div>
        );
    }
}