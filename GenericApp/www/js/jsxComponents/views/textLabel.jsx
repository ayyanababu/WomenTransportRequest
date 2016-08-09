define(function(require){

  var textLabel = React.createClass({

    propTypes: {
        name: React.PropTypes.string.isRequired,
        isRequired: React.PropTypes.bool.isRequired
    },

    render: function(){
      var name = this.props.name;
      var classRequired = "hide";
      if(this.props.isRequired)
      {
        classRequired = "require";
      }

      return(
            <div className="lclass">
              <div className="label">{getString(name)}
                <span className={classRequired}>*</span>
              </div>
            </div>
          );
      }

  });

  return textLabel;

});
