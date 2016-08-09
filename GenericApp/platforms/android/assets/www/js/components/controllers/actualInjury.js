define(function(require){
  var Store = require ("stores/formStore");
  var FormActions = require ("actions/formActions");
  var Form = require ("controllers/form");
  var NavigationActions = require ("actions/navigationActions");
  var NavigationStore = require("stores/navigationStore");
  var NavigationConstants = require ("constants/navigationConstants");
  var MultiRowController = require ("controllers/multiRowController");
  var Msg = require("views/msgBox");
  var currentItem = "";
  
  var actualhome = React.createClass({displayName: "actualhome",

    componentDidMount: function () {
        NavigationStore.addChangeListener (NavigationConstants.Back_Click_Event,this._onBackButtonClick);
    },
    componentWillUnmount: function () {
        NavigationStore.removeChangeListener (NavigationConstants.Back_Click_Event,this._onBackButtonClick);
    },
    _onBackButtonClick:function(){
      var msgButtonsArray = [{"title":"yes"},{"title":"no"}];
      if(Store.isDataAvailable())
      {
        NavigationActions.presentPopup(React.createElement(Msg, {msgLabel: "clear_data", buttons: msgButtonsArray, onMsgClick: this._clearData}));
      }
      else
      {
        NavigationActions.popController();
      }
    },
    _clearData:function(title){
      NavigationActions.removePopup();
        if(title === "yes")
        {
          FormActions.clearFormData();
        }
    },
    _onNext:function()
    {

        var formsData = Store.getData();

        //fix for clearing child data when user switch the selection of  child form
        if(formsData && formsData[this.props.id])
        {
            var content = formsData[this.props.id].data.content;
            var childContents = formsData[this.props.id].childContents;
            var keys = Object.keys(childContents);

            for(var i=0;i<keys.length;i++)
            {
                if(currentItem != keys[i])
                {
                    var obj = childContents[keys[i]];
                    var copied = jQuery.extend(true, {}, obj);
                    var array = [copied];
                    content[keys[i]]= array;
                }
            }

        }

        ///
        var content =  React.createElement(MultiRowController, {id: this.props.id, childId: currentItem});
        var rightButtonName = "Submit";
        var leftButtonName = "Back";

        var controllerData = {
          title:currentItem,
          content:content,
          rightButtonName:rightButtonName,
          leftButtonName:leftButtonName
        };

        NavigationActions.pushController(controllerData);
    },
    _onClick: function (key) {

      currentItem = key;
      var content =  React.createElement(Form, {id: this.props.id, onRightButtonClick: this._onNext});
      var rightButtonName = "Next";
      var leftButtonName = "Back";

      var controllerData = {
        title:key,
        content:content,
        rightButtonName:rightButtonName,
        leftButtonName:leftButtonName
      };

      NavigationActions.pushController(controllerData,currentItem);

    },
    getContent: function () {
     var itemsSelected =  NavigationStore.getControllerState();;
     var contentItems = this.props.items;
     var content = [];
     for (var i=0;i<contentItems.length;i++)
     {
       var eachItem = contentItems[i];
       var className = "actualItem";
       if(eachItem === itemsSelected )
       {
         className= "actualItem highlight"
       }
       var iconClass = "actualIcon icon-"+eachItem;
       content.push
       (
         React.createElement("div", {key: i, className: className, onClick: this._onClick.bind(this, eachItem)}, 
           React.createElement("div", {className: iconClass}, " "), 
           React.createElement("div", {className: "actualName"}, getString(eachItem))
         )
       );
     }
     return content;
},

  render: function(){

    var content = this.getContent();
    return(
      React.createElement("div", {className: "actualcontroller"}, 
          content
      )
      );
    }
});
return actualhome;
});
