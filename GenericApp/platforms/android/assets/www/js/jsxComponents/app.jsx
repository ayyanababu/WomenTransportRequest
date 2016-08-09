define(function (require) {

    var Login = require ("controllers/login");
    var NavigationController = require ("controllers/navigationController");
    var NavigationActions = require ("actions/navigationActions");
    var LoginConstants = require ("constants/loginConstants");
    var LoginStore = require("stores/loginStore");
    var LoginActions= require("actions/loginActions");

    var app = React.createClass({
        displayName: 'dnata',

    componentDidMount: function () {
        LoginStore.addChangeListener (LoginConstants.Login_Issued_Event,this.onChange);
        LoginStore.addChangeListener (LoginConstants.Pre_Session_Expiry_Event,this.showExpiryPrompt);
    },
    componentWillUnmount: function () {
        LoginStore.removeChangeListener (LoginConstants.Login_Issued_Event,this.onChange);
        LoginStore.removeChangeListener (LoginConstants.Pre_Session_Expiry_Event,this.showExpiryPrompt);
    },
    onChange:function()
    {
      this.setState(this.getContents());
    },
    getContents:function () {
        var content =  <Login />;
        return {content:content};
    },
    getInitialState:function()
    {
      return this.getContents();
    },
    render: function() {
      var content = this.state.content;
      return (
        <div className="gclass">
        {content}
        </div>
      );
    }
  });
  return app;
});
