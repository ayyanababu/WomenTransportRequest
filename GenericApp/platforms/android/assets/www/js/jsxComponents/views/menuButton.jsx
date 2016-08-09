define (function (require) {
    var menuButton = React.createClass ({
        render: function () {
            var className = "menuBtContainer"
            var titleClass = "menuBtTitle"
            if("right"===this.props.align)
            {
                className="menuBtContainer right"
                titleClass = "menuBtTitle titleRight"
            }
            var id="";
            if("Submit"===this.props.name){
                titleClass = titleClass+" icon-Save";
                id= "submit";
            }else if("Back"===this.props.name){
              titleClass = titleClass+" icon-Back";
              id= "submit";
            }else if("Next"===this.props.name){
              titleClass = titleClass+" icon-Next";
              id= "submit";
            }else if("Logout" ===this.props.name){
              titleClass = titleClass+" icon-Menu7";
              id = "logout";
            }
            return (
                <div className={className} onClick={this.props.onClick}>
                    <div className={titleClass} id={id}></div>
                </div>
            );
        }
    });
    return menuButton;
});
