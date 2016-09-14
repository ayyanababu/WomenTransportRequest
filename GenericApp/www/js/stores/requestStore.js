define (function (require) {
    var appDispatcher = require ("util/appDispatcher");
    var EventEmitter = require ("event-emitter").EventEmitter;
    var assign = require ("object-assign");
    var constants = require ("constants/requestConstants");
    var serverCall = require ("util/serverCall");
    var tasks;
    var errorMsg;

    var requestStore = assign ({}, EventEmitter.prototype, {
      getRequests:function(){

        if(!tasks)
        {
          getTasks();
        }
        return tasks;
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


    appDispatcher.register (function (action) {
        switch (action.actionType) {
            case constants.Request_Actions:
            {
              //authentication
              getTasks();
              break;
            }
            case constants.Request_Send_Action:
            {
              //authentication
              sendTask(action.request);
              break;
            }
            default:
            {
                return true;
            }
        }
    });

    function getTasks()
    {
        var successFunction = function(data,error)
        {
            if(error) {
                errorMsg = error;
            }else {
              tasks = data;
            }

            requestStore.emitChange(constants.Request_Actions_Event);
        }
        serverCall.tasks(successFunction);
    }

    function sendTask(request)
    {
        var successFunction = function(data,error)
        {
            tasks = undefined;
            if(error) {
                errorMsg = error;
            }
            requestStore.emitChange(constants.Request_Actions_Event);

        }
        serverCall.takeAction(request,successFunction);
    }

    return requestStore;

  });
