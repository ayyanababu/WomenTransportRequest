define(function(require){

  var TextArea = require('views/textareaBox');
  var ToggleButton =  require ("views/toggleButton");
  var SelectBox = require ("views/selectBox");
  var feedback = React.createClass({displayName: "feedback",

  render: function () {
    React.createElement("div", null, 
      React.createElement(TextArea, null), 
      React.createElement(SelectBox, null), 
      React.createElement(ToggleButton, null)
    )
  }
  });
});
