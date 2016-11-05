import React from 'react';
import * as ReactRedux from 'react-redux';

import {
    quizSelectedAction
} from '../reducers';


class QuizSelectionItemUI extends React.Component {
    constructor(props) {
        super(props)
    }

    quizSelected() {
        this.props.quizSelected(this.props.quizId)
    }

    render() {
        return (
            <div className="quizSelectionBlock">
                QuizId: {this.props.quizId}
                <br/>
                QuizMaster: {this.props.quizMaster}
                <br/>
                QuizStatus: {this.props.quizStatus}
                <br/>
                <button onClick={this.quizSelected.bind(this)}>Submit</button>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        quizId: state.quizId
    }
}


function mapDispatchToProps(dispatch) {
    return {
        quizSelected: (quizId) => dispatch(quizSelectedAction(quizId))
    }
}




export const QuizSelectionItem =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuizSelectionItemUI);
