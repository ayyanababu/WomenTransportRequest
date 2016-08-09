define(function () {
    var header = React.createClass({displayName: "header",
        render: function () {
            return (
                React.createElement("div", {className: "headerContainer"}, 
                    React.createElement("div", {className: "title"}, 
                        getString(this.props.name)
                    )
                )
            );
        }
    });
    return header;
});
