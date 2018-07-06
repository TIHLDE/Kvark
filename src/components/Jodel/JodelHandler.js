import React, {Component} from 'react'
import Jodel from './Jodel'

export default class JodelHandler extends Component{
    constructor(props){
        super(props);
        let jodelIds = [];
        for (let i = 1; i <= 5; i++) {
            jodelIds.push(i);
        }
        this.state = {jodelIds: jodelIds};

    };

    render(){
        return(
            <div>
                {
                    this.state.jodelIds.map((id) => {
                        return <Jodel id={id}/>
                    })
                }
            </div>

        )
    };

}



