define(function(require){

  var Msg = React.createClass({displayName: "Msg",

  propTypes: {
    msgLabel: React.PropTypes.string.isRequired,
    buttons:  React.PropTypes.array.isRequired,
    onMsgClick: React.PropTypes.func.isRequired
  },

  _onAction: function(i){
    var title =  this.props.buttons[i].title;
    return this.props.onMsgClick(title);
  },

  render: function () {
    var content = [];
    var msgButton = this.props.buttons;
    var msgLabel = this.props.msgLabel;
    for (var i=0; i<msgButton.length;i++)
    {
      var className = "msgBtn";
      if(i%2 !== 0)
      {
        className = className+" highlight";
      }
      content.push(
        React.createElement("div", {className: className, key: i, onClick: this._onAction.bind(this,i)}, getString(msgButton[i].title))
      );
    }
    return(
          React.createElement("div", {className: "msgBox"}, 
            React.createElement("div", {className: "msgClass"}, 
              React.createElement("div", {className: "msgLabel"}, React.createElement("center", null, getString(msgLabel))), 
              React.createElement("div", {className: "msgBtnClass"}, 
                React.createElement("center", {className: "centerBox"}, content)
              )
            )
          )
        );
      }
    });
return Msg;
});
