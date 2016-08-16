define(function (require) {

    var Login = require ("controllers/login");
    var NavigationController = require ("controllers/navigationController");
    var NavigationActions = require ("actions/navigationActions");
    var LoginConstants = require ("constants/loginConstants");
    var LoginStore = require("stores/loginStore");
    var LoginActions= require("actions/loginActions");
    var RequestController= require("controllers/requestController");

    var app = React.createClass({
        displayName: 'dnata',

    componentDidMount: function () {
        LoginStore.addChangeListener (LoginConstants.Login_Issued_Event,this.onChange);
    },
    componentWillUnmount: function () {
        LoginStore.removeChangeListener (LoginConstants.Login_Issued_Event,this.onChange);
    },
    onChange:function()
    {
      this.setState(this.getContents());
    },
    getContents:function () {
        var content;

        if(LoginStore.isUserLoggedIn()){
          var controllerData = {
            title:"all",
            content: React.createElement(RequestController, null),
            rightButtonName:"Logout"
          };
          content = React.createElement(NavigationController, {controller: controllerData})
        }
        else {
          content = React.createElement(Login, null);
        }
        return {content:content};
    },
    getInitialState:function()
    {
      return this.getContents();
    },
    render: function() {
      var content = this.state.content;
      return (
        React.createElement("div", {className: "gclass"}, 
        content
        )
      );
    }
  });
  return app;
});
