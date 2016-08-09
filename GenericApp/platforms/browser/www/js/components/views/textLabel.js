define(function(require){

  var textLabel = React.createClass({displayName: "textLabel",

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
            React.createElement("div", {className: "lclass"}, 
              React.createElement("div", {className: "label"}, getString(name), 
                React.createElement("span", {className: classRequired}, "*")
              )
            )
          );
      }

  });

  return textLabel;

});
