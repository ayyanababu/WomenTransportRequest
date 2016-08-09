define(function (require) {
  var TextLabel = require("views/textLabel");
  var selectBox = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    isRequired: React.PropTypes.bool.isRequired,
    onSelectBoxClick: React.PropTypes.func.isRequired,
    defaultvalues: React.PropTypes.array
  },

  _onClick:function()
  {
      this.props.onSelectBoxClick(this.props.id,this.props.defaultvalue);
  },
  render: function () {
    var name = this.props.name;
    var dvalue = this.props.defaultvalues;
    var content = [];
    if(dvalue)
    {
      for(var i = 0; i < dvalue.length; i++){
        content.push(
        <li className="dlist" key={i}>{dvalue[i].value}</li>
        );
      }
    }
    return(
      <div className="inputBox">
        <TextLabel name={this.props.name} isRequired={this.props.isRequired}/>
        <div className="selectBox" onClick={this._onClick}>
          <div className="dlistclass">
            {content}
          </div>
        <span className="icon-Next" id="arrow"></span>
        </div>
      </div>
    );
  }
  });
  return selectBox;
});
