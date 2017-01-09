const React = require('react');
const ReactRouter = require('react-router');
const merely = require('merely');

merely.plugin('merely-react-router', (options, isDev) => {
  
  merely.filter('wrapRootComponent', (app, ctx) => {
    
    return React.createElement(ReactRouter.BrowserRouter, {
      // location: "/"
    }, app);
    
  });
  
});