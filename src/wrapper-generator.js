const fs = require('fs');


function readFiles(dirname = 'component-library/') {
    fs.readdir(dirname, function(err, filenames) {
      if (err) {
        throw err;
      }
      filenames
        .filter(filename => !filename.endsWith('.d.ts') && filename.endsWith('.ts'))
        .forEach(function(filename) {
            fs.readFile(dirname + filename, 'utf-8', function(err, content) {
            if (err) {
                throw err;
            }
            readTypingsFile(dirname, filename, content);
            });
        });
    });
}

function readTypingsFile (dirname, filename = '', tsContent) {
    filename = filename.split('.')[0] + '.d.' + filename.split('.')[1];
    console.log('filename:', filename);
    fs.readFile(`${dirname}${filename}`, {encoding: 'utf8'}, function read(err, content) {
        if (err) {
            throw err;
        }
    
        processBothFiles(tsContent, content);
    });
    
}

function saveGeneratedWrapper (filename, fileContents) {
    fs.writeFile(`tmp/${filename}-wrapper.tsx`, fileContents, () => console.log('wrote file'));
}

function processBothFiles (tsContent, typingsContent) {
    let propTypesArray = [...findPropTypes(typingsContent), ...findSlots(tsContent)];
    let cssVars = findCssVars(tsContent);
    let {className, tagName} = findComponentNames(typingsContent, tsContent);

    if (!className || !tagName) {
        return;
    }
    propTypesArray = replaceCssVarsInArray(cssVars, propTypesArray);

    let generatedFile = generateFile(className, tagName, propTypesArray);
    saveGeneratedWrapper(tagName, generatedFile);
}

function findCssVars (tsContent = '') {
    let cssVarsRegex = /cssVariables[ ]+=[ \n]+({[ \n\w:'\-,]*})/g;
    let cssVarLineRegex = /[\w'\-,]*:[ ]+['"][\w\-]*['"]/g;

    let retrieveProp = (propLine = '') => propLine.split(':')[0];
    let retrieveCssVar = (propLine = '') => /['"]([\w\-]*)['"]/g.exec(propLine)[1];

    let [cssVarContent = ''] = safeMatch(tsContent, cssVarsRegex);
    
    return safeMatch(cssVarContent, cssVarLineRegex)
        .map(cssVarLine => [retrieveProp(cssVarLine), retrieveCssVar(cssVarLine)]);
}

function replaceCssVarsInArray (cssVars = [[]], propTypesArray = [[]]) {
    return propTypesArray.map(([prop, type]) => {
        let cssVar = cssVars.find(([cssVarProp]) => cssVarProp === prop);
        return [cssVar ? cssVar[1] : prop, type]
    });
}

function findSlots (tsContent = '') {
    return safeMatch(tsContent, /<slot.*name=".*">/g)
        .map(match => [/name="(.*)">/.exec(match)[1], 'React.ReactNode']);
}

function findPropTypes (typingsContent = '') {
    return safeMatch(typingsContent, /(\w)+:[ ]+([sS]tring|[nN]umber|[oO]bject|[aA]rray)/g)
        .map(match => 
            match.split(':')
            .map(keyOrVal => keyOrVal.trim()));
}

function findComponentNames (typingsContent = '', tsContent) {
    let className = safeExecCaptureGroup(typingsContent, /export[ ]+declare[ ]+class[ ]+(\w*)/g, 1);
    let tagName = safeExecCaptureGroup(tsContent, /customElements.define\(['"](.*)['"]/g, 1);

    return {className, tagName};
}

function safeMatch (str = '', regex) {
    return str.match(regex) || [];
}

function safeExecCaptureGroup (str = '', regex, captureGroup) {
    let arr = regex.exec(str);
    return arr 
        ? (arr[captureGroup] ? arr[captureGroup] : '')
        : '';
}

function generateFile (compClassName, compTagName, propTypeArray = []) {
    let wrapperClassName = `${compClassName}Wrapper`;
    let wrapperClassPropsName = `${wrapperClassName}Props`;

return `
import * as React from 'react';
import lifecycle from 'react-pure-lifecycle';
import '../component-library/${compTagName}';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            '${compTagName}': any
        }
    }
}

export interface ${wrapperClassPropsName} {
    ${propTypeArray.map(([prop, type]) => {
        return `'${prop}': ${type};`;
    }).join('\n ')}
}

let myRef: any = React.createRef();
const updateProps = (props: ${wrapperClassPropsName}) => {
    ${propTypeArray
        .filter(([prop, type]) => 
            (type.toLowerCase() === 'string' || type.toLowerCase() === 'number' || type.toLowerCase() === 'object' || type.toLowerCase() === 'array')
            && !prop.includes('--'))
        .map(([prop, type]) => `myRef.current['${prop}'] = props['${prop}'];`)
        .join('\n   ')}
};
const methods = {
    componentDidMount: updateProps,
    componentDidUpdate: updateProps
};

export const ${wrapperClassName}: React.FunctionComponent<${wrapperClassPropsName}> = lifecycle(methods)((props: ${wrapperClassPropsName}) => {
    let cssVars: object = Object.keys(props)
        .filter(prop => prop.includes('--') && props[prop])
        .reduce((acc, val) => {
            return {...acc, [val]: props[val]};
        }, {})
    return (
    <div style={cssVars}>
        <${compTagName} ref={myRef}>
            ${propTypeArray
                .filter(([prop, type]) => type.includes('React.ReactNode'))
                .map(([prop, type]) => `<div slot="${prop}">{props.${prop}}</div>`)
                .join('\n           ')}
        </${compTagName}>
    </div>);
})
`;
}

readFiles();