import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";

import JSONTree from 'react-json-tree';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const JSONtheme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
}

class Field extends React.Component {
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
    if (this.props.validation != null)
      return str.match(this.props.validation);
    return false;
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
          <td className={`form-group ${focusClass}`} valign="top">
            <div>{label}</div>
            <input ref="input" className={`form-control  ${validClass}`} name={this.props.name} id={this.props.name} type={this.props.subtype} required={this.props.required} value={this.state.value} onChange={(e)=>{this.updateField(e)}} onFocus={(e)=>{this.handleFocus()}} onBlur={(e)=>{this.handleBlur()}} />
            {icon}
          </td>
        )
      case 'textarea':
        return (
          <td className={`form-group ${focusClass}`} align="top">
            <div>{label}</div>
            <textarea ref="input" className={`form-control  ${validClass}`} name={this.props.name} id={this.props.name} required={this.props.required} onChange={(e)=>{this.updateField(e)}} onFocus={(e)=>{this.handleFocus()}} onBlur={(e)=>{this.handleBlur()}}>{this.state.value}</textarea>
            {icon}
          </td>
        )
      default:
        return <td>incomplete field</td>
    }  
  }
}


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.fields = [
    {name:'keywords', type:'input', subtype:'text', label:"Keywords", icon:"user", validation:'name', required:true, validMessage:"", valid:false},
    {name:'minprice', type:'input', subtype:'text', label:"Min Price", icon:"user", validation:'number', required:false, validMessage:"", valid:false, value:0},
    {name:'maxprice', type:'input', subtype:'text', label:"Max Price", icon:"user", validation:'number', required:false, validMessage:"", valid:false, value:100},
    ]
        this.validation={
      /*whatever regex rules you want. There's no reason to restrict validation to a regex but I'm laaaaazy.*/ 
      email:/[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*/,
      name:/[a-zA-Z0-9]{3,}/,
      message:/.?/,
      number:/\d+/
    }
    this.state = makeDefaultState()
    this.fields.map(field=>{
      this.state[field.name] = {content:false, valid:false}
    });
  }
    
  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    console.log(this.fields);
    console.log(event);
    let p = {};
    p = Object.keys(this.state).filter(k => this.state[k].valid);
    let params = {}
    p.map( k => params[k] = event.target[k].value);
    params.rows = this.state.pageSize
    params.page = this.state.page
//    event.target.keywords.value;
    console.log(params);
    this.props.handleSubmit(params);
  };
  updateField(field, value, valid){
    var obj = {};
    obj[field] = {content:value, valid:valid};
    this.setState(obj);
  }
  validate(e){
    e.preventDefault();
    for(let i in this.state){
     if (this.fields[i] != null)
        if(!this.state[i].valid && this.fields[i].required) return false;
//        if(!this.state[i].valid) return false;
    }
    console.log('all clear')
    return true;
  }
  componentDidMount() {
    console.log('App componentDidMount')
  }
  renderFields(){
    return this.fields.map(field=>{
      return <Field type={field.type} subtype={field.subtype} name={field.name} label={field.label} required={field.required} key={field.name} updateFunc={this.updateField.bind(this)} validation={this.validation[field.validation]} validMessage={field.validMessage} icon={field.icon} value={field.value}/>
    })
  }
  render() {
    return (
      <form onSubmit={(e)=>{if (this.validate(e)) this.handleSubmit(e)}}>
      <table><tr> 
       {this.renderFields()}
        <td className="container">
          <input className="" type="submit" value="Send" />
        </td>
      </tr></table>
      </form>
    );
  }
}

const makeDefaultState = () => ({
  data: [],
  columns: [],
  sorted: [],
  page: 0,
  pageSize: 10,
  expanded: {},
  resized: [],
  filtered: [],
  loading: true,
  loadingText: "Loading..",
  rows: 10
});

class App extends React.Component {
  constructor(prop) {
    super(prop);
   this.state = makeDefaultState();
    this.rowEvent = {
      onClick: (e, row, rowIndex) => {
        this.setState({details: true, id:rowIndex});
      }
    };
    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    console.log('App componentDidMount')
  }

