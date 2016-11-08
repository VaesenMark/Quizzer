import React from 'react';
import * as ReactRedux from 'react-redux';
import {QuizSelectionItem} from './QuizSelectionItem';

import Row from 'react-bootstrap/lib/Row';

class QuizSelectiontUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let theItems = [];
        if (this.props.activeQuizes) {
            theItems = this.props.activeQuizes.map((itm, idx) =>
                <QuizSelectionItem quizId={itm._id}
                                   quizStatus={itm.status}
                                   password={itm.password}
                                   key={itm._id}/>);
        }
        return (
            <div>
                Select a quiz you want to inspect.
                <br/><br/>
                <Row>
                    {theItems}
                </Row>
                <br/>
                <h1>{this.props.password ? 'Password: '+this.props.password : ''}</h1>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        activeQuizes: state.base.activeQuizes,
        password: state.base.password
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}




export const QuizSelection =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuizSelectiontUI);
