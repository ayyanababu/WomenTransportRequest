define (function (require) {
    var loader = React.createClass ({
        render: function () {
            return (
              <div className="loader">
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
                <div className="circle4"></div>
              </div>
            );
        }
    });
    return loader;
});
