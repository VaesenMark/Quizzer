import React from 'react'
import * as ReactRedux from 'react-redux';
import {startQuiz} from '../reducers';
import {CheckTeamsItem} from './checkTeamsItem'

class CheckTeamsListUI extends React.Component {
    startQuiz(){
        this.props.startQuiz(this.props.quiz);
    }

    render() {
        let theItems = [];
        console.log("items", this.props.teams);
        if (this.props.teams.length>0) {
            this.props.teams.forEach(function(team){
                console.log(team);
                console.log(team.approved);
            });
            theItems = this.props.teams.map((itm, idx) =>

                <CheckTeamsItem
                    item = {itm}
                    key = {itm._id}
                    name = {itm.teamName}
                    approved = {itm.approved}

                />
            )

        }

        console.log("items12", theItems, this.props.teams.length);

        return (<div>
                <h1>test</h1>

                <button id="markAsSeen" onClick={this.startQuiz.bind(this)}>
                    Start quiz
                </button>
                {theItems}
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
