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
        makeHTTPRequestJSON({method: 'POST', url: 'get-guides', body: {request: 'get_descriptors'}},(response) => this.getDescriptorsRequestCallback(response));
    }
    getDescriptorsRequestCallback(response){
        if(response === undefined){
            return;
        }
        this.setState({guidesTree: JSON.parse(response)});
    }

    render() {
        return (
            <div>
                <h1 className="content-title">
                    Guías
                </h1>
                <ul className='guides-list'>
                    <h3>
                        {this.state.guidesTree.map((level) => this.renderLevelGuideIndex(level))}
                    </h3>
                    {}
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