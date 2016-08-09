define (function (require) {
    var appDispatcher = require ("util/appDispatcher");
    var constants = require ("constants/formConstants");
    var formActions = {

      getFormData: function (id) {
          appDispatcher.dispatch ({
              actionType: constants.Get_Form_Data,
              formId: id
          });
      },
      clearFormData:function(id){
        appDispatcher.dispatch ({
            actionType: constants.Clear_Form_Data
        });
      }
    };
    return formActions;
});
