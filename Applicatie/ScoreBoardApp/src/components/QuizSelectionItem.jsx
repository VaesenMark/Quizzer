import React from 'react';
import * as ReactRedux from 'react-redux';

import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';

import {
    quizSelectedAction
} from '../reducers';


class QuizSelectionItemUI extends React.Component {
    constructor(props) {
        super(props)
    }

    quizSelected() {
        this.props.quizSelected(this.props.quizId, this.props.quizStatus)
    }

    render() {
        return (
            <Col xs={6} sm={4} md={3}>
                <Panel header={`Quiz ID ${this.props.quizId}`} bsStyle="primary" className="text-center">
                    <br/>
                    <button onClick={this.quizSelected.bind(this)}>Select</button>
                    <br/><br/>
                </Panel>
            </Col>
        );
    }
}


function mapStateToProps(state) {
    return {
    }
}


function mapDispatchToProps(dispatch) {
    return {
        quizSelected: (quizId, quizStatus) => dispatch(quizSelectedAction(quizId, quizStatus))
    }
}




export const QuizSelectionItem =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuizSelectionItemUI);
