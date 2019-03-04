
import * as React from 'react';
import lifecycle from 'react-pure-lifecycle';
import '../component-library/test-comp';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'test-comp': any
        }
    }
}

export interface TestCompWrapperProps {
    'compName': string;
 '--wc-header-padding': string;
 '--primary-text-size': string;
 '--primary-font-family': string;
 '--header-bg-color': string;
 '--primary-text-color': string;
 'left': React.ReactNode;
 'center': React.ReactNode;
 'right': React.ReactNode;
}

let myRef: any = React.createRef();
const updateProps = (props: TestCompWrapperProps) => {
    myRef.current['compName'] = props['compName'];
};
const methods = {
    componentDidMount: updateProps,
    componentDidUpdate: updateProps
};

export const TestCompWrapper: React.FunctionComponent<TestCompWrapperProps> = lifecycle(methods)((props: TestCompWrapperProps) => {
    let cssVars: object = Object.keys(props)
        .filter(prop => prop.includes('--') && props[prop])
        .reduce((acc, val) => {
            return {...acc, [val]: props[val]};
        }, {})
    return (
    <div style={cssVars}>
        <test-comp ref={myRef}>
            <div slot="left">{props.left}</div>
           <div slot="center">{props.center}</div>
           <div slot="right">{props.right}</div>
        </test-comp>
    </div>);
})
