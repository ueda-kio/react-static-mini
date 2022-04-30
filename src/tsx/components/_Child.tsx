import React from 'react'

type Props = {
    text: string,
    children: React.ReactNode
}

export const Child: React.VFC<Props> = (props) => {
    return (
        <div className="wrapper">
            <p className="wrapper__lead">{props.text}</p>
            <div className="wrapper__inner">{props.children}</div>
        </div>
    )
};
