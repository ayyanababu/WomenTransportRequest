define(function(require){
  var Form = require ("controllers/form");
  var Store = require ("stores/formStore");
  var NavigationStore = require ("stores/navigationStore");
  var Msg = require("views/msgBox");
  var NavigationActions = require ("actions/navigationActions");

  var tag = "Injury ";

  var MultiRow = React.createClass({

    getInitialState: function(){
      if(this.props.childId !== "PSD")
      {
          tag = "Damage ";
      }
      else
      {
          tag = "Injury "
      }
      var formsData = Store.getData();
      var content = formsData[this.props.id].data.content;
      var array = [tag+1];

      if(this.props.childId)
      {
          var obj = content[this.props.childId];

          for(var i=1;i<obj.length;i++)
          {
              array.push(tag+(i+1));
          }
      }

      var state = NavigationStore.getControllerState();
      var activeTab = 0;

      if(state && state.activeTab)
      {
          activeTab = state.activeTab
      }

      return { activeTab:activeTab,tabsArray:array};
    },

    _onButtonSelect: function (index) {
      this.setState({ activeTab:index,tabsArray:this.state.tabsArray});
    },

    addNewTab:function(e){
      e.stopPropagation();

      var formsData = Store.getData();
      var content = formsData[this.props.id].data.content;
      var childContents = formsData[this.props.id].childContents;

      if(this.props.childId)
      {
          var obj = childContents[this.props.childId];
          var copied = jQuery.extend(true, {}, obj);
          content[this.props.childId].push(copied);
      }

      var noofTabsinScreen = this.state.tabsArray.length+1;
      var row = tag+noofTabsinScreen

      var array = this.state.tabsArray;
      array.push(row);

      this.setState({ activeTab:array.length-1,tabsArray:array});
    },

    onCancelButton:function(index,e){
      e.stopPropagation();
      var formsData = Store.getData();
      var content = formsData[this.props.id].data.content;
      var that = this;
      var onDeleteRow = function(title){
        if(title === "yes")
        {
          NavigationActions.removePopup();
          if(that.props.childId)
          {
              var obj = content[that.props.childId];
              obj.splice(index,1);
          }

          var array = that.state.tabsArray;
          array.splice(index,1);

          var activeTab = that.state.activeTab
          if(that.state.activeTab==index)
          {
              activeTab = 0;
          }
          that.setState({ activeTab:activeTab,tabsArray:array});
        }
        else if(title === "no")
        {
          NavigationActions.removePopup();
        }
      }
      var msgButtonsArray = [{"title":"yes"},{"title":"no"}];
      NavigationActions.presentPopup(<Msg msgLabel={"delete_multirow"} buttons={msgButtonsArray} onMsgClick={onDeleteRow}/>);
    },

    render: function(){
      var divsToArrange = [];
      var length = this.state.tabsArray.length;
      for(var i=0;i<length;i++){
          var cssName = "tab unselected";

          if(this.state.activeTab == i){
            cssName = "tab selected";
          }

          var crossDiv = <div className="closediv"  onClick={this.onCancelButton.bind(this,i)}>✕</div>;

          if(i==0)
          {
            crossDiv="";
          }
          divsToArrange.push(
            <div  className={cssName} key={i} onClick={this._onButtonSelect.bind(this,i)}>
              <div>{this.state.tabsArray[i]}</div>
              {crossDiv}
            </div>
          );
        }

      var plus_tab;
      if(length<2)
        plus_tab = <div className="plus_tab" onClick={this.addNewTab}>+</div>;

      return(
        <div className="container">
          <div className="tab_container">
            {divsToArrange}
            {plus_tab}
          </div>
          <Form id={this.props.id} childId={this.props.childId} rowId={this.state.activeTab}/>
        </div>

      );
    }

  });
  return MultiRow;
});
