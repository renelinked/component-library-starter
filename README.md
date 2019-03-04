# component-library-start For Web Components
> This project was for determining the complexity and level of effort to generate a web component wrapper in React. 

## Disclaimer
> This project is meant as a proof-of-concept and is a bit hacky.

## Getting started

```
https://github.com/zacktayl/component-library-starter.git
git checkout web-component-support
npm install
npm run build
```

The build command will first compile the contrived, sample web component library (component-library/). It will then run src/wrapper-generator.js which produces one `*-wrapper.tsx` file for each component in tmp/. Last, the typescript compiler is run for all files in the project (output to lib/).

At this point, you should be able to open Alva and navigate to the package.json for importing the web component library.


## License

MIT. (c) 2017-present SinnerSchrader Deutschland GmbH