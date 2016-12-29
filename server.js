const React = require("react");
const ReactDOMServer = require("react-dom/server");
const ReactRouter = require("react-router");

module.exports = function(merely, options) {
  
  merely.filter('wrapRootComponent', (ctx, app) => {
    
    const routerContext = ReactRouter.createServerRenderContext();
    
    ctx._reactRouterContext = routerContext;
    
    return React.createElement(ReactRouter.ServerRouter, {
      location: ctx.req.url,
      context: routerContext
    }, app);
    
  });
  
  merely.filter('afterRender', (ctx, renderedString) => {
    
    const routerContext = ctx._reactRouterContext;
    const result = routerContext.getResult();
    
    if(result.redirect) {
      
      // Result was that we need to redirect elsewhere:
      ctx.res.writeHead(301, {
        Location: result.redirect.pathname
      });
      ctx.res.end();
      
    } else {
      
      // If we got a miss, render a 404
      if(result.missed) {
        ctx.res.writehead(404);
        const secondaryRoot = React.createElement(ReactRouter.ServerRouter, {
          location: ctx.req.url,
          context: routerContext
        }, ctx.rootComponent);
        renderedString = ReactDOMServer.renderToString(secondaryRoot);
      }
      
      ctx.res.write(renderedString);
      ctx.res.end();
      
      return renderedString;
      
    }
    
  });
  
}