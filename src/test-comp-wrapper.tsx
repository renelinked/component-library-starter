import * as React from 'react';
import lifecycle from 'react-pure-lifecycle';
import './test-comp';
import * as TestComp from './test-comp';

TestComp.TestComp

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'test-comp': any
        }
    }
}

export interface TestCompPropsWrapper extends TestComp.TestCompProps {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
    '--fds-header-padding': string;
    '--primary-text-size': string;
    '--primary-font-family': string;
    '--header-bg-color': string;
    '--primary-text-color': string;
}

let myRef: any = React.createRef();
const updateProps = (props: TestCompPropsWrapper) => {
    myRef.current.compName = props.compName;
};
const methods = {
    componentDidMount: updateProps,
    componentDidUpdate: updateProps
}

export const TestCompWrapper: React.FunctionComponent<TestCompPropsWrapper> = lifecycle(methods)((props: TestCompPropsWrapper) => {
    let cssVars: object = Object.keys(props)
        .filter(prop => prop.includes('--') && props[prop])
        .reduce((acc, val) => {
            return {...acc, [val]: props[val]};
        }, {})
        // .map(prop => `${prop}: ${props[prop]};`).join(' ');
    let cssVarsString = Object.keys(cssVars).map(key => `${key}: ${cssVars[key]}`);
    return (
    <div style={cssVars}>
        <test-comp ref={myRef}><div slot="left">{props.left}</div><div slot="center">{props.center}</div><div slot="right">{props.right}</div></test-comp>
    </div>);
})
