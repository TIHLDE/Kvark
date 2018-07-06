import React, {Component} from 'react'
import Jodel from './Jodel'

export default class JodelHandler extends Component{
    constructor(props){
        super(props);
        this.state = {
            jodels:[
                {text: props.text, votes: props.votes, time: props.time, voted: props.voted},
                {text: props.text, votes: props.votes, time: props.time, voted: props.voted},
                {text: props.text, votes: props.votes, time: props.time, voted: props.voted},
                {text: props.text, votes: props.votes, time: props.time, voted: props.voted},
                {text: props.text, votes: props.votes, time: props.time, voted: props.voted},
                {text: props.text, votes: props.votes, time: props.time, voted: props.voted},
                {text: props.text, votes: props.votes, time: props.time, voted: props.voted},
                {text: props.text, votes: props.votes, time: props.time, voted: props.voted},
            ]
        };
    };

    render(){
        return(
            <div>
                {
                    this.state.jodels.map((jodel) => {
                        return <Jodel text={jodel.text} votes={jodel.votes} time={jodel.time} voted={jodel.voted}/>
                    })
                }
            </div>

        )
    };

}



