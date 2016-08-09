define(function (require) {

    var SubmitButton = React.createClass ({displayName: "SubmitButton",

      getInitialState: function(){
          return{
            submitButton: true
          }
      },
        onSubmitButtonClick: function (event) {
            this.setState({submitButton: (this.state.submitButton)?false:true});
        },


        render: function () {

           if (this.state.submitButton){
              submitButtonCss = "submit_btn green_background";
           }else{
             submitButtonCss = "submit_btn high_grey_background";
           }

            return (
                React.createElement("div", {className: "submit_container"}, 
                  React.createElement("button", {className: submitButtonCss, onClick: this.onSubmitButtonClick}, "✓")
                )
            );
        }
    });
    return SubmitButton;
});
