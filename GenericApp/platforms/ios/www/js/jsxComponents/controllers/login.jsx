define(function (require) {
  var actions = require ("actions/loginActions");
  var Store = require ("stores/loginStore");
  var Loader = require("views/loader");
  var constants = require ("constants/loginConstants");
  var serverCall = require ("util/serverCall");

  var login = React.createClass({

    getInitialState:function()
    {
      return {msg:"",login:true}
    },
    componentDidMount: function () {
        Store.addChangeListener (constants.Login_Issued_Event,this._onChange);
        //this is for input navigations in form
        $('input').keydown( function(e) {
          var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
          if(key == 13) {
              e.preventDefault();
              var inputs = $('.loginscreen').find(':input:visible');

              if(inputs.index(this) === inputs.length-1)
              {
                $(this).blur();
              }else {
                inputs.eq( inputs.index(this)+ 1 ).focus();
              }

          }
        });

        $( "input" ).focus(function(e){
           $(".footer").hide();
        });

        $( "input" ).blur(function(e){
            $(".footer").show();
        });
      
    },
    componentWillUnmount: function () {
        Store.removeChangeListener (constants.Login_Issued_Event,this._onChange);
        var node = this.getDOMNode();
        $(node).find('input').unbind('keydown');
    },
    _onChange: function () {
        if(!Store.isUserLoggedIn())
        {
            var error = Store.getError();
            var msg = "login_failed";
            if(error == "network_failed")
            {
                msg = error;
            }

            msg = "* "+getString(msg);

            this.setState({msg:msg,login:true});
        }
    },
    loginButtonClicked: function () {
      var username = $("#userinfo").val();
      var pwd = $("#pwdinfo").val();

      if(!username || !pwd )
      {
          msg = "* "+getString("login_validation_field");
          this.setState({msg:msg,login:true});
          return;
      }
      this.setState({msg:"",login:false});
      var Obj = {
         username: username,
         password: pwd,
      }
      actions.doLogin(Obj);
  },

  render: function () {

    var loginButton = "";
    var filler = "";
    if(this.state.login)
      loginButton = <button className="loginbtn" onClick={this.loginButtonClicked}>{getString("login")}</button>
    else {
      loginButton = <div className="loginLoader" ><Loader /></div>
      filler = <div className="loginFiller" />
    }

    return(
      <div className= "gclass" id="loginscreen">
        <div className="loginContainer">
          <div className="loginField">
            <input id="userinfo" className="loginInput" type="text" name="username" placeholder={getString("user_id")}></input>
          </div>
          <div className="loginField">
            <input id="pwdinfo" className="loginInput" type="password" name="pwd" placeholder={getString("password")}></input>
          </div>
          <div className="errorMsg">{this.state.msg}</div>
          {loginButton}
        </div>
        <div className="footer">
          <div className="metricLogo">
            <div className="msfooter">{getString("powered_by")}</div>
            <img className="msLogo" src='img/metricstreamlogo.svg' alt='MetricStream'></img>
          </div>
          <div className="vfooter">{getString("version")}</div>
        </div>
        {filler}
      </div>
    );
    }
  });
  return login;
});
