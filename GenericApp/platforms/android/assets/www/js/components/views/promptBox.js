define(function(require){
  var timer;
  var Prompt = React.createClass({displayName: "Prompt",

  propTypes: {
    promptLabel: React.PropTypes.string.isRequired,
    onPromptClick: React.PropTypes.func.isRequired,
    timeLeft:React.PropTypes.number
  },

  getInitialState: function(){
    var counter = this.props.timeLeft;
    return {value: counter};
  },

  componentDidMount:function(){
    timer = setInterval(this.countDown, 1000);
  },

  componentWillUnmount:function(){
      if(timer){
        clearInterval(timer);
        timer = undefined;
      }
  },
  _onAction: function(){
      var sessionKey = $("#sessionkey").val();
      return this.props.onPromptClick(sessionKey);
  },
  countDown: function(){
    if(this.state.value === 1){
      if(timer){
        clearInterval(timer);
        timer = undefined;
      }
      return;
    }
    this.setState({value:this.state.value-1});
  },
  render: function (){
    var promptLabel = this.props.promptLabel;
    var label = String.format(getString(promptLabel),this.state.value);
      return(
        React.createElement("div", {className: "msgBox"}, 
          React.createElement("div", {className: "msgClass"}, 
            React.createElement("center", null, React.createElement("div", {className: "msgLabel"}, label)), 
            React.createElement("center", null, React.createElement("div", {className: "promptField"}, React.createElement("input", {type: "password", id: "sessionkey"}))), 
            React.createElement("center", {className: "centerBox"}, 
              React.createElement("div", {className: "msgBtnClass"}, 
                React.createElement("div", {className: "msgBtn", onClick: this._onAction}, "OK")
              )
            )
          )
        )
      );
    }
  });
return Prompt;
});
