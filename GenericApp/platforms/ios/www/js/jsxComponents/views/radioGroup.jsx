define(function(require){
  var TextLabel = require("views/textLabel");
  var radioGroup = React.createClass({

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
              <div className={className}>
                <label key={i}>
                  <input name={this.props.id} type="radio" onChange={this._handleChange}  value={array[i].key} checked />
                  {array[i].value}
                </label>
              </div>
          );
        }else {
          content.push(
              <div className={className}>
                <label key={i}>
                  <input key={i} name={this.props.id} type="radio" onChange={this._handleChange} value={array[i].key} />
                  {array[i].value}
                </label>
              </div>
          );
        }
      }
    return(
      <div className="inputBox">
        <TextLabel name={this.props.name} isRequired={this.props.isRequired}/>
        <div className="radioGroup">
          {content}
        </div>
      </div>
      );
    }
  });
return radioGroup;
});
