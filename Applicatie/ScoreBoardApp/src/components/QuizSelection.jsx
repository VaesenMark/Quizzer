import React from 'react';
import * as ReactRedux from 'react-redux';


class QuizSelectiontUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let theItems = [];
        console.log(this.props.activeQuizes);
        if (this.props.activeQuizes) {
            theItems = this.props.activeQuizes.map((itm, idx) =>
                <QuizSelectionItem quizId={itm._id}
                                   quizMaster={itm.quizMasterID}
                                   quizStatus={itm.status}/>);
        }
        return (
            <div>
                {theItems}
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        activeQuizes: state.base.activeQuizes
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}




export const QuizSelection =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuizSelectiontUI);
