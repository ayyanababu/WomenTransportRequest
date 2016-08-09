define (function (require) {
    var appDispatcher = require ("util/appDispatcher");
    var constants = require ("constants/navigationConstants");
    var navigationActions = {
        pushController: function (controller,state) {
            appDispatcher.dispatch ({
                actionType: constants.Navigation_PUSH,
                controller: controller,
                state:state
            });
        },
        popController: function () {
            appDispatcher.dispatch ({
                actionType: constants.Navigation_POP
            });
        },
        changeRootController:function(controller)
        {
            appDispatcher.dispatch ({
                actionType: constants.Navigation_ChangeRoot,
                controller: controller
            });
        },
        clearControllers:function(){
            appDispatcher.dispatch ({
                actionType: constants.Navigation_Clear
            });
        },
        presentPopup:function(view)
        {
            appDispatcher.dispatch ({
                actionType: constants.Navigation_PresentPopup,
                presentationLayer: view
            });
        },
        removePopup:function()
        {
            appDispatcher.dispatch ({
                actionType: constants.Navigation_RemovePopup
            });
        },
        presentPrompt:function(view)
        {
            appDispatcher.dispatch ({
                actionType: constants.Navigation_PresentPrompt,
                presentationLayer: view
            });
        },
        removePrompt:function()
        {
            appDispatcher.dispatch ({
                actionType: constants.Navigation_RemovePrompt
            });
        }
    };
    return navigationActions;
});
