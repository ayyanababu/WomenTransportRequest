define(function(require){
  var timer;
  var Prompt = React.createClass({

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
        <div className="msgBox">
          <div className="msgClass">
            <center><div className="msgLabel">{label}</div></center>
            <center><div className="promptField"><input type="password" id="sessionkey"></input></div></center>
            <center className="centerBox">
              <div className="msgBtnClass">
                <div className="msgBtn" onClick={this._onAction}>OK</div>
              </div>
            </center>
          </div>
        </div>
      );
    }
  });
return Prompt;
});
