define(function(require){

  var Msg = React.createClass({

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
        <div className={className} key={i} onClick={this._onAction.bind(this,i)}>{getString(msgButton[i].title)}</div>
      );
    }
    return(
          <div className="msgBox">
            <div className="msgClass">
              <div className="msgLabel"><center>{getString(msgLabel)}</center></div>
              <div className="msgBtnClass">
                <center className="centerBox">{content}</center>
              </div>
            </div>
          </div>
        );
      }
    });
return Msg;
});
