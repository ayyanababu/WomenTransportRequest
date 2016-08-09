define(function(require) {

  var NavigationStore = require("stores/navigationStore");
  var NavigationActions = require ("actions/navigationActions");
  var NavigationConstants = require ("constants/navigationConstants");

  var SelectList = require('views/selectList');
  var Button = require('views/button');
  var selectedArray;
  var select = React.createClass ({

    propTypes:{
        id: React.PropTypes.string.isRequired,
        options: React.PropTypes.array.isRequired,
        defaultvalues: React.PropTypes.array.isRequired,
        isSingleSelect: React.PropTypes.bool.isRequired,
        onSave: React.PropTypes.func.isRequired
    },
    componentDidMount: function () {
        NavigationStore.addChangeListener (NavigationConstants.Right_Click_Event,this._onRightButtonClick);
        NavigationStore.addChangeListener (NavigationConstants.Back_Click_Event,this._onBackButtonClick);
    },
    componentWillUnmount: function () {
        NavigationStore.removeChangeListener (NavigationConstants.Right_Click_Event,this._onRightButtonClick);
        NavigationStore.removeChangeListener (NavigationConstants.Back_Click_Event,this._onBackButtonClick);
    },
    _onRightButtonClick:function()
    {
        if(!this.props.isSingleSelect)
        {
          this.props.onSave(this.props.id,selectedArray);
        }
        NavigationActions.popController();
    },
    _onBackButtonClick:function()
    {
      NavigationActions.popController();
    },
    selectedValue: function(selvalue){
        if(this.props.isSingleSelect)
        {
          this.props.onSave(this.props.id,selvalue);
          NavigationActions.popController();
        }
        else {
          selectedArray = selvalue;
        }

    },
    render: function() {
        return(
          <SelectList options={this.props.options} defaultvalue={this.props.defaultvalues} onSelected={this.selectedValue} isSingle={this.props.isSingleSelect}/>
          );
    }
  });

  return select;
});
