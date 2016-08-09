define(function (require) {

    var SubmitButton = React.createClass ({

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
                <div className="submit_container">
                  <button className={submitButtonCss} onClick={this.onSubmitButtonClick}>&#10003;</button>
                </div>
            );
        }
    });
    return SubmitButton;
});
