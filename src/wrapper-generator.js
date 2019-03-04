const fs = require('fs');

let wrapperFilenames = [];
let savedDirname = '';
function readFiles(dirname = 'component-library/') {
    savedDirname = dirname;
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
    fs.readFile(`${dirname}${filename}`, {encoding: 'utf8'}, function read(err, content) {
        if (err) {
            throw err;
        }
    
        processBothFiles(tsContent, content);
    });
    
}

function saveGeneratedWrapper (filename, fileContents) {
    let wrapperFilename = `${filename}-wrapper`;
    wrapperFilenames.push(wrapperFilename);
    fs.writeFile(`tmp/${wrapperFilename}.tsx`, fileContents, () => saveIndexFile());
}

function saveIndexFile () {
    let indexFile = wrapperFilenames.map(fName => `export * from './${fName}';`).join('\n');
    fs.writeFile(`tmp/index.ts`, indexFile, () => console.log('wrote index.ts'));
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
    return safeMatch(tsContent, /<slot.*>/g)
        .map(slot => {
            let namedSlotMatch = /name="(.*)">/.exec(slot);
            return  namedSlotMatch ? [namedSlotMatch[1], 'React.ReactNode'] : ['children', 'React.ReactNode'];
        });
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

const updateProps = (props: ${wrapperClassPropsName}, myRef: any) => {
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

export const ${compClassName}: React.FunctionComponent<${wrapperClassPropsName}> = (props: ${wrapperClassPropsName}) => {
    let cssVars: object = Object.keys(props)
        .filter(prop => prop.includes('--') && props[prop])
        .reduce((acc, val) => {
            return {...acc, [val]: props[val]};
        }, {})
    let myRef: any = React.createRef();
    window.setTimeout(() => {
        updateProps(props, myRef);
    })
    return (
    <div style={cssVars}>
        <${compTagName} ref={myRef}>
            ${propTypeArray
                .filter(([prop, type]) => type.includes('React.ReactNode'))
                .map(([prop, type]) => prop.includes('children') ? `{props.${prop}}` : `<div slot="${prop}">{props.${prop}}</div>`)
                .join('\n           ')}
        </${compTagName}>
    </div>);
}
`;
}

readFiles();