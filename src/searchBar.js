import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      repos: []
    };
  }

  handleSearch = (resultset) =>{
    //    let url = 'https://api.github.com/resultsets/'+resultset+'/repos';
    let url = 'http://yogapants.ewb.ai:8080/data';
    /*
 fetch(url, {
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
  .then(response => response.json()).then((resultset) => {
      console.log(resultset);
      console.log(resultset.length);
      this.setState({
        data: resultset
      });
    });
  */

 fetch(url+'?resultset='+resultset)
  .then(response => response.json()).then((resultset) => {
      console.log(resultset);
      console.log(resultset.length);
      this.setState({
        data: resultset
      });
    });
  }

 render() {
    return (
      <div className="app-container">
        <h3>ResultSet</h3>
        <SearchBar handleSubmit={this.handleSearch} />
        <ResultSet data={this.state.data}/>
      </div>
    )
  }
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

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          name="text"
          className="form-control"
          type="text"
          placeholder="Type github user and press ENTER"
        />
      </form>
    );
  }
}


class RepoList extends React.Component {

  render(){
    var rows = [];
      this.props.repos.map((repo,index) => rows.push(<RepoItem key={index} repo={repo} />))
    return (
      <div className="list-group">
        {rows}
      </div>
    )
  }
}
RepoList.defaultProps = {
  repos: []
};

class RepoItem extends React.Component {
  render(){
    return (
        <a href="#" className="list-group-item list-group-item-action flex-column align-items-start">
    <div className="d-flex w-100 justify-content-between">
      <h5 className="mb-1">{this.props.repo.name}</h5>
      <small>{new Date(Date.parse(this.props.repo.created_at)).toLocaleDateString()}</small>
    </div>
    <p className="mb-1">{this.props.repo.description}</p>
    <small>{this.props.repo.html_url}</small>
  </a>
    )
  }
}

ReactDOM.render(<App/>,document.getElementById('root'));
