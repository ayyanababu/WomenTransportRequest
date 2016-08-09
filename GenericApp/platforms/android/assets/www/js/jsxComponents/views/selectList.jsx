define(function(require) {
  var selectList = React.createClass({

  propTypes:{
    options: React.PropTypes.array.isRequired,
    defaultvalue: React.PropTypes.array,
    onSelected: React.PropTypes.func.isRequired,
    isSingle: React.PropTypes.bool.isRequired
  },

  getInitialState: function () {
    var mArray = this.props.defaultvalue;
    if(!mArray){
      mArray = [];
    }

    var options = this.props.options;
    options = options.sort(compare);

    return { temp: mArray, options:options};
  },
  checkMark: function(key,event) {
      if(this.props.isSingle)
      {
        this.props.onSelected(this.state.options[key]);
      }
      else{
        var flag = false;
        var tempArray = this.state.temp;
        for(var i=0; i<tempArray.length; i++){
          if(tempArray[i].key === this.state.options[key].key){
            flag = true;
            tempArray.splice(i,1);
            break;
          }
        }
        if(!flag)
        {
          tempArray.push(this.state.options[key]);
        }

        this.props.onSelected(tempArray);
        this.setState({temp:tempArray});
      }
  },

  searchText: function () {
    var text = $("#searchid").val().toLowerCase();
    var searcharray = [];
    for(var i=0;i<this.props.options.length;i++){
      if(this.props.options[i].value.toLowerCase().indexOf(text)>=0){
          searcharray.push(this.props.options[i]);
      }
    }
    if(text.length === 0){
      searcharray = this.props.options;
    }
    this.setState({options:searcharray});

 },

  getContents: function () {
    var option = this.state.options;
    var value = [];
    for (var i = 0; i < option.length; i++){
      var className = "tick hide";
      var tempArray = this.state.temp;
      var flag = false;
      for(var j=0; j<tempArray.length; j++){
        if(tempArray[j].key === option[i].key){
          flag = true;
          break;
        }
      }
      if(flag)
      {
        className = "tick"
      }
      value.push(
        <div className="list" key={i} onClick={this.checkMark.bind(this,i)}>
          <div className = "listtitle"> {option[i].value}</div>
          <div className={className} >&#10003;</div>
        </div>
        );
      }
      return value;
    },

  render: function () {
    var className = "searchbox";
    return(
      <div className="gclass listContainer">
        <input className={className} id="searchid" type="search" placeholder="Search" onChange={this.searchText}/>
      {this.getContents()}
      </div>
      );
    }
  });
  return selectList;

  function compare(a,b) {
    if (a.value < b.value)
      return -1;
    else if (a.value > b.value)
      return 1;
    else
      return 0;
  }

});
