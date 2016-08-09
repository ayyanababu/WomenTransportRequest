define(function(require){
  var TextLabel = require("views/textLabel");
  var checkGroup = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    isRequired: React.PropTypes.bool.isRequired,
    defaultchecked: React.PropTypes.array,
    options:React.PropTypes.array.isRequired,
    onSave: React.PropTypes.func.isRequired
  },
  getInitialState: function () {
      var mArray = this.props.defaultvalue;
      if(!mArray){
        mArray = [];
      }
      return { selected:mArray};
  },
  componentWillReceiveProps:function(nextProps) {
      var mArray = this.props.defaultvalue;
      if(!mArray){
        mArray = [];
      }
      this.setState({ selected:mArray});;
  },
  _handleChange: function(key,event) {
      var tempArray = this.state.selected;
      var index = parseInt(key);
      var flag = false;
      for(var i=0; i<tempArray.length; i++){
        if(tempArray[i].key === this.props.options[index].key){
            flag = true;
            tempArray.splice(i,1);
            break;
        }
      }
      if(!flag)
      {
        tempArray.push(this.props.options[index]);
      }

      this.props.onSelected(tempArray);
      this.setState({temp:tempArray});
  },

  getContents: function(){
    var array = this.props.options;
    var className = "radiogroup";
    var content = [];

    for (var i = 0; i < array.length; i++) {
        var check = this.state.selected;
        var flag = false;
        for(var j = 0; j< check.length; j++){
          if(array[i].key === check[j].key){
            flag = true;
            break;
          }
        }
        if(flag)
        {
            content.push(
                <input key={i} className={className} name={this.props.id} type="checkbox" onChange={this._handleChange} value={i} checked>{array[i].value}</input>
            );
          }
          else {
              content.push(
                  <input key={i} className={className} name={this.props.id} type="checkbox" onChange={this._handleChange} value={i}>{array[i].value}</input>
            );
        }
      }

      return content;
  },


  render:function(){
    var name = this.props.name;
    return(
      <div className="inputBox">
        <TextLabel name={this.props.name} isRequired={this.props.isRequired}/>
          {this.getContents()}
      </div>
      );
    }
  });
return checkGroup;
});
