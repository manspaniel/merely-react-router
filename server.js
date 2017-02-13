const React = require("react");
const ReactDOMServer = require("react-dom/server");
const merely = require('merely');

import { StaticRouter } from 'react-router'

merely.plugin('merely-react-router', (options, isDev) => {
  
  merely.filter('wrapRootComponent', (app, ctx) => {
    
    ctx._reactRouterContext = {};
    
    return React.createElement(StaticRouter, {
      location: ctx.req.url,
      context: ctx._reactRouterContext
    }, app);
    
  });
  
  merely.on('afterRender', (renderedString, ctx) => {
    
    const result = ctx._reactRouterContext;
    
    if(result.url) {
      
      // Result was that we need to redirect elsewhere:
      ctx.res.writeHead(301, {
        Location: result.url
      });
      ctx.res.end();
      ctx.done();
      
    }
    
    return renderedString;
    
  });
  
});