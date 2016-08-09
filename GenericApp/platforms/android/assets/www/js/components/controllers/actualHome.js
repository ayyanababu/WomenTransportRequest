define(function(require){

  var Store = require('stores/homeStore');

var actualhome = React.createClass({displayName: "actualhome",

  getContent: function () {
   var contentItems = Store.getActualInjuryFormItems();
   var content = [];
   for (var i=0;i<contentItems.length;i++){
     var eachItem = contentItems[i];
     var className = "actualItem";
     var iconClass = "actualIcon icon-"+eachItem;
     content.push
     (
       React.createElement("div", {key: i, className: className}, 
         React.createElement("div", {className: iconClass}, " "), 
         React.createElement("div", {className: "actualName"}, getString(eachItem))
       )
     );
   }
   return content;
},

  render: function(){

    var content = this.getContent();
    return(
      React.createElement("div", {className: "gclass"}, 
        React.createElement("div", {className: "navigationBar"}, 
          React.createElement("div", {className: "headerContainer"}, 
            React.createElement("div", {className: "title"}, "Actual Injury")
          )
        ), 
        React.createElement("div", {className: "actualcontroller"}, 
         content
        )
      )
    );

  }
});
return actualhome;
});
