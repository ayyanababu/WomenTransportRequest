define(function(require){
  var TextLabel = require("views/textLabel");
  var radioGroup = React.createClass({displayName: "radioGroup",

  propTypes: {
    name: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    isRequired: React.PropTypes.bool.isRequired,
    defaultchecked: React.PropTypes.string,
    options:React.PropTypes.array.isRequired,
    onSave: React.PropTypes.func.isRequired
  },
  _handleChange: function(event) {
    this.props.onSave(this.props.id, event.target.value);
    this.setState({ value: event.target.value})
  },
  getInitialState: function() {
    var val = this.props.defaultchecked;
    return { value: val};
  },
  componentWillReceiveProps:function(nextProps) {
      this.setState({value:nextProps.defaultchecked});
  },
  render:function(){
    var name = this.props.name;
    var array = this.props.options;
    var className = "radioClass";
    var content = [];

    for (var i = 0; i < array.length; i++) {

        if(array[i].key === this.state.value)
        {
          content.push(
              React.createElement("div", {className: className}, 
                React.createElement("label", {key: i}, 
                  React.createElement("input", {name: this.props.id, type: "radio", onChange: this._handleChange, value: array[i].key, checked: true}), 
                  array[i].value
                )
              )
          );
        }else {
          content.push(
              React.createElement("div", {className: className}, 
                React.createElement("label", {key: i}, 
                  React.createElement("input", {key: i, name: this.props.id, type: "radio", onChange: this._handleChange, value: array[i].key}), 
                  array[i].value
                )
              )
          );
        }
      }
    return(
      React.createElement("div", {className: "inputBox"}, 
        React.createElement(TextLabel, {name: this.props.name, isRequired: this.props.isRequired}), 
        React.createElement("div", {className: "radioGroup"}, 
          content
        )
      )
      );
    }
  });
return radioGroup;
});
