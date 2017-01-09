const React = require("react");
const ReactDOMServer = require("react-dom/server");
const ReactRouter = require("react-router");
const merely = require('merely');

merely.plugin('merely-react-router', (options, isDev) => {
  
  merely.filter('wrapRootComponent', (app, ctx) => {
    
    const routerContext = ReactRouter.createServerRenderContext();
    
    ctx._reactRouterContext = routerContext;
    
    return React.createElement(ReactRouter.ServerRouter, {
      location: ctx.req.url,
      context: routerContext
    }, app);
    
  });
  
  merely.on('afterRender', (renderedString, ctx) => {
    
    const routerContext = ctx._reactRouterContext;
    const result = routerContext.getResult();
    
    if(result.redirect) {
      
      // Result was that we need to redirect elsewhere:
      ctx.res.writeHead(301, {
        Location: result.redirect.pathname
      });
      ctx.res.end();
      ctx.done();
      
    } else if(result.mised) {
      
      ctx.statusCode = 404;
      
      // If we got a miss, render a 404
      // if(result.missed) {
      //   ctx.res.writehead(404);
      //   const secondaryRoot = React.createElement(ReactRouter.ServerRouter, {
      //     location: ctx.req.url,
      //     context: routerContext
      //   }, ctx.rootComponent);
      //   renderedString = ReactDOMServer.renderToString(secondaryRoot);
      // }
      // 
      // ctx.res.write(renderedString);
      // ctx.res.end();
      // ctx.done();
      
    }
    
    return renderedString;
    
  });
  
});