define(function (require) {
  var TextLabel = require("views/textLabel");
  var textBox = React.createClass({

    propTypes: {
      name: React.PropTypes.string.isRequired,
      id: React.PropTypes.string.isRequired,
      isRequired: React.PropTypes.bool.isRequired,
      defaultvalue:React.PropTypes.string,
      onSave: React.PropTypes.func.isRequired
    },

      getInitialState: function() {
        var val = this.props.defaultvalue;
        return { value: val};
      },
      componentWillReceiveProps:function(nextProps) {
          this.setState({value:nextProps.defaultvalue});
      },
      _handleChange: function(event) {
        this.setState({value: event.target.value});
      },
      _save: function(event) {
          this.props.onSave(this.props.id, event.target.value);
      },
      render: function() {
        var value = this.state.value;
        var className = "field";
        return (
              <div className="inputBox">
                <TextLabel name={this.props.name} isRequired={this.props.isRequired}/>
                <input className={className} maxLength="60" onChange={this._handleChange} onBlur={this._save} value={value}/>
              </div>
          );
      }
    });

  return textBox;
});
