cordova.define("mis.dnata.cordova.urlredirecter.URLRedirecter", function(require, exports, module) { var exec = require('cordova/exec');

var URLRedirecter = {
  redirect:function(successCallback,errorCallback,input)
  {
      exec(successCallback, errorCallback, "URLRedirecter", "redirect", input);
  }
}


module.exports = URLRedirecter;

});
