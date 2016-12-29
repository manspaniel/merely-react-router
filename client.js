import React from 'react';
import ReactRouter from 'react-router';

module.exports = function(merely, options) {
  
  merely.filter('wrapRootComponent', (ctx, app) => {
    
    return React.createElement(ReactRouter.BrowserRouter, {
      location: ctx.url,
      context: routerContext
    }, app);
    
  });
  
}