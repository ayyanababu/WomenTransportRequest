define(function(require){
  var Store = require ("stores/feedbackStore");
  var actions = require ("actions/feedbackActions");
  var Constants = require ("constants/feedbackConstants");
  var NavigationActions = require ("actions/navigationActions");
  var NavigationStore = require ("stores/navigationStore");
  var NavigationConstants = require ("constants/navigationConstants");

  var TextArea = require("views/textareaBox");
  var TextBox = require("views/textBox");
  var ToggleButton =  require ("views/toggleButton");
  var SelectBox = require ("views/selectBox");
  var Select = require("controllers/select");
  var Msg = require("views/msgBox");
  var Loader = require("views/loader");

  var msgButtonsArray = [{"title":"ok"}];

  var feedback = React.createClass({

  getInitialState: function () {
    return {content:this.getContent()};
  },
  componentDidMount: function () {
      NavigationStore.addChangeListener(NavigationConstants.Right_Click_Event,this._onSubmit);
      NavigationStore.addChangeListener(NavigationConstants.Back_Click_Event,this._onBackButtonClick);
      Store.addChangeListener(Constants.Change_Data_Event,this._onChange);
      Store.addChangeListener(Constants.Submit_Data_Event,this._onSubmitSuccess);
      Store.addChangeListener(Constants.On_Error_Event,this._showError);

  },
  componentWillUnmount: function () {
      NavigationStore.removeChangeListener(NavigationConstants.Right_Click_Event,this._onSubmit);
      NavigationStore.removeChangeListener(NavigationConstants.Back_Click_Event,this._onBackButtonClick);
      Store.removeChangeListener(Constants.Change_Data_Event,this._onChange);
      Store.removeChangeListener(Constants.Submit_Data_Event,this._onSubmitSuccess);
      Store.removeChangeListener(Constants.On_Error_Event,this._showError);
  },
  _onChange:function()
  {
    this.setState({content:this.getContent()});
  },
  _onBackButtonClick:function(){
    var feedbackObj = Store.getData();
    if(feedbackObj)
    {
      var msgButtons = [{"title":"yes"},{"title":"no"}];
      NavigationActions.presentPopup(<Msg msgLabel={"clear_data"} buttons={msgButtons} onMsgClick={this._clearData}/>);
    }
    else
    {
        NavigationActions.popController();
    }
  },
  _showError:function()
  {
      var error = Store.getError();
      if(error)
      {
          NavigationActions.removePopup();
          NavigationActions.presentPopup(<Msg msgLabel={error} buttons={msgButtonsArray} onMsgClick={this._onCancel}/>);
      }
  },
  _clearData:function(title){
    NavigationActions.removePopup();
    if(title === "yes")
    {
        actions.clearFormData();
        NavigationActions.popController();
    }
  },
  _onCancel:function() {
      NavigationActions.removePopup();

      //this case comes when there is error in retrieving form data first time
      var feedbackObj = Store.getData();
      if(!feedbackObj)
      {
          NavigationActions.popController();
      }
  },
  _onFeedbackSuccessMessage:function()
  {
      NavigationActions.removePopup();
      NavigationActions.popController();
  },
  _onSubmitSuccess: function() {
      NavigationActions.removePopup();
      NavigationActions.presentPopup(<Msg msgLabel={"feedback_success"} buttons={msgButtonsArray} onMsgClick={this._onFeedbackSuccessMessage}/>);
  },
  _onSubmit:function()
  {
      var isEmpty = false;
      var feedbackObj = Store.getData();
      if(!feedbackObj.feedback_title || !feedbackObj.primary_location || !feedbackObj.receive_update )
      {
        isEmpty = true;
      }
      if(feedbackObj.receive_update === "1")
      {
        if(!feedbackObj.feedback_name || !feedbackObj.email_address || !feedbackObj.contact_number)
        {
          isEmpty = true;
        }
      }

      if(isEmpty)
      {
        NavigationActions.presentPopup(<Msg msgLabel={"mandatory_field"} buttons={msgButtonsArray} onMsgClick={this._onCancel}/>);
        return;
      }else {
        NavigationActions.presentPopup(<Loader />);
        actions.submitFormData();
      }
  },
  _onSave: function(id,value) {
    var feedbackObj = Store.getData();
    feedbackObj[id] = value;
    if(id === "receive_update" )
    {
        if(feedbackObj["receive_update"] === "2")
        {
          feedbackObj.feedback_name = "";
          feedbackObj.company_name = "";
          feedbackObj.email_address = "";
          feedbackObj.contact_number = "";
        }
        this.setState({content:this.getContent()});
    }
  },

  _onSelect: function() {
    var isSingleSelect = true;
    var countries = Store.getCountries();
    var content= <Select options={countries} isSingleSelect={isSingleSelect} onSave={this._onSave} id={"primary_location"} />
    var controllerData = {
      title:getString("select"),
      content:content,
      leftButtonName:"Back",
      rightButtonName:"Submit"
    };
    NavigationActions.pushController(controllerData);

  },
  render: function () {
      var content = this.state.content;
      return content;
  },
  getContent: function () {
    var feedbackObj = Store.getData();
    if(!feedbackObj)
    {
        actions.getFormData();
        return(
          <div className="gclass form">
            <Loader />
          </div>
        );
    }

    var className = "hide";
    if(feedbackObj["receive_update"] === "1")
    {
      className = "feedbackUserDetails";
    }
    return(
      <div className="gclass form">
        <TextArea name={"feedback_title"} isRequired={true} limit={2000} onSave={this._onSave} id={"feedback_title"} defaultvalue={feedbackObj["feedback_title"]}/>
        <SelectBox name={"primary_location"} isRequired={true} onSelectBoxClick={this._onSelect} id={"primary_location"} defaultvalues={[feedbackObj["primary_location"]]}/>
        <ToggleButton name={"receive_update"} isRequired={true} options={[{"key":"1","value":"Yes"},{"key":"2","value":"No"}]} id={"receive_update"} onSave={this._onSave} defaultvalue={feedbackObj["receive_update"]}/>
        <div className={className}>
          <TextBox name={"feedback_name"} isRequired={true} id={"feedback_name"} onSave={this._onSave} defaultvalue={feedbackObj["feedback_name"]}/>
          <TextBox name={"company_name"} id={"company_name"} onSave={this._onSave} defaultvalue={feedbackObj["company_name"]}/>
          <TextBox name={"email_address"} isRequired={true} id={"email_address"} onSave={this._onSave} defaultvalue={feedbackObj["email_address"]} />
          <TextBox name={"contact_number"} isRequired={true} id={"contact_number"} onSave={this._onSave} defaultvalue={feedbackObj["contact_number"]} />
        </div>
      </div>
    );
  }
  });

  return feedback;

});
