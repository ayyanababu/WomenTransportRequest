define(function(require){
  var NavigationActions = require ("actions/navigationActions");
  var NavigationStore = require ("stores/navigationStore");
  var NavigationConstants = require ("constants/navigationConstants");

  var requestDetailController = React.createClass ({
    componentDidMount: function () {
      NavigationStore.addChangeListener (NavigationConstants.Back_Click_Event,this._onLeftButtonClick);
    },

    componentWillUnmount: function () {
        NavigationStore.removeChangeListener (NavigationConstants.Back_Click_Event,this._onLeftButtonClick);
    },
    _onLeftButtonClick:function()
    {
      NavigationActions.popController();
    },
    onDisapprove:function(){
        this.props.disApprove(this.props.data);
        NavigationActions.popController();
    },
    onApprove:function()
    {
        this.props.approve(this.props.data);
        NavigationActions.popController();
    },
    render: function() {
      return(
        <div className="requestDetailView">
            <div className="requestDetailViewRow">
              <div className = "reqLabel">{getString("employeeName")}</div>
              <div className = "reqValue">{this.props.data.employeeName}</div>
            </div>
            <div className="requestDetailViewRow">
              <div className="requestDetailViewCol">
                <div className = "reqLabel">{getString("managerName")}</div>
                <div className = "reqValue">{this.props.data.managerName}</div>
              </div>
              <div className="requestDetailViewCol">
                <div className = "reqLabel">{getString("department")}</div>
                <div className = "reqValue">PE/PS</div>
              </div>
            </div>
            <div className="requestDetailViewRow">
              <div className="requestDetailViewCol">
                <div className = "reqLabel">{getString("date")}</div>
                <div className = "reqValue">{this.props.data.requestedDate}</div>
              </div>
              <div className="requestDetailViewCol">
                <div className = "reqLabel">{getString("requestedTime")}</div>
                <div className = "reqValue">{this.props.data.requestedTime}</div>
              </div>
            </div>
            <div className="requestDetailViewRow">
              <div className = "reqLabel">{getString("transportType")}</div>
              <div className = "reqValue">Company Transport</div>
            </div>
            <div className="requestDetailViewRow expandRow">
              <div className = "reqLabel">{getString("businessJustification")}</div>
              <div className = "reqValue">{this.props.data.businessJustification}</div>
            </div>
            <div className="requestDetailViewRow expandRow">
              <div className="requestDetailViewCol">
                <div className = "reqLabel">{getString("toAddress")}</div>
                <div className = "reqValue">{this.props.data.fromPlace}</div>
              </div>
            </div>

            <div className="requestDetailViewRow">
              <div className="requestDetailViewCol"  >
                  <div className="requestAccept" id="rejectBtn" onClick={this.onDisapprove}></div>
              </div>
              <div className="requestDetailViewCol" >
                <div className="requestAccept" id="acceptBtn"  onClick={this.onApprove}></div>
              </div>
            </div>
        </div>
      );
    }
  });

  return requestDetailController;

});
