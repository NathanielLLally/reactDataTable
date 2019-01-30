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

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }
    
  handleSubmit = (event) => {
    event.preventDefault();
    const text = event.target.text.value;
    this.props.handleSubmit(text);
  };

  componentDidMount() {
    console.log('App componentDidMount')
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          name="text"
          className="form-control"
          type="text"
          placeholder="Type a ResultSet name and press ENTER"
        />
      </form>
    );
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingText: "Loading..",
      data: [],
      columns: [],
      details: false,
      id: 0,
      page: 1,
      rows: 1000,
    }
    this.rowEvent = {
      onClick: (e, row, rowIndex) => {
        this.setState({details: true, id:rowIndex});
      }
    };
    this.fetchData = this.props.fetchData.bind(this);
  }
    
  fetchDataPost(state, instance) {
    this.setState({loading: true});
    this.setState({loadingText: "Loading"});
    console.log("sending post request");
    //orkerGlobalScope.fetch("http://yogapants.ewb.ai:8080/data?test=test", {

    fetch("http://yogapants.ewb.ai:8080/data", {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: "no-cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      body: JSON.stringify({
        resultset: 'FindingCategory',
        search: { },
        attrs: { }
      })
    })
      .then(response => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          loading: false,
          data: result.data,
          columns: result.columns

        });
      })
      .catch((err) => {
        console.log("API Call returned invalid JSON");
        console.log(err);
      });
  }

  componentMount() {
    console.log('Table I was triggered during componentDidMount')
  }
  render() {
    const { data, columns } = this.state;
    return (
        <ReactTable
      data={data}
      columns={columns}
      loading={this.state.loading}
      loadingText={this.state.loadingText}
      showPageSizeOptions={false}
      defaultPageSize={18}
      showPageJump={false}
      sortable={true}
      multiSort={false}
      resizable={true}
      filterable={false}
      onFetchData={this.fetchData}
        />
    );
  }
}

class App extends React.Component {
  constructor(prop) {
    super(prop);
  }
  componentDidMount() {
    console.log('App componentDidMount')
  }

  fetchData = (resultset) => {
    this.setState({loading: true});
    this.setState({loadingText: "Loading"});
    console.log("sending get request");
    //orkerGlobalScope.fetch("http://yogapants.ewb.ai:8080/data?test=test", {

    fetch("http://yogapants.ewb.ai:8080/data?resultset="+resultset)
      .then(response => response.json())
      .then((result) => {
        console.log("result");
        console.log(result);
        this.setState({
          loading: false,
          data: result.data,
          columns: result.columns
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

    fetch("http://yogapants.ewb.ai:8080/data?resultset="+resultset)
      .then(response => response.json())
      .then((result) => {
        console.log("result");
        console.log(result);
        this.setState({
          loading: false,
          data: result.data,
          columns: result.columns
        });
      })
      .catch((err) => {
        console.log("API Call returned invalid JSON");
        console.log(err);
      });
  }
  render() {
    return (
      <div>
  <SearchBar handleSubmit={this.fetchColumns} />
  <Table fetchData={this.fetchData}/>
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));

