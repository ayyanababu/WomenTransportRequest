define (function (require) {
    var appDispatcher = require ("util/appDispatcher");
    var EventEmitter = require ("event-emitter").EventEmitter;
    var assign = require ("object-assign");
    var constants = require ("constants/loginConstants");
    var serverCall = require ("util/serverCall");
    var userDetails;
    var errorMsg;
    var sessionExpiryTimer;
    var promptExpiryTimer;
    var LoginStore = assign ({}, EventEmitter.prototype, {

      isUserLoggedIn:function()
      {
          if(userDetails)
            return true;
          else {
            return false;
          }
      },
      getTimeRemaining:function()
      {
          if(userDetails && userDetails.expiresAt)
          {
              var d = new Date();
              var millisecs = userDetails.expiresAt-d.getTime();

              if(millisecs>1000)
              {
                return parseInt(millisecs/1000);
              }else {
                return 1;
              }
          }

          return 1;
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

    function showPrompt()
    {
      LoginStore.emitChange(constants.Pre_Session_Expiry_Event);
    }

    function clearSessionTimers()
    {
        if(sessionExpiryTimer)
        {
            clearTimeout(sessionExpiryTimer);
            sessionExpiryTimer = undefined;
        }
        if(promptExpiryTimer)
        {
            clearTimeout(promptExpiryTimer);
            promptExpiryTimer = undefined;
        }

    }
    function setSessionExpiryTimers(time)
    {
        clearSessionTimers();
        sessionExpiryTimer = setTimeout(logout, time);
        var promptExpiryTime = 2*59*1000
        if(time > promptExpiryTime)
        {
            promptExpiryTimer = setTimeout(showPrompt, (time-promptExpiryTime));
        }
    }

    function setUserSessionDetails(data)
    {
        userDetails = data;
        var d = new Date();
        userDetails["expiresAt"] = d.getTime()+((parseInt(data.expires_in)-60)*1000);
        setSessionExpiryTimers((parseInt(data.expires_in)-60)*1000);
    }

    function login(user){
      var gotLoginData = function(data,error)
      {
          if(!error)
          {
              setUserSessionDetails(data);
          }else {
              errorMsg = error;
              userDetails = null;
          }
          LoginStore.emitChange(constants.Login_Issued_Event);
      }
      serverCall.login(user,gotLoginData);

    }

    function reLogin(issueCode)
    {
        var reloggedData = function(data,error)
        {
            if(!error)
            {
              setUserSessionDetails(data);
            }else {
              showPrompt();
            }
        }

        if(userDetails)
        {
            var Obj = {
               username: userDetails.user_name,
               pwd: issueCode,
            }
            serverCall.login(Obj,reloggedData);
        }else {
          //this call shouldn't happen. If cade is executig this line then there is some problem with authentication workflow
            logout();
        }

    }

    function logout(){
      document.location = "index.html";
    }

    function revokeToken()
    {
        var _onSuccess = function(data,error)
        {
            if(error)
            {
                errorMsg = error;
                LoginStore.emitChange(constants.Logout_Error_Event);
                return;
            }
            logout();
        }
        serverCall.logout(_onSuccess);
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

              revokeToken();
              break;
            }
            case constants.Login_Reissue:
            {
                reLogin(action.token);
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
