define(function(require){

  var label = React.createClass({displayName: "label",

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

    return
        (
          React.createElement("div", {className: "lclass"}, 
            React.createElement("div", {className: "label"}, getString(name)), 
            React.createElement("div", {className: classRequired}, "*")
          )
        );
      }
    });
  return label;
  });
