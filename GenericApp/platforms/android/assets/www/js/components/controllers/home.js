define(function (require) {
  var Store = require('stores/homeStore');
  var Grid = require ("controllers/gridController");
  var ActualInjury = require ("controllers/actualInjury");
  var NavigationController = require ("controllers/navigationController");
  var NavigationActions = require ("actions/navigationActions");
  var NavigationStore = require ("stores/navigationStore");
  var NavigationConstants = require ("constants/navigationConstants");
  var LoginActions = require ('actions/loginActions');
  var LoginConstants= require ('constants/loginConstants');
  var LoginStore = require ("stores/loginStore");
  var Loader = require("views/loader");
  var Feedback = require("controllers/feedback");

  var Msg = require("views/msgBox");
  var home = React.createClass({displayName: "home",

  componentDidMount: function () {
      NavigationStore.addChangeListener (NavigationConstants.Right_Click_Event,this._onRightButtonClick);
      LoginStore.addChangeListener(LoginConstants.Logout_Error_Event,this._showError);
  },

  componentWillUnmount: function () {
      NavigationStore.removeChangeListener (NavigationConstants.Right_Click_Event,this._onRightButtonClick);
      LoginStore.removeChangeListener(LoginConstants.Logout_Error_Event,this._showError);
  },
  _onRightButtonClick:function(){
      var msgButtonsArray = [{"title":"yes"},{"title":"no"}];
      NavigationActions.presentPopup(React.createElement(Msg, {msgLabel: "confirm_logout", buttons: msgButtonsArray, onMsgClick: this._onMsgClick}));
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
          NavigationActions.presentPopup(React.createElement(Msg, {msgLabel: error, buttons: msgButtonsArray, onMsgClick: this._onCancel}));
      }
  },
  _onMsgClick:function(title){
    if(title==="yes"){
      NavigationActions.removePopup();
      NavigationActions.presentPopup(React.createElement(Loader, null));
      LoginActions.logOut();
    }
    else if(title==="no"){
      NavigationActions.removePopup();
    }
  },
  _handleChange: function(key){
    var content;
    var leftButtonName = "Back";
    var rightButtonName;
    switch(key){
      case "MS_INC_ACTUAL_INJURY":
      {
        content = React.createElement(ActualInjury, {items: Store.getActualInjuryFormItems(), id: key});
        break;
      }

      case "MS_INC_POTENTIAL_INJ_FORM":
      {
        content = React.createElement(Grid, {items: Store.getPotentialInjuryFormItems(), id: key});
        rightButtonName="Next";
        break;
      }

      case "MS_INC_FEEDBACK":
      {
        content = React.createElement(Feedback, null);
          rightButtonName="Submit";
        break;
      }
    }

    var controllerData = {
      title:key,
      content:content,
      rightButtonName:rightButtonName,
      leftButtonName:leftButtonName
    };

    NavigationActions.pushController(controllerData);
  },

  getContent:function(){
     var contentItems = Store.getHomeMenuItems();

     var content = [];
     for (var i=0;i<contentItems.length;i++){

       var eachItem = contentItems[i]
       var className = "sectionEvenItem";
       if(i%2 !== 0)
       {
         className = "sectionOddItem";
       }
       var iconClass = "sectionIcon icon-"+eachItem;
       content.push(
            React.createElement("div", {key: i, className: className, onClick: this._handleChange.bind(this, eachItem)}, 
              React.createElement("div", {className: iconClass}, " "), 
              React.createElement("div", {className: "sectionName"}, getString(eachItem).toUpperCase())
            )
       );
     }
     return content;
  },

  render:function(){
    var content = this.getContent();

    return(
      React.createElement("div", {className: "gclass"}, 
          content
      )
      );
    }
  });
  return home;
});
