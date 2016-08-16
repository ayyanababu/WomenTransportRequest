define(function(require){

  var requestItem = React.createClass ({
    onClick:function(){
      this.props.onItemClick(this.props.id);
    },
    render: function() {
      return(
        <div className="requestItem" onClick={this.onClick} id={this.props.id}>
            <div className = "requestItemDiv requesterName" >{this.props.data.employeeName}</div>
            <div className = "requestItemDiv requestDate" > {this.props.data.requestedDate}</div>
            <div className = "requestItemDiv requesterManager" >/{this.props.data.managerName}</div>
            <div className = "requestItemDiv requesterGroup" >PE/PS</div>
        </div>
      );
    }
  });

  return requestItem;

});
