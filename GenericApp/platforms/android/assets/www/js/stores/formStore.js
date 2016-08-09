define (function (require) {
    var appDispatcher = require ("util/appDispatcher");
    var EventEmitter = require ("event-emitter").EventEmitter;
    var assign = require ("object-assign");
    var constants = require ("constants/formConstants");
    var serverCall = require ("util/serverCall");
    var formData;
    var errorMsg;

    var actionParams = {
        "MS_INC_POTENTIAL_INJ_FORM":"INC_ACTION",
        "MS_INC_ACTUAL_INJURY":"FORM_ACTION"
    }

    var processCode = {
        "MS_INC_POTENTIAL_INJ_FORM":"MSI_INC_POTENTIAL_RPTR_WF",
        "MS_INC_ACTUAL_INJURY":"ACTUAL_INJURY_WF"
    }

    var currentStage = {
        "MS_INC_POTENTIAL_INJ_FORM":"CURRENT_STAGE",
        "MS_INC_ACTUAL_INJURY":"DD_CURRENT_STAGE"
    }

    var keysToShow ={
      "MS_INC_POTENTIAL_INJ_FORM":[
                                  "INC_DATE_AND_TIME",
                                  "INC_WHILE",
                                  "INC_WAS",
                                  "INC_BECAUSE",
                                  "INC_LOCATION_LKP",
                                  "INC_SUB_LOCATION_LKP",
                                  "INC_SUB_LOCATION_LOCALIZED_LKP",
                                  "INC_EXACT_LOCATION",
                                  "INC_SHARED_ONLY_HEAD_SAFETY",
                                  "INC_COMMENTS",
                                  "INC_ATTACHMENT"

                                ],
        "MS_INC_ACTUAL_INJURY":[
                                  "INCIDENT_DATE",
                                  "ADN_WHILE",
                                  "ADN_WAS",
                                  "ADN_BECAUSE",
                                  "INC_LOCATION",
                                  "INC_SUB_LOCATION",
                                  "EXACT_SUB_LOCATION",
                                  "INC_EXACT_LOCATION",
                                  "ADN_SUPPORTING_DOC"
                                ],
        "PSD":[
                "INJURED_PERSON_CAT",
                "INJURED_PERSON_NAME",
                "INJURED_PERSON_STAFF_NO",
                "EMAIL_ADDRESS",
                "INJURED_PERSON_JOB_TITLE",
                "INJURED_PERSON_DEPT",
                "INJURED_PERSON_COMPANY",
                "INJURED_PERSON_MGR",
                "ACTIVITY_DURING_INJURY",
                "BODY_PART",
                "INJURIES_SUSTAINED",
                "MEDICAL_TREATMENT_RECIEVED"
              ],
        "FLY":[
                "FLIGHT_NUMBER_AVAIL",
                "FLIGHT_NUMBER",
                "CARRIER_NAME",
                "AIRCRAFT_TYPE",
                "REGISTRATION_NUMBER",
                "DAMAGE_ATTRIBUTABLE",
                "ARD_DAMAGE_TIME_ACTIVITY",
                "ARD_AIRCRAFT_DAMAGE",
                "ARD_DAMAGE_PART",
                "ARD_DAMAGE_TYPE",
                "ARD_DELAY_SEVERITY"
              ],
        "EQD":[
                "EQD_DAMAGE_EQUIP_TYP",
                "EQD_TYPE_OF_DAMAGE",
                "EQD_FLEET_NUMBER",
                "EQD_MODE_OF_OPN"
              ]

    }

    var keysToMandate = {

      "MS_INC_POTENTIAL_INJ_FORM":[
                                  "INC_DATE_AND_TIME",
                                  "INC_LOCATION_LKP",
                                  "INC_SUB_LOCATION_LKP",
                                  "INC_SUB_LOCATION_LOCALIZED_LKP",
                                  "INC_SHARED_ONLY_HEAD_SAFETY",
                                ],

       "MS_INC_ACTUAL_INJURY":[
                                  "INCIDENT_DATE",
                                  "INC_LOCATION",
                                  "INC_SUB_LOCATION",
                                  "EXACT_SUB_LOCATION",
                              ],
       "PSD":[
               "INJURED_PERSON_CAT",
               "INJURED_PERSON_NAME",
               "ACTIVITY_DURING_INJURY",
               "BODY_PART",
               "INJURIES_SUSTAINED",
               "MEDICAL_TREATMENT_RECIEVED"
              ],

      "FLY":[
              "FLIGHT_NUMBER_AVAIL",
              "CARRIER_NAME",
              "AIRCRAFT_TYPE",
              "REGISTRATION_NUMBER",
              "DAMAGE_ATTRIBUTABLE",
              "ARD_DAMAGE_TIME_ACTIVITY",
              "ARD_AIRCRAFT_DAMAGE",
              "ARD_DAMAGE_PART",
              "ARD_DAMAGE_TYPE",
              "ARD_DELAY_SEVERITY"
            ],

      "EQD":[
              "EQD_DAMAGE_EQUIP_TYP",
              "EQD_TYPE_OF_DAMAGE",
              "EQD_FLEET_NUMBER",
              "EQD_MODE_OF_OPN"
            ]

    }
    var FormStore = assign ({}, EventEmitter.prototype, {

      getError:function()
      {
          return errorMsg;
      },
      getData:function(){
          return formData;
      },
      getResorceData:function(url,callback,skipError)
      {
          var onResponse =  function(data,error)
          {
              if(error && !skipError)
              {
                  errorMsg = error;
                  FormStore.emitChange(constants.On_Error);
              }else {
                  callback(data);
              }
          }

          serverCall.connectServer("GET",url,"",onResponse)
      },
      submitAttachments:function(files,callback)
      {
          var attachedServerObjects=[];
          var successUploads=[];
          var onSuccess = function(fileUrl,obj,error)
          {
              if(error)
              {
                  errorMsg = error;
                  FormStore.emitChange(constants.On_Error);

              }else {
                  var index = files.indexOf(fileUrl);
                  successUploads[index] = true;
                  attachedServerObjects.push(obj);

                  for(var i=0;i<successUploads.length;i++)
                  {
                      if(!successUploads[i])
                      {
                          uploadToServer(files[i],onSuccess);
                          return;
                      }
                  }
                  callback(attachedServerObjects);
              }
          }
          for(var i=0;i<files.length;i++)
          {
              successUploads.push(false);
              if(i==0)
              {
                  uploadToServer(files[i],onSuccess);
              }
          }

      },
      submitFormData:function(id,callback,action)
      {
          var onResponse =  function(data,error)
          {
              if(error)
              {
                  errorMsg = error;
                  FormStore.emitChange(constants.On_Error);
              }else {
                  callback(data);
              }
          }

          var obj = formData[id];
          var data = JSON.stringify(obj.data);
          serverCall.connectServer("PUT","tasks/"+obj.assignmentId+"/form?action="+action,data,onResponse);
      },
      getKeysToShow:function(id)
      {
        return keysToShow[id];
      },
      getKeysToMandate: function(id)
      {
        return keysToMandate[id];
      },
      isFieldRequired: function(id,key)
      {
        var array = keysToMandate[id];
        var isRequired = false;
        if(array && array.indexOf(key) > -1)
        {
          isRequired = true;
        }
        return isRequired;
      },
      getActionParam:function(id)
      {
        return actionParams[id];
      },
      getProcessCode:function(id)
      {
        return processCode[id];
      },
      getCurrentStageKey:function(id)
      {
        return currentStage[id];
      },
      emitChange: function(eventId) {
        this.emit(eventId);
      },
      addChangeListener: function(eventId,callback) {
        this.on(eventId, callback);
      },
      removeChangeListener: function(eventId,callback) {
        this.removeListener(eventId, callback);
      },
      isDataAvailable: function(){
        if(formData)
        {
          return true;
        }
        else
        {
            return false;
        }
      }
    });

    appDispatcher.register (function (action) {
      switch (action.actionType) {
        case constants.Get_Form_Data:
        {
          getFormData(action.formId);
          break;
        }
        case constants.Clear_Form_Data:
        {
          formData = undefined;
          FormStore.emitChange(constants.Clear_Data_Event);
          break;
        }
        default:
        {
            return true;
        }
      }


    });

    function uploadToServer(fileURL,callback)
    {
        var success = function (data,error) {
          if(error)
          {
              if(error === "network_failed")
                callback(fileURL,'',error);
              else {
                callback(fileURL,'',"attachment_upload_failed");
              }
              return;
          }
          callback(fileURL,data);
        }

        var url = fileURL.split(/[?#]/)[0];

        var options = new FileUploadOptions();
        options.fileKey = "content";
        options.fileName = url.substr(fileURL.lastIndexOf('/') + 1);
        options.chunkedMode = false;
        serverCall.uploadDocument("POST","documents",url,options,success);

    }

    function getFormData(id)
    {
        var assignmentId = "";
        var gotFormData = function(data,error)
        {
            if(error)
            {
                errorMsg = error;
                FormStore.emitChange(constants.On_Error);
                return;
            }
            var obj = {
                        assignmentId:assignmentId,
                        data:data
                      }
            if(!formData)
            {
              formData = {};
            }

            if(id==="MS_INC_ACTUAL_INJURY")
            {
                var content = obj.data.content;
                var array =  ["PSD","FLY","EQD"]

                var childContents = {};
                for(var i=0;i<array.length;i++)
                {
                  var childCon = content[array[i]][0];
                  var copied = jQuery.extend(true, {}, childCon);
                  childContents[array[i]] = copied;
                }

                obj["childContents"] = childContents;
            }
            formData[id] = obj;
            FormStore.emitChange(constants.Change_Data_Event);

        }
        var createdTask = function(data,error)
        {
            if(error)
            {
                errorMsg = error;
                FormStore.emitChange(constants.On_Error);
                return;
            }

            serverCall.connectServer("GET","tasks/"+data.assignmentId+"/form","",gotFormData);
            assignmentId = data.assignmentId;
        }

        serverCall.connectServer("POST",encodeURI("tasks?formname="+id+"&text="+getString(id)),"",createdTask);

    }

    return FormStore;
  });
