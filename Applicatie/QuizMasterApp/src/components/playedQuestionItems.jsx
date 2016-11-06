import React from 'react'
import * as ReactRedux from 'react-redux';
import {approveAnswerTeam} from '../reducers';
//TODO binnengekomen calls met error goed afhandelen

class PlayedQuestionItemsUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let clickHandler = (evt) => {
            evt.preventDefault();
            console.log(this.props.quiz._id);
            this.props.approveTeam(this.props.quiz._id, this.props.roundNumber, this.props.questionNumber, this.props.teamID)
        }
        return  (
            <div>
                {this.props.message}
                <span onClick={clickHandler}>
                 {this.props.answer}
                 </span>
            </div>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return {
        approveTeam: (quizID, roundNumber,questionNumber, teamID) => dispatch(approveAnswerTeam(quizID, roundNumber,questionNumber, teamID ))
    }
}

function mapStateToProps(state) {
    return {
        answers : state.PlayedQuestionState.answers,
        quiz: state.MainState.quizItem,
        roundNumber:  state.QuestionsState.roundNumber,
        questionNumber: state.QuestionsState.questionNumber,
        message: state.PlayedQuestionState.message
    }
}

export const PlayedQuestionItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PlayedQuestionItemsUI);
