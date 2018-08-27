/**
 * Created by 包俊 on 2018/8/17.
 */
import React from 'react'

export default class Button extends React.Component {

    render() {
        return (
            <button style={this.props.button_status ? Styles.ButtonClickAble : Styles.ButtonUnClickAble}
                    onClick={() => {
                        if (this.props.button_status)
                            this.props.onClick()
                    }}>
                {this.props.button_text}
            </button>
        )
    }
}

const Styles = {
    ButtonClickAble: {
        marginTop: 20,
        backgroundColor: '#2e6da4',
        padding: '6px 12px',
        color: '#fff',
        border: '1px solid #2e6da4',
        borderRadius: '4px',
        fontSize: '14px',
    }, ButtonUnClickAble: {
        marginTop: 20,
        backgroundColor: '#d0d0d0',
        padding: '6px 12px',
        color: '#000',
        border: '1px solid #2e6da4',
        borderRadius: '4px',
        fontSize: '14px',
    }
}