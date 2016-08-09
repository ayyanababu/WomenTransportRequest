define(function (require) {
  var MenuButton = require("views/menuButton");
  var Header = require("views/header");
  var NavigationStore = require("stores/navigationStore");
  var NavigationActions = require ("actions/navigationActions");
  var constants = require ("constants/navigationConstants");
  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
  function getState () {
      return {
          controller: NavigationStore.getController(),
          presentationLayer: NavigationStore.getPresentationLayer()
      };
  }

  var navigator = React.createClass({displayName: "navigator",
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        NavigationStore.addChangeListener (constants.Change_Event,this._onChange);
        NavigationActions.pushController(this.props.controller);
        document.addEventListener("backbutton", this._onBackButtonClick, false);
    },
    componentWillUnmount: function () {
        NavigationStore.removeChangeListener (constants.Change_Event,this._onChange);
        document.removeEventListener("backbutton", this._onBackButtonClick, false);
    },
    componentWillReceiveProps: function(nextProps) {
      NavigationActions.changeRootController(nextProps.controller);
    },
    _onChange: function () {
        this.setState (getState());
    },
    _onBackButtonClick:function(event)
    {
        NavigationStore.emitChange(constants.Back_Click_Event);
    },
    _onRightButtonClick:function(event)
    {
        NavigationStore.emitChange(constants.Right_Click_Event);
    },
    _noScroll:function(e)
    {
      e.preventDefault();
      e.stopPropagation();
    },
    render:function()
    {

      var controller;
      var presentationLayer;

      if(this.state.controller)
      {
          var leftButton;
          var rightButton;
          if(this.state.controller.leftButton)
          {
              leftButton = this.state.controller.leftButton;

          }else if(this.state.controller.leftButtonName)
          {
              leftButton = React.createElement(MenuButton, {name: this.state.controller.leftButtonName, onClick: this._onBackButtonClick});
          }

          if(this.state.controller.rightButton)
          {
              rightButton = this.state.controller.rightButton;

          }else if(this.state.controller.rightButtonName)
          {
              rightButton = React.createElement(MenuButton, {align: "right", id: "rightMenuButton", name: this.state.controller.rightButtonName, onClick: this._onRightButtonClick});
          }

          var title = this.state.controller.title ? this.state.controller.title:"";
          var key = NavigationStore.getControllerKey();
          var classname = "gclass";
          if(this.state.presentationLayer)
          {
            var classname = "gclass fillerEffect"
          }
          controller = React.createElement("div", {className: classname, key: key}, 
                        React.createElement("div", {className: "navigationBar"}, 
                          leftButton, 
                          React.createElement(Header, {name: title}), 
                          rightButton
                        ), 
                        React.createElement("div", {className: "controller"}, 
                          this.state.controller.content
                        )
                    );
      }

      if(this.state.presentationLayer)
      {
            presentationLayer = React.createElement("div", {className: "presentationLayer", onTouchMove: this._noScroll}, 
                                    React.createElement("div", {className: "filler"}), 
                                    this.state.presentationLayer
                                )
      }

      return(
        React.createElement("div", {className: "container"}, 
        React.createElement(ReactCSSTransitionGroup, {transitionName: "controller", transitionEnterTimeout: 500, transitionLeave: false}, 
          controller
        ), 

          presentationLayer
        )
      );

    }

  });

  return navigator;
});
