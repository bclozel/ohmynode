var URLcodec = require('../lib/URLcodec');

module.exports.shorturlController = function(baseController, restMvc){

  var shortURLController = baseController.extend({

    insert : function(json, fn){
      var instance = new this.model(json);
      // prune Date and shortkey
      instance.doc.creationDate = new Date();
      instance.doc.shortkey = URLcodec.encode(URLcodec.generateUID());
            
      instance.save( function(err){
        fn(err, instance);
      });
    },

    get : function(key, fn){
        this.model.find({shortkey:key}, function(err, instance) {
            fn(err, instance);
        });
        
    },
    
    remove : function(key, fn){
      this.model.find({shortkey:key}, function(err, list) {
        if (list && list.length > 0) {
          list.forEach(
            function(instance) {
              instance.remove(function(err){
                fn(err, instance)
              });
            }
          );
        } else {
          fn(err, null);
        }
      });
    },
    
    update : function(key, json, fn){
      var options = { safe: true, upsert: false, multi: false};
      var self = this;
      this.model.update({shortkey: key}, json, options, function(err) {
        if (err){
          // TODO: Swallowing this error is bad, but this seems to be thrown when mongo can't find the document we are looking for.
          if (err == 'Error: Element extends past end of object') {
            fn(null, null);
          } else {
            fn(err, null);
          }
        } else {
          self.model.find({shortkey:key}, function(err, instance) {
            fn(err, instance);
          });
        }
      });
    }    

  });

    return shortURLController;
};