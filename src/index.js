import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";


class App extends React.Component {
  constructor(prop) {
    super(prop);
    this.columns = [
      {
        Header: "CatID",
        columns: [
          {
            Header: "Category",
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
    fetch("http://yogapants.ewb.ai:8080/data", {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials' : true,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'POST',
        'Access-Control-Allow-Headers':'application/json',
      },
      body: JSON.stringify({
        name: 'foo'
      })
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        this.setState({
          loading: false,
          data: [result]
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  componentMount() {
    console.log('I was triggered during componentDidMount')
  }
  render() {
    console.log('I was triggered during render')
    return (
      <div>
        <ReactTable
      data={this.state.data}
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

