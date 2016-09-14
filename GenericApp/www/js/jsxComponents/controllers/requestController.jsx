define(function(require) {

  var NavigationController = require ("controllers/navigationController");
  var NavigationActions = require ("actions/navigationActions");
  var NavigationStore = require ("stores/navigationStore");
  var NavigationConstants = require ("constants/navigationConstants");
  var LoginActions = require ('actions/loginActions');
  var LoginConstants= require ('constants/loginConstants');
  var LoginStore = require ("stores/loginStore");

  var Actions = require ('actions/requestActions');
  var Constants= require ('constants/requestConstants');
  var Store = require ("stores/requestStore");

  var Loader = require("views/loader");
  var RequestItem = require("views/requestItem");
  var RequestDetailController = require("controllers/requestDetailController");
   var Msg = require("views/msgBox");

  var requestController = React.createClass ({

    // propTypes:{
    //     id: React.PropTypes.string.isRequired,
    //     options: React.PropTypes.array.isRequired,
    //     defaultvalues: React.PropTypes.array.isRequired,
    //     isSingleSelect: React.PropTypes.bool.isRequired,
    //     onSave: React.PropTypes.func.isRequired
    // },
    componentDidMount: function () {
      Store.addChangeListener(Constants.Request_Actions_Event,this._onRequestsChange);
      NavigationStore.addChangeListener (NavigationConstants.Right_Click_Event,this._onRightButtonClick);
      LoginStore.addChangeListener(LoginConstants.Logout_Error_Event,this._showError);
    },

    componentWillUnmount: function () {
        NavigationStore.removeChangeListener (NavigationConstants.Right_Click_Event,this._onRightButtonClick);
        LoginStore.removeChangeListener(LoginConstants.Logout_Error_Event,this._showError);
        Store.removeChangeListener(Constants.Request_Actions_Event,this._onRequestsChange);
    },
    _onRightButtonClick:function(){
        var msgButtonsArray = [{"title":"yes"},{"title":"no"}];
        NavigationActions.presentPopup(<Msg msgLabel={"confirm_logout"} buttons={msgButtonsArray} onMsgClick={this._onMsgClick}/>);
    },
    _onCancel:function()
    {
        NavigationActions.removePopup();
    },
    _showError:function()
    {
        NavigationActions.removePopup();
        var error = LoginStore.getError();
        if(error)
        {
            var msgButtonsArray = [{"title":"ok"}];
            NavigationActions.presentPopup(<Msg msgLabel={error} buttons={msgButtonsArray} onMsgClick={this._onCancel}/>);
        }
    },
    _onMsgClick:function(title){
      if(title==="yes"){
        NavigationActions.removePopup();
        NavigationActions.presentPopup(<Loader />);
        LoginActions.logOut();
      }
      else if(title==="no"){
        NavigationActions.removePopup();
      }
    },
    _onDisapprove:function(request){
        request.formAction = "4";
        Actions.sendRequest(request);
    },
    _onApprove:function(request){
        request.formAction = "3";
        Actions.sendRequest(request);
    },
    _onRequestItemClick:function(item)
    {
        var requests = Store.getRequests();

        if(requests.length <= item)
        {
          return;
        }

        var request = requests[item];

        var controllerData = {
          title:request.employeeName,
          content: <RequestDetailController data={request} disApprove={this._onDisapprove} approve={this._onApprove} />,
          leftButtonName:"Back"
        };
        NavigationActions.pushController(controllerData)
    },
    render: function() {
        var contents =  this.state.content;
        return(
            <div className="listContainer requestController">
              {contents}
            </div>
          );
    },
    getInitialState:function()
    {
      return {content:this.getContents()};
    },
    getContents:function()
    {
        var requests = Store.getRequests();

        if(!requests)
        {
          return <Loader />;
        }
        var array = [];

        for(var i=0 ; i < requests.length ; i++)
        {
            array.push(<RequestItem key={i} id={i} data={requests[i]} onItemClick={this._onRequestItemClick}/>)
        }

        return array;
    },
    _onRequestsChange:function(){
        var error = Store.getError();
        if(error)
        {
            NavigationActions.removePopup();
            var msgButtonsArray = [{"title":"ok"}];
            NavigationActions.presentPopup(<Msg msgLabel={error} buttons={msgButtonsArray} onMsgClick={this._onCancel}/>);
            return;
        }
        this.setState({content:this.getContents()})
    }
  });

  return requestController;
});
