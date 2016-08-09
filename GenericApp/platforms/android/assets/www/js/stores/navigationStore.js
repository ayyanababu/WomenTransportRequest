define (function (require) {
    var appDispatcher = require ("util/appDispatcher");
    var EventEmitter = require ("event-emitter").EventEmitter;
    var assign = require ("object-assign");
    var constants = require ("constants/navigationConstants");

    var controllerStack =[];
    var controllerState = {};
    var popUpView;
    var promptView;

    var navigationStore = assign ({}, EventEmitter.prototype, {

      getPresentationLayer:function()
      {
        if(promptView)
          return promptView;

        return popUpView;
      },
      getController:function()
      {
        var controller;
        if(controllerStack.length>0)
        {
          controller = controllerStack[controllerStack.length-1];
        }

        return controller;
      },
      getControllerKey:function()
      {
        return controllerStack.length-1;
      },
      getControllerState:function()
      {
          var state;

          if(controllerStack.length>0)
          {
              state =  controllerState[controllerStack.length-1];
          }

          return state;
      },
      emitChange: function(eventId) {
        this.emit(eventId);
      },
      addChangeListener: function(eventId,callback) {

        if(eventId === constants.Back_Click_Event || eventId === constants.Right_Click_Event)
        {
            this.removeAllListeners(eventId);
        }
        this.on(eventId, callback);
      },
      removeChangeListener: function(eventId,callback) {
        this.removeListener(eventId, callback);
      },
      removeAllChangeListeners: function(eventId) {
        this.removeAllListeners(eventId);
      }
    });

    appDispatcher.register (function (action) {
        switch (action.actionType) {
            case constants.Navigation_PUSH:
                {
                    var currentIndex = controllerStack.length-1;
                    if(action.state)
                    {
                        controllerState[currentIndex] = action.state;
                    }

                    controllerStack.push(action.controller);
                    navigationStore.emitChange(constants.Change_Event);
                    break;
                }
            case constants.Navigation_POP:
                {
                    var currentIndex = controllerStack.length-1;

                    if(controllerState[currentIndex])
                    {
                        delete controllerState[currentIndex];
                    }

                    controllerStack.pop();
                    navigationStore.emitChange(constants.Change_Event);
                    break;
                }
            case constants.Navigation_Clear:
                {
                    controllerStack =[];
                    controllerState = {};
                    navigationStore.removeAllChangeListeners(constants.Back_Click_Event);
                    navigationStore.removeAllChangeListeners(constants.Right_Click_Event);
                    navigationStore.emitChange(constants.Change_Event);
                    break;
                }
            case constants.Navigation_ChangeRoot:
              {
                    controllerStack =[];
                    controllerState = {};
                    navigationStore.removeAllChangeListeners(constants.Back_Click_Event);
                    navigationStore.removeAllChangeListeners(constants.Right_Click_Event);
                    controllerStack.push(action.controller);
                    navigationStore.emitChange(constants.Change_Event);
                    break;
              }
            case constants.Navigation_PresentPopup:
              {
                    popUpView = action.presentationLayer
                    navigationStore.emitChange(constants.Change_Event);
                    break;
              }
            case constants.Navigation_RemovePopup:
              {
                    popUpView = undefined;
                    navigationStore.emitChange(constants.Change_Event);
                    break;
              }
              case constants.Navigation_PresentPrompt:
                {
                      promptView = action.presentationLayer
                      navigationStore.emitChange(constants.Change_Event);
                      break;
                }
              case constants.Navigation_RemovePrompt:
                {
                      promptView = undefined;
                      navigationStore.emitChange(constants.Change_Event);
                      break;
                }
            default:
                {
                    return true;
                }
        }
    });

    return navigationStore;
  });
