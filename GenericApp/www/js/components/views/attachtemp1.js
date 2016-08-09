define(function (require) {

  var attach = React.createClass({displayName: "attach",

    getInitialState: function() {
      return { fadevalue: false, isPhotoSelected:false};
    },

  _onAttach: function() {
    this.setState({fadevalue: true});
  },

  _onCancel: function() {
    this.setState({fadevalue: false});
  },


  _capturePhoto: function() {
    // Take picture using device camera and retrieve image as base64-encoded string
     navigator.camera.getPicture(this.onSuccess, this.onFail, { quality: 50,
       destinationType: navigator.camera.DestinationType.DATA_URL,
       cameraDirection:navigator.camera.Direction.BACK});
  },

  onSuccess: function(imgData) {
    //onSuccess
    console.log("Capture success");
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = "data:image/jpeg;base64," + imageData;
    this.setState({isPhotoSelected:true});
  },

  _uploadPhoto: function() {
     navigator.camera.getPicture(this.onPhotoURISuccess, this.onFail, { quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY});
    console.log("upload photo is clicked");
  },

  onPhotoURISuccess: function(imageURI) {
    //onSuccess
    console.log("Album success");
    var largeImage = document.getElementById('largeImage');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
    this.setState({isPhotoSelected:true});
  },

  onFail: function(msg) {
    console.log("Failed because: " + msg);
    this.setState({isPhotoSelected:false});
  },

  render: function() {
    var fade = this.state.fadevalue;
    var classname = "filler hide";
    var classname2 = "hide"
    var isPhoto = this.state.isPhotoSelected;
    if(fade){
      classname = "filler";
    }
    if(isPhoto){
      classname = "filler hide";
      classname2 = "sample";
    }

  return(
    React.createElement("div", {className: "attachment"}, 
     React.createElement("span", {className: "label"}, "Attachments"), 
     React.createElement("div", {className: "attach icon-Add", onClick: this._onAttach}), 
     React.createElement("div", {className: classname2}, 
      React.createElement("img", {id: "largeImage", src: ""}), 
      React.createElement("img", {id: "smallImage", src: ""})
     ), 
     React.createElement("div", {className: classname}, 
      React.createElement("div", {className: "attachbox"}, 
        React.createElement("div", {className: "cancel", onClick: this._onCancel}, "✕"), 
        React.createElement("div", {className: "capture", onClick: this._capturePhoto}, 
          React.createElement("div", {className: "attachicon import-Capture"}), 
          React.createElement("div", {className: "attachtext"}, "Capture Document")
        ), 
        React.createElement("div", {className: "divider"}), 
        React.createElement("div", {className: "capture", onClick: this._uploadPhoto}, 
          React.createElement("div", {className: "attachicon import-Picture"}), 
          React.createElement("div", {className: "attachtext"}, "Upload Picture")
        )
      )
     )
   )
      );
    }
  });
  return attach;
});
