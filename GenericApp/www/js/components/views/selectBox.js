define(function (require) {
  var TextLabel = require("views/textLabel");
  var selectBox = React.createClass({displayName: "selectBox",

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
        React.createElement("li", {className: "dlist", key: i}, dvalue[i].value)
        );
      }
    }
    return(
      React.createElement("div", {className: "inputBox"}, 
        React.createElement(TextLabel, {name: this.props.name, isRequired: this.props.isRequired}), 
        React.createElement("div", {className: "selectBox", onClick: this._onClick}, 
          React.createElement("div", {className: "dlistclass"}, 
            content
          ), 
        React.createElement("span", {className: "icon-Next", id: "arrow"})
        )
      )
    );
  }
  });
  return selectBox;
});