  fetchData(params) {
    this.setState({loading: true});
    this.setState({loadingText: "Loading"});
    //orkerGlobalScope.fetch("http://yogapants.ewb.ai:8080/data?test=test", {

    let array = Object.keys(params).map( key => key+'='+params[key]);
    console.log('fetchData: '+array);
    let Qstr = array.join('&');
    if (Qstr.length > 0)
      Qstr = '?'+Qstr;

    console.log("sending get request, Query String: ["+Qstr+"]");
    fetch("http://mx.ewb.ai:8080/myapp"+Qstr)
      .then(response => response.json())
      .then((result) => {
        console.log("result");
        this.setState({
          loading: false,
          data: result.data,
          pages: Math.ceil(result.data.length / this.state.pageSize)
        });
      })
      .catch((err) => {
        console.log("API Call returned invalid JSON");
        console.log(err);
      });
  }
  fetchColumns = (resultset) => {
    this.setState({loading: true});
    this.setState({loadingText: "Loading"});
    console.log("sending get request");
    //orkerGlobalScope.fetch("http://yogapants.ewb.ai:8080/data?test=test", {

    fetch("http://mx.ewb.ai:8080/myapp?keywords="+resultset)
      .then(response => response.json())
      .then((result) => {
        console.log("result");
        //console.log(result);
        this.setState({
          loading: false,
          data: result.data
        });
      })
      .catch((err) => {
        console.log("API Call returned invalid JSON");
        console.log(err);
      });
  }
  getColumns() {
    const { data } = this.state;
    //console.log(data);
    if (data.length <= 0)
      return data;
    
    let headers = {'condition_conditionDisplayName':'condition','listingInfo_bestOfferEnabled':'Has BestOffer','listingInfo_buyItNowAvailable':'Has BuyItNow','listingInfo_endTime':'EndTime','listingInfo_listingType':'ListingType','listingInfo_watchCount':'WatchCount','returnsAccepted':'Can Return','sellingStatus_convertedCurrentPrice_content':'Current Price','sellingStatus_timeLeft':'Time Left','shippingInfo_handlingTime':'Handling Time','shippingInfo_shipToLocations':'ShipTo'};
    let whitelist = ['error','condition_conditionDisplayName','country','itemId','listingInfo_bestOfferEnabled','listingInfo_buyItNowAvailable','listingInfo_endTime','listingInfo_listingType','listingInfo_watchCount','location','returnsAccepted','sellingStatus_convertedCurrentPrice_content','sellingStatus_timeLeft','shippingInfo_handlingTime','shippingInfo_shipToLocations','title','viewItemURL'];
    //
    return Object.keys(data[0]).filter( key => whitelist.indexOf(key) >= 0)
      .map(key => {
      let column = {
        Header: key,
        accessor: key
      };
      
      if (headers[key] != null) {
        column.Header = headers[key]
      }
      let str = column.Header
      column.Header = str.slice(0, 1).toUpperCase() + str.substr(1,str.length);

      //  view data munger
      //
      if (key.match(/[Uu][Rr][Ll]/)) {
        column.Cell = row => (
          <a href={row.value} target="_blank">{key}</a>
        )
      }
      return column;
    });
  }
  render() {
    const columns = this.getColumns();
    const { data, rows, pages } = this.state;
    return (
      <div>
      <div>
  <SearchBar handleSubmit={this.fetchData} keywords="type some keywords"/>
      </div>
        <ReactTable
      manual
      data={data}
      columns={columns}
      pages={pages}
      loading={this.state.loading}
      loadingText={this.state.loadingText}
      defaultPageSize={20}
      filterable
      className="-striped -highlight"
      sorted={this.state.sorted}
      page={this.state.page}
      pageSize={this.state.pageSize}
      expanded={this.state.expanded}
      resized={this.state.resized}
      filtered={this.state.filtered}
      // Callbacks
      onSortedChange={sorted => this.setState({ sorted })}
      onPageChange={page => this.setState({ page })}
      onPageSizeChange={(pageSize, page) =>
        this.setState({ page, pageSize })}
      onExpandedChange={expanded => this.setState({ expanded })}
      onResizedChange={resized => this.setState({ resized })}
      onFilteredChange={filtered => this.setState({ filtered })}
        />

        <br />
          <pre>
          <code>
            <strong>this.state ===</strong>{" "}
            {JSON.stringify(this.state.resized, null, 2)}
            {JSON.stringify(this.state.sorted, null, 2)}
            {JSON.stringify(this.state.filtered, null, 2)}
          </code>
        </pre>
        <Tips />
        <Logo />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));

