var codeset  = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-=";
var base = 64;
var MAX_UID = Math.pow(base,6);

module.exports.generateUID = function() {
  return Math.random()*MAX_UID-1;
};
  
module.exports.encode = function(uid) {
  var hash = "";
  
  while (uid > 0) {
    hash = codeset[uid % base] + hash
    uid = Math.floor(uid / base)
  }
  return hash
};
  
module.exports.decode = function(encoded) {
  var uid = 0;
  
  encoded.split("").forEach(
    function(char, idx, arr) {
      var n = codeset.indexOf(char);
      
      if (n == -1)
        return 0;
        
      uid += n * Math.pow(base,arr.length - idx -1);
    }
  );
  return uid;
};