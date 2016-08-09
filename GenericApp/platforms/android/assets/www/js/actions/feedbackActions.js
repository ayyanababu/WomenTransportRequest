define (function (require) {
    var appDispatcher = require ("util/appDispatcher");
    var constants = require ("constants/feedbackConstants");
    var formActions = {

      getFormData: function () {
          appDispatcher.dispatch ({
              actionType: constants.Get_Form_Data
          });
      },
      clearFormData:function(){
        appDispatcher.dispatch ({
            actionType: constants.Clear_Form_Data
        });
      },
      submitFormData:function()
      {
        appDispatcher.dispatch ({
            actionType: constants.Submit_Form_Data
        });
      }
    };
    return formActions;
});
