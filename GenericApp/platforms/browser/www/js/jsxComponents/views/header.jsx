define(function () {
    var header = React.createClass({
        render: function () {
            return (
                <div className="headerContainer">
                    <div className="title">
                        {getString(this.props.name)}
                    </div>
                </div>
            );
        }
    });
    return header;
});
