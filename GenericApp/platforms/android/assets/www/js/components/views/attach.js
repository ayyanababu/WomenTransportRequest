define(function (require) {
  var NavigationActions = require ("actions/navigationActions");
  var TextLabel = require("views/textLabel");
  var serverCall = require ("util/serverCall");
  var Msg = require("views/msgBox");

  var AttachBox = React.createClass({displayName: "AttachBox",

    propTypes: {
      onSuccess: React.PropTypes.func.isRequired,
      onFail: React.PropTypes.func.isRequired,
      onCancel: React.PropTypes.func.isRequired
    },

    _capturePhoto: function() {
      // Take picture using device camera and retrieve image as base64-encoded string
       navigator.camera.getPicture(this.props.onSuccess, this.props.onFail, { quality: 45,
         destinationType: navigator.camera.DestinationType.FILE_URI,encodingType: Camera.EncodingType.JPEG,
         cameraDirection:navigator.camera.Direction.BACK,correctOrientation: true});
    },
    _uploadPhoto: function() {
       navigator.camera.getPicture(this.props.onSuccess, this.props.onFail, { quality: 45,
          destinationType: navigator.camera.DestinationType.FILE_URI,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,correctOrientation: true});
    },

    render: function(){
      return(
              React.createElement("div", {className: "attachbox"}, 
                React.createElement("div", {className: "cancel", onClick: this.props.onCancel}, 
                  React.createElement("div", {className: "cross"}, "✕")
                ), 
                React.createElement("div", {className: "capture", onClick: this._capturePhoto}, 
                   React.createElement("div", {className: "attachicon icon-Capture"}), 
                   React.createElement("div", {className: "attachtext"}, getString("capture"))
                ), 
                React.createElement("div", {className: "divider"}), 
                React.createElement("div", {className: "capture", onClick: this._uploadPhoto}, 
                   React.createElement("div", {className: "attachicon icon-Picture"}), 
                   React.createElement("div", {className: "attachtext"}, getString("upload"))
                )
              )
            );
        }
  });
  var attach = React.createClass({displayName: "attach",
    propTypes: {
      name: React.PropTypes.string.isRequired,
      isRequired: React.PropTypes.bool.isRequired,
      id: React.PropTypes.string.isRequired,
      defaultvalue:React.PropTypes.array,
      onSave: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
      var defaultAttachment = [];
      if(this.props.defaultvalue)
      {
        defaultAttachment = this.props.defaultvalue;
      }
      return {images:defaultAttachment};
    },

    _onAttach: function() {
      NavigationActions.presentPopup(React.createElement(AttachBox, {onSuccess: this._onSuccess, onFail: this._onFail, onCancel: this._onCancel}));
      this.setState({images:this.state.images});
    },

    _onCancel: function() {
      NavigationActions.removePopup();
    },

    _onSuccess: function(imgURI) {
       NavigationActions.removePopup();
       var array = this.state.images;
       array.push({"key":imgURI});
       if(this.props.onSave)
       {
         this.props.onSave(this.props.id,array);
       }

       this.setState({fadevalue:false,images:array});
    },

    _onFail: function(msg) {
      NavigationActions.removePopup();
      var msgButtonsArray = [{"title":"ok"}];
      var onDeleteAttachment = function(title)
      {
          NavigationActions.removePopup();
      }
      this.setState({images:this.state.images});
      NavigationActions.presentPopup(React.createElement(Msg, {msgLabel: "failed_attachment", buttons: msgButtonsArray, onMsgClick: onDeleteAttachment}));
    },

    _onDelete: function(key){
      var msgButtonsArray = [{"title":"yes"},{"title":"no"}];
      var that = this;
      var onDeleteAttachment = function(title)
      {
          NavigationActions.removePopup();
          if(title==="yes")
          {
              var array = that.state.images;
              array.splice(key,1);
              if(that.props.onSave)
              {
                that.props.onSave(that.props.id,array);
              }

              that.setState({images:array});
          }
      }
      NavigationActions.presentPopup(React.createElement(Msg, {msgLabel: "delete_attachment", buttons: msgButtonsArray, onMsgClick: onDeleteAttachment}));
    },
    render: function() {
      var divsToAttach=[];
      for(var i=0;i<this.state.images.length;i++)
      {
        var srctoimage = this.state.images[i].key;
        divsToAttach.push(
            React.createElement("img", {className: "attachimg", key: i, id: "uploadimg", src: srctoimage, onClick: this._onDelete.bind(this,i)})
        );
      }
      return(
         React.createElement("div", {className: "attachment"}, 
          React.createElement(TextLabel, {name: this.props.name, isRequired: this.props.isRequired}), 
          React.createElement("div", {className: "attachmentholder"}, 
            divsToAttach, 
            React.createElement("div", {className: "attach icon-Picture", onClick: this._onAttach})
        )
      )
        );
      }
    });
  return attach;
});
