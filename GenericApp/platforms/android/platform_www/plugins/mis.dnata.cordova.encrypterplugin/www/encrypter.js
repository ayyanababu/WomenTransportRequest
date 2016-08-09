cordova.define("mis.dnata.cordova.encrypterplugin.Encrypter", function(require, exports, module) { var exec = require('cordova/exec');

var Encrypter = {
  encryptMessage:function(successCallback,errorCallback,message)
  {
      exec(successCallback, errorCallback, "Encrypter", "encrypt", message);
  },
  decryptMessage:function(successCallback,errorCallback,message)
  {
      exec(successCallback, errorCallback, "Encrypter", "decrypt", message);
  }
}


module.exports = Encrypter;

});
