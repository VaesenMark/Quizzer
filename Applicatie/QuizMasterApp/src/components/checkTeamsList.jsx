import React from 'react'
import * as ReactRedux from 'react-redux';
import {startQuiz} from '../reducers';
import {checkTeamsItem} from './checkTeamsItem'

class CheckTeamsListUI extends React.Component {
    startQuiz(){
        this.props.startQuiz(this.props.quiz);
    }

    render() {
        let theItems = [];
        console.log("items", this.props.teams);
        if (this.props.teams.length>0) {
            theItems = this.props.teams.map((itm, idx) =>
                <checkTeamsItem
                    key = {itm._id}
                    name = {itm.categoryName}
                />
            )
        }
        console.log("items12", theItems, this.props.teams.length);

        return (<div>
                <h1>test</h1>
                {theItems}
                <button id="markAsSeen" onClick={this.startQuiz.bind(this)}>
                    Start quiz
                </button>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        startQuiz: (quiz) => dispatch(startQuiz(quiz)),
    }
}

function mapStateToProps(state) {
    return {
        quiz: state.headState.quizItem,
        teams : state.team.teams
    }
}

export const CheckTeamList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckTeamsListUI);
