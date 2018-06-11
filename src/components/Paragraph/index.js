import Component from 'react';

export default class Paragraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            style : {
                width: props.width || 'auto',
                height: props.height || 'auto',
                overflow: props.overflow || 'hidden',
                fontSize: props.fontSize || 'inherit'
            },
            text: props.text || 'Tekst mangler'
        }
    }

    render() {


        return (
            <p style={this.state.style} className='Paragraph'>
                {props.text}
            </p>
        );
    }
}
