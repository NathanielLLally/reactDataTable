import React, { Component } from 'react';
import { Fetch } from 'react-request';
 
class App extends Component {
  render() {
    return (
      <Fetch url="http://localhost:3000/">
        {({ fetching, failed, data }) => {
          if (fetching) {
            return <div>Loading data...</div>;
          }
 
          if (failed) {
            return <div>The request did not succeed.</div>;
          }
 
          if (data) {
            return (
              <div>
                <div>Post ID: {data.id}</div>
                <div>Post Title: {data.title}</div>
              </div>
            );
          }
 
          return null;
        }}
      </Fetch>
    );
  }
}
