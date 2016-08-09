define(function(require){
  var TextLabel = require("views/textLabel");
  var NavigationActions = require ("actions/navigationActions");
  var Msg = require("views/msgBox");
  var  Calendar = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    isRequired: React.PropTypes.bool.isRequired,
    defaultdate:React.PropTypes.string,
    defaulttime:React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired
  },

  getInitialState: function(){

    return ({date:this.props.defaultdate,time:this.props.defaulttime,isVisible:true});
  },

  componentDidMount: function () {

    var date = Moment(this.props.defaultdate,"YYYY-MM-DD").format("M/DD/YYYY");
    var time = Moment(this.props.defaulttime, 'HH:mm').format('HH:mm:ss');
    this.props.onSave(this.props.id,date+" "+time);
  },
  componentWillReceiveProps:function(nextProps) {
      this.setState({date:nextProps.defaultdate,time:nextProps.defaulttime});
  },
  validateDateAndTime: function(date,time){
    var currentDate = Moment().format("YYYY-MM-DD HH:mm");
    if(date != "" && time != "" && Moment(currentDate).isAfter(date+" "+time))
    {
        var dateValue = Moment(date,"YYYY-MM-DD").format("M/DD/YYYY");
        var timeValue = Moment(time, 'HH:mm').format('HH:mm:ss');
        this.props.onSave(this.props.id,dateValue+" "+timeValue);
        this.setState({date:date,time:time,isVisible:true});

    }else {
        var msgButton = [{"title":"ok"}];
        //Not resetting to current date
        var dateValue = Moment().format("YYYY-MM-DD");
        var timeValue = Moment().format("HH:mm");
        this.setState({date:dateValue,time:timeValue,isVisible:false});

        var dateAndTime =  Moment().format("M/DD/YYYY HH:mm:ss");
        this.props.onSave(this.props.id,dateAndTime);

        var msgLabel = "future_date"
        if(date === "" || time === "")
        {
            msgLabel = "invalid_date"
        }
        NavigationActions.presentPopup(<Msg msgLabel={msgLabel} buttons={msgButton} onMsgClick={this._onCancel}/>);

    }

  },

  _handleDate: function(event){
      var dateValue = event.target.value;
      this.validateDateAndTime(dateValue,this.state.time);
  },
  _handleTime: function(event){
      var timeValue = event.target.value;
      this.validateDateAndTime(this.state.date,timeValue);
  },

 _onCancel: function(){
    NavigationActions.removePopup();
    this.setState({date:this.state.date,time:this.state.time,isVisible:true});
 },
  render: function() {
    var name = this.props.name;
    var className = "cfield";
    var time = this.state.time;
    var date = this.state.date

    var keyDate = "date";
    var keyTime = "time"
    if(!this.state.isVisible)
    {
        keyDate = "datehide"
        keyTime = "timehide"
    }
    return(
      <div className="inputBox">
        <TextLabel name={this.props.name} isRequired={this.props.isRequired}/>
        <input type="date"  key= {keyDate} className={className+" date"+" icon-Calender"} id="cdate" onChange={this._handleDate} defaultValue={date}  />
        <input type="time" key={keyTime} className={className+" time"+" icon-Clock-01"} id="ctime" onChange={this._handleTime} defaultValue={time} />
      </div>
      );
    }
  });
return Calendar;
});
