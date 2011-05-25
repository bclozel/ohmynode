module.exports.shorturlRoutes = function(shorturlController, app, restMvc){

  //Example route implemtation. Uncomment for an example of how to implememnt a custom route.
  
  app.get('/' + shorturlController.plural + '/:shortkey.:format?', function(request, response, next) {
    shorturlController.get(request.params.shortkey, function(err, instance) {
      if (err) {
        next(new Error('Internal Server Error: see logs for details: ' +  err), request, response);
      } else if (!instance) {
        next(restMvc.RestError.NotFound.create('shorturl shortkey: "' + request.params.shortkey + '" was not found.'), request, response);
      } else {
        if (request.params.format){
          if (request.params.format.toLowerCase() == 'json'){
            response.send(instance.toObject());
          } else {
            next(restMvc.RestError.BadRequest.create('The \'' + request.params.format + '\' format is not supported at this time.'), request, response);
          }
        } else {
        
          // redirect browser to real URL
          response.redirect(instance.doc.url);
        }
      }
    });
  });

  app.del('/' + shorturlController.plural + '/:shortkey', function(request, response, next) {
    shorturlController.remove(request.params.shortkey, function(err, instance){
      if (err)
        next(new Error('Internal Server Error: see logs for details: ' +  err), request, response);
      else if (!instance)
        next(restMvc.RestError.NotFound.create(shorturlController.name + ' shortkey: "' + request.params.shortkey + '" was not found.'), request, response);
      else
        response.send(instance.toObject());
    });
  });
};