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

class App extends React.Component {
  constructor(prop) {
    super(prop);
    console.log("sending post request");
    this.columns = [
      {
        Header: "CatID",
        columns: [
          {
            Header: "CatID",
            accessor: "categoryid"
          }
        ]
      },
    ];
    this.state = {
      loading: true,
      loadingText: "Loading..",
      data: [],
      details: false,
      id: 0,
      page: 1,
      sizePerPage: 0,
      totalSize: 0,
      totalPage: 0
    }

    this.rowEvent = {
      onClick: (e, row, rowIndex) => {
        this.setState({details: true, id:rowIndex});
      }
    };
    this.fetchData = this.fetchData.bind(this);

  }
  /*
  componentDidMount() {
    fetch("http://localhost:3000/data", {
      method : 'POST'
    })
      .then(res => res.json())
      .then((result) => {
        this.setState({data: 
          [result]
        });
      });
  }
  */

  fetchData(state, instance) {
    this.setState({loading: true});
    this.setState({loadingText: "Loading"});
    console.log("sending get request");
    //orkerGlobalScope.fetch("http://yogapants.ewb.ai:8080/data?test=test", {

    fetch("http://yogapants.ewb.ai:8080/data?resultset=FindingCategory")
      .then(response => response.json())
      .then((result) => {
        console.log(result);
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
      .then((result) => {
        console.log(result);
        this.setState({
          loading: false,
          data: [result.json]
        });
      })
      .catch((err) => {
        console.log("API Call returned invalid JSON");
        console.log(err);
      });
  }

  componentMount() {
    console.log('I was triggered during componentDidMount')
  }
  render() {
    const { data } = this.state;
    return (
      <div>
        <ReactTable
      data={data}
      columns={this.columns}
      loading={this.state.loading}
      loadingText={this.state.loadingText}
      showPageSizeOptions={false}
      defaultPageSize={18}
      showPageJump={false}
      sortable={false}
      multiSort={false}
      resizable={true}
      filterable={false}
      pages={this.state.totalPage}
      onFetchData={this.fetchData}
        />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));

