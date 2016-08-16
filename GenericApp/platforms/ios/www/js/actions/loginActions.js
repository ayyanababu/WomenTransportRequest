define (function (require) {
    var appDispatcher = require ("util/appDispatcher");
    var constants = require ("constants/loginConstants");
    var loginActions = {
        doLogin: function (user) {
          appDispatcher.dispatch ({
            actionType: constants.Login_Authenticate,
            user: user
          });
        },
        logOut: function () {
          appDispatcher.dispatch ({
              actionType: constants.Logout
          });
        }
    };
    return loginActions;
});
