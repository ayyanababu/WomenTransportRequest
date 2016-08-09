define (function (require) {
    var button = React.createClass ({displayName: "button",
        render: function () {
            return (
                React.createElement("div", {className: "buttonContainer"}, 
                  React.createElement("div", {className: "buttonName", onClick: this.props.click}, getString(this.props.name))
                )
            );
        }
    });
    return button;
});
