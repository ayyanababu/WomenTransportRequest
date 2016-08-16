define (function (require) {
    var appDispatcher = require ("util/appDispatcher");
    var EventEmitter = require ("event-emitter").EventEmitter;
    var assign = require ("object-assign");
    var constants = require ("constants/loginConstants");
    var serverCall = require ("util/serverCall");
    var errorMsg;
    var isLoggedIn = false;
    var LoginStore = assign ({}, EventEmitter.prototype, {

      isUserLoggedIn:function()
      {
          return isLoggedIn;
      },
      getError:function()
      {
          return errorMsg;
      },
      emitChange: function(id) {
        this.emit(id);
      },
      addChangeListener: function(id,callback) {
        this.on(id, callback);
      },
      removeChangeListener: function(id,callback) {
        this.removeListener(id, callback);
      }
    });

    function login(user){
      var gotLoginData = function(data,error)
      {
          if(!error)
          {
              isLoggedIn = true;
          }else {
              errorMsg = error;
          }
          LoginStore.emitChange(constants.Login_Issued_Event);
      }
      serverCall.login(user,gotLoginData);
    }

    function logout(){
      document.location = "index.html";
    }

    appDispatcher.register (function (action) {
        switch (action.actionType) {
            case constants.Login_Authenticate:
            {
              //authentication
              login(action.user);
              break;
            }
            case constants.Logout:
            {

              logout();
              break;
            }
            default:
            {
                return true;
            }
        }
    });

    return LoginStore;
  });
