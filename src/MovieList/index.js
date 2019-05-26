import React from 'react';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';
import Switch from 'react-toggle-switch'
import 'react-toggle-switch/dist/css/switch.min.css'

class MovieList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movieList : [],
            to_show : 'Movie',
            switched : true
        };
        this.starClickHandler = this.starClickHandler.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
    }

    async componentDidMount () {
        const URL = `http://localhost:8000/movies/`;
        var movies = await axios.get(URL, {params: {results : 10, to_show : this.state.to_show}});
        this.setState({
            movieList : movies.data
        })
    }

    starClickHandler = (nextValue, prevValue, name) => {
        const URL = `http://localhost:8000/movies/${name}`;
        console.log(URL);
        const RATE = {
            rate: nextValue
        }
        axios.patch(URL, RATE).then(res => {
            console.log(res);
        }).catch(function(error) {
            console.log(error);
        });
    }

    loadMore = async () => {
        var current_no_results = this.state.movieList.length;
        const URL = `http://localhost:8000/movies/`;
        var movies = await axios.get(URL, {params: {results : current_no_results + 10, to_show : this.state.to_show}});
        this.setState({
            movieList : movies.data
        })
    }

    toggleSwitch = async () => {
        if (this.state.to_show === 'Movie') {
            const URL = `http://localhost:8000/movies/`;
            var movies = await axios.get(URL, {params: {results : 10, to_show : 'TVShow'}});
            this.setState({
                movieList : movies.data,
                to_show : 'TVShow',
                switched : false
            })
        }
        else if (this.state.to_show === 'TVShow') {
            const URL = `http://localhost:8000/movies/`;
            var movies = await axios.get(URL, {params: {results : 10, to_show : 'Movie'}});
            this.setState({
                movieList : movies.data,
                to_show : 'Movie',
                switched : true
            })
        }
    }

    render() {
        var actors;
        return (
            <div>
                <Switch onClick={this.toggleSwitch} on={this.state.switched}>{this.state.to_show}</Switch>
                {this.state.movieList.map((movie, index) => {
                    return (
                        <div>
                        <div key={index} style={{position : 'relative', width : '100%'}}>
                            
                            <img alt="" src={ 'http://localhost:8000' + movie.cover_image}/>
                            <div className='content' style={{display :'inline-block', height : '100%'}}>
                                <h4>{movie.name}</h4>
                                <h5>rating: {movie.rating}</h5>
                                {
                                    actors = movie.cast.map(function(val) {
                                        return val.first_name + " " + val.second_name;
                                    }).join(",")
                                }
                                <h5>description: {movie.description}</h5>
                                <StarRatingComponent
                                name = {movie.id.toString()}
                                onStarClick={this.starClickHandler}
                                 />
                            </div>
                        </div>
                        <br />
                        </div>
                    )
                })}
                <span style={{color : 'blue', textDecoration: 'underline', cursor : 'pointer'}} onClick={this.loadMore}>Load More</span>
            </div>
        )
    }
}

export default MovieList;