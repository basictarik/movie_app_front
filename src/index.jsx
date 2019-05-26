import React from 'react';
import ReactDOM from 'react-dom';
import MovieList from './MovieList';

class Home extends React.Component {

  render() {
    return (
      <div>
        <MovieList></MovieList>
      </div >
    );
  }
}

ReactDOM.render(<Home />, document.getElementById('root'));