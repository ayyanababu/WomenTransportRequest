define (function (require) {
    var appDispatcher = require ("util/appDispatcher");
    var constants = require ("constants/requestConstants");
    var requestActions = {
        getRequests: function () {
          appDispatcher.dispatch ({
            actionType: constants.Request_Actions
          });
        },
        sendRequest:function(request){
          appDispatcher.dispatch ({
            actionType: constants.Request_Send_Action,
            request:request
          });
        }
    };
    return requestActions;
});
