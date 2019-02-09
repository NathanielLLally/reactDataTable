import React from "react";
import ReactDOM from "react-dom";
import { Component, PropTypes } from "react";

class Form extends Component {
  constructor(props){
    super(props);
    this.fields = [
      {name:'name', type:'input', subtype:'text', label:"First Name", icon:"user", validation:'name', required:true, validMessage:"3 or more characters", valid:false},
      {name:'email', type:'input', subtype:'email', icon:"envelope", validation:'email', label:"Email", required:true, validMessage:"Valid email", valid:false},
      {name:'message', type:'textarea', icon:"comment", validation:'message', label:"Your Message", required:false, validMessage:"3 or more characters", valid:false}
    ]
    this.validation={
      /*whatever regex rules you want. There's no reason to restrict validation to a regex but I'm laaaaazy.*/ 
      email:/[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*/,
      name:/[a-zA-Z0-9]{3,}/,
      message: /[a-zA-Z0-9]{3,}/,
    }
    this.state={};
    this.fields.map(field=>{
      this.state[field.name] = {content:false, valid:false}
    });
  }
  updateField(field, value, valid){
    var obj = {};
    obj[field] = {content:value, valid:valid};
    this.setState(obj);
  }
  validate(e){
    e.preventDefault();
    for(let i in this.state){
      if(!this.state[i].valid) return false;
    }
    console.log('all clear')
  }
  renderFields(){
    return this.fields.map(field=>{
      return <Field type={field.type} subtype={field.subtype} name={field.name} label={field.label} required={field.required} key={field.name} updateFunc={this.updateField.bind(this)} validation={this.validation[field.validation]} validMessage={field.validMessage} icon={field.icon} />
    })
  }
  render(){
    return(
      <form className="form" onSubmit={(e)=>{this.validate(e)}} noValidate>
        {this.renderFields()}
        <div className="container">
          <input className="" type="submit" value="Send" />
        </div>
      </form>
    )
  }
}

class Field extends Component {
  constructor(props){
    super(props);
    this.hasFocus = false;
    this.state={value: "", dirty:false, valid:false}
  }
  updateField(e){
    var valid = this.validate(e.target.value)
    this.setState({value: e.target.value, dirty:true, valid:valid});
    this.props.updateFunc(this.props.name, e.target.value, valid)
  }
  handleFocus(){
    this.setState({hasFocus:true});
  }
  handleBlur(){
    this.setState({hasFocus:false});
  }
  handleLabelClick(e){
    e.preventDefault();
    if(this.state.hasFocus) return false;
    this.refs.input.focus();
    this.setState({hasFocus: true})
  }
  validate(str){
    return str.match(this.props.validation);
  }
  render(){
    //Add-ons for the component
    const focusClass = this.state.value.length || this.state.hasFocus ? 'active' : "";
    const validClass = !this.state.dirty ? "" : this.state.valid ? "valid" : "invalid";
    const validMessage = this.props.validMessage ? <span className="valid-message">({this.props.validMessage})</span> : "";
    const label = this.props.label ? 
              <label htmlFor={this.props.name} onClick={(e)=>{this.handleLabelClick(e)}}>{this.props.label} {validMessage}</label> : "";
    const icon = !this.props.icon ? "" : this.state.valid ? <i className={`fa fa-thumbs-up`} /> : <i className={`fa fa-${this.props.icon}`} />;
    
    //component -- switch this to an HOC later
    switch(this.props.type){
      case 'input':
        return(
          <div className={`form-group ${focusClass}`}>
            <input ref="input" className={`form-control  ${validClass}`} name={this.props.name} id={this.props.name} type={this.props.subtype} required={this.props.required} value={this.state.value} onChange={(e)=>{this.updateField(e)}} onFocus={(e)=>{this.handleFocus()}} onBlur={(e)=>{this.handleBlur()}} />
            {icon}
            {label}
          </div>
        )
      case 'textarea':
        return (
          <div className={`form-group ${focusClass}`}>
            <textarea ref="input" className={`form-control  ${validClass}`} name={this.props.name} id={this.props.name} required={this.props.required} onChange={(e)=>{this.updateField(e)}} onFocus={(e)=>{this.handleFocus()}} onBlur={(e)=>{this.handleBlur()}}>{this.state.value}</textarea>
            {icon}
            {label}
          </div>
        )
      default:
        return <div>incomplete field</div>
    }  
  }
}

ReactDOM.render(<Form />, document.getElementById('root'));
