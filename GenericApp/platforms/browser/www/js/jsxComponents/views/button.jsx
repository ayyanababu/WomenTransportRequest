define (function (require) {
    var button = React.createClass ({
        render: function () {
            return (
                <div className="buttonContainer">
                  <div className="buttonName" onClick={this.props.click}>{getString(this.props.name)}</div>
                </div>
            );
        }
    });
    return button;
});
