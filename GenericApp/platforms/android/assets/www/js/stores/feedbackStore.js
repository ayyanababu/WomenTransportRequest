define (function (require) {
  var appDispatcher = require ("util/appDispatcher");
  var EventEmitter = require ("event-emitter").EventEmitter;
  var assign = require ("object-assign");
  var constants = require ("constants/feedbackConstants");
  var serverCall = require ("util/serverCall");

  var feedbackObj;
  var errorMsg;

  var countries = [
                    {"key":"AUS", "value":"Australia"},
                    {"key":"EBL", "value":"Iraq"},
                    {"key":"MNL", "value":"Philippines"},
                    {"key":"SIN", "value":"Singapore"},
                    {"key":"GVA", "value":"Switzerland Geneva"},
                    {"key":"ZRH", "value":"Switzerland Zurich"},
                    {"key":"UAE", "value":"United Arab Emirates"},
                    {"key":"UK", "value":"United Kingdom"},

                  ]

  var store = assign ({}, EventEmitter.prototype, {
      getData:function()
      {
        return feedbackObj;
      },
      getCountries:function()
      {
        return countries;
      },
      getError:function()
      {
        return errorMsg;
      },
      emitChange: function(eventId) {
        this.emit(eventId);
      },
      addChangeListener: function(eventId,callback) {
        this.on(eventId, callback);
      },
      removeChangeListener: function(eventId,callback) {
        this.removeListener(eventId, callback);
      }

  });

  appDispatcher.register (function (action) {
    switch (action.actionType) {
      case constants.Get_Form_Data:
      {
        getFeedbackData();
        break;
      }
      case constants.Clear_Form_Data:
      {
        clearFormData();
        break;
      }
      case constants.Submit_Form_Data:
      {
        submitFormData();
        break;
      }
      default:
      {
          return true;
      }
    }
  });

  function clearFormData()
  {
    feedbackObj = undefined;
  }

  function getFeedbackData()
  {
    var id = "MS_INC_FEEDBACK";
    var gotFormData = function(data,error)
    {

        if(error)
        {
            errorMsg = error;
            store.emitChange(constants.On_Error_Event);
            return;
        }

        feedbackObj = {
          feedback_title:"",
          primary_location:"",
          receive_update:"2",
          feedback_name:"",
          company_name:"",
          email_address:"",
          contact_number:"",
          assignmentId:assignmentId,
          data:data
        }
        store.emitChange(constants.Change_Data_Event);

    }
    var createdTask = function(data,error)
    {
        if(error)
        {
            errorMsg = error;
            store.emitChange(constants.On_Error_Event);
            return;
        }

        serverCall.connectServer("GET","tasks/"+data.assignmentId+"/form","",gotFormData);
        assignmentId = data.assignmentId;
    }

    serverCall.connectServer("POST",encodeURI("tasks?formname="+id+"&text="+getString(id)),"",createdTask);

  }

  function submitFormData()
  {
      var _onSuccess=function(data,error)
      {
          if(error)
          {
              errorMsg = error;
              store.emitChange(constants.On_Error_Event);
              return;
          }
          clearFormData();
          store.emitChange(constants.Submit_Data_Event);
      }

      var data = JSON.stringify(getDataToSubmit());
      serverCall.connectServer("PUT","tasks/"+feedbackObj.assignmentId+"/form?action=submit",data,_onSuccess);

  }

  function getDataToSubmit()
  {
      var data = feedbackObj.data;
      var content = data.content;

      content.DD_CURRENT_STAGE = {value:"1"};
      content.DD_PROCESS_CODE = {value:"FEEDBACK_WF_NEW"};
      content.INSTANCE_REC_NUM = {value:"1"};
      content.FEEDBACK_STATUS = {value:"0"};
      content.FEEDBACK_TITLE = {value: feedbackObj.feedback_title};
      content.REPORTER_NAME = {value: feedbackObj.feedback_name};
      content.REPORTER_COMPANY_NAME = {value: feedbackObj.company_name};
      content.REPORTER_EMAIL = {value: feedbackObj.email_address};
      content.REPOTER_CONCTACT_NUMBER = {value: feedbackObj.contact_number};
      content.INC_REF_NUMBER = {value: ""};

      content.FORM_ACTION = {value:"2"};

      content.DUMMY_CHAR1 = {value:""+data.meta.pid};

      var reportTitle  = getString('MS_INC_FEEDBACK')+"-"+ Moment().format("MM/DD/YYYY");
      content.DUMMY_CHAR5 = {value: reportTitle};

      var localObject = feedbackObj.primary_location;
      content.COUNTRY = {value:localObject.key};

      content.PREVIOUS_STAGE = {value:"0"};
      content.RECIEVE_UPDATE = {value: feedbackObj.receive_update};

      return data;

  }

  return store;
});
