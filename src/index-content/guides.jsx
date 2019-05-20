import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkDown from 'react-markdown';
import {makeHTTPRequestJSON} from '../common/html-request-handler.js';

export class Guides extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guidesDescriptors: []
        };
    }
    componentDidMount() {
        makeHTTPRequestJSON({method: 'POST', url: 'get-guides', body: {request: 'get_descriptors'}},(response) => this.getDescriptorsRequestCallback(response));
    }
    getDescriptorsRequestCallback(response){
        if(response === undefined){
            return;
        }
        let guidesDescriptors = JSON.parse(response);
        this.setState({guidesDescriptors: guidesDescriptors});
    }
    static renderGuideDescriptor(props) {
        return (
            <GuideDescriptor descriptor={props.descriptor}  key={props.key} />
        );
    }
    render() {
        return (
            <div>
                <h1 className="content-title">
                    Guías
                </h1>
                <ul className='guides-list'>
                    {this.state.guidesDescriptors.map((descriptor, index) => Guides.renderGuideDescriptor({descriptor: descriptor, key: descriptor.name + "-key-id-" + index}))}
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
                <div className='guide-descriptor-info'>
                    <p className='guide-descriptor-level'>
                        {this.state.descriptor.level}
                    </p>
                    <p className='guide-descriptor-group'>
                        {this.state.descriptor.group}
                    </p>
                </div>
            </div>
        );
    }
}