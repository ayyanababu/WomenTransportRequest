define(function (require) {
  var TextLabel = require("views/textLabel");
  var ToggleButton = React.createClass ({

      propTypes: {
        name: React.PropTypes.string.isRequired,
        isRequired: React.PropTypes.bool.isRequired,
        options: React.PropTypes.array,
        id: React.PropTypes.string.isRequired,
        onSave: React.PropTypes.func.isRequired,
        defaultvalue:React.PropTypes.string
      },

        onToggleButtonSegmentClick: function (event) {
            var toggleButton = (this.state.selectedbutton === 1)?2:1;
            this.setState({selectedbutton: toggleButton});
            this.props.onSave(this.props.id,this.props.options[toggleButton-1].key);
        },

        getInitialState: function(){
            var index =1;
            if(this.props.defaultvalue && this.props.defaultvalue !== "" && this.props.options )
            {
                for(var i=0;i<this.props.options.length;i++)
                {
                    if(this.props.defaultvalue === this.props.options[i].key )
                    {
                        index = i+1;
                        break;
                    }
                }
            }else
            {
              this.props.onSave(this.props.id,this.props.options[0].key);
            }

            return{
              selectedbutton: index

            }
        },
        componentWillReceiveProps:function(nextProps) {
            var index =1;
            if(nextProps.defaultvalue && nextProps.defaultvalue !== "" && nextProps.options )
            {
                for(var i=0;i<nextProps.options.length;i++)
                {
                    if(nextProps.defaultvalue === nextProps.options[i].key )
                    {
                        index = i+1;
                        break;
                    }
                }
            }else
            {
              this.props.onSave(nextProps.id,nextProps.options[0].key);
            }

            this.setState({selectedbutton:index});

        },
        render: function () {

           var firstButtonClassName = " ";
           var secondButtonClassName = " ";
           if(this.state.selectedbutton === 1){
              firstButtonClassName = "toggle_first_segment toggleBtn_active";
              secondButtonClassName = "toggle_second_segment";
           }else{
              firstButtonClassName = "toggle_first_segment";
              secondButtonClassName = "toggle_second_segment toggleBtn_active";
           }

            return (
                <div className="inputBox">
                  <TextLabel name={this.props.name} isRequired={this.props.isRequired}/>
                  <div className="toggle_button_container">
                    <button className={firstButtonClassName} onClick={this.onToggleButtonSegmentClick}>{(this.props.options.length >= 2) ? this.props.options[0].value : "YES"}</button>
                    <button className={secondButtonClassName} onClick={this.onToggleButtonSegmentClick}>{(this.props.options.length >= 2) ? this.props.options[1].value : "NO"}</button>
                  </div>
                </div>
            );
        }
    });
    return ToggleButton;
});
