define (function (require) {
    var loader = React.createClass ({displayName: "loader",
        render: function () {
            return (
              React.createElement("div", {className: "loader"}, 
                React.createElement("div", {className: "circle1"}), 
                React.createElement("div", {className: "circle2"}), 
                React.createElement("div", {className: "circle3"}), 
                React.createElement("div", {className: "circle4"})
              )
            );
        }
    });
    return loader;
});
