define (function (require) {
    var swipeManager;
    var bar = React.createClass ({displayName: "bar",
        getInitialState:function()
        {
          return ({hide:true,key:0});
        },
        componentWillUnmount:function()
        {
          if(swipeManager)
          {
              swipeManager.destroy();
          }
        },
        componentDidMount:function()
        {
          var element = document.getElementById("home_swiper");

          if(element)
          {
            swipeManager = new Hammer.Manager(element);
            swipeManager.add(new Hammer.Swipe({threshold:0.05,velocity:0.05,direction:Hammer.DIRECTION_ALL}));
            swipeManager.on("swipe", this._onSwipe);
            swipeManager.on("dragleft dragright", function(ev){ ev.gesture.preventDefault(); })
          }
        },
        _onClick: function (key) {
            this.props.data.onMenuItemClick(key);
            this._onMenuToggle(key);
        },
        _onSwipe:function()
        {
            this._onMenuToggle(this.state.key);
        },
        _onFillerClick:function()
        {
            this._onMenuToggle(this.state.key);
        },
        _onMenuToggle:function(key)
        {
            this.setState({hide:!this.state.hide,key:key});
        },
        getContent:function(){

            var that =this;
            var currentItem = this.state.key;
            var content = this.props.data.items.map(function(name,i)
            {
              var className= "actionBarItem";

              if(currentItem===i)
              {
                className= "actionBarItem highlight"
              }
              var iconClass = "actionBarIcon icon-"+name;
              return (React.createElement("div", {key: i, className: className, onClick: that._onClick.bind(that, i)}, 
                  React.createElement("div", {className: iconClass}), 
                  React.createElement("div", {className: "actionBarName"}, getString(name))
              ))
            });

            return content;
        },

        render: function () {
            var content = this.getContent();

            var className = "actionBarContainer actionBarHide";
            var fillerClass = "filler hide";

            if(!this.state.hide)
            {
                className = "actionBarContainer";
                fillerClass = "filler";
            }

            return (
              React.createElement("div", null, 
                  React.createElement("div", {className: className}, 
                      content
                  ), 
                  React.createElement("div", {id: "filler", className: fillerClass, onClick: this._onFillerClick}), 
                  React.createElement("div", {id: "home_swiper", className: "actionBarContainer"})
              )
            );
        }
    });
    return bar;
});
