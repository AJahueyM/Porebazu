import React from 'react';
import ReactDOM from 'react-dom';
import {Home} from './index-content/home.jsx'
import {Guides} from './index-content/guides.jsx'
import {Resources} from './index-content/resources.jsx'

export let navigationListener = {};
navigationListener.notify = null;

const ContentState = {
    HOME: 0,
    GUIDES: 1,
    RESOURCES: 2
};

class ContentManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          currentContent: ContentState.HOME,
        };
    }
    componentDidMount() {
        navigationListener.notify = (data) => {
          this.setState({currentContent: data});
        };
    }

    render() {
        switch (this.state.currentContent) {
            case ContentState.HOME:{
                return (
                    <Home/>
                );
            }
            case ContentState.GUIDES: {
                return (
                    <Guides/>
                );
            }
            case ContentState.RESOURCES: {
                return (
                    <Resources/>
                );
            }
            default: {
                return (
                    <h1>
                        Not implemented yet
                    </h1>
                );
            }
        }
    }
}

// ========================================

ReactDOM.render(
    <ContentManager />,
    document.getElementById('root')
);

