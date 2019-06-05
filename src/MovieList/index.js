import React from 'react';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';
import Switch from 'react-toggle-switch';
import 'react-toggle-switch/dist/css/switch.min.css';
import $ from 'jquery';

class MovieList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movieList: [],
            to_show: 'Movie',
            switched: true,
            login_status : false
        };
        this.starClickHandler = this.starClickHandler.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    async componentDidMount() {
        window.localStorage.clear();
        const URL = `http://localhost:8000/movies/`;
        var movies = await axios.get(URL, { params: { results: 10, to_show: this.state.to_show } });
        this.setState({
            movieList: movies.data,

        })
    }

    starClickHandler = (nextValue, prevValue, name) => {
        const URL = `http://localhost:8000/movies/${name}`;
        var rate = {
            rate: nextValue,
        }
        var config = {
            headers: { 'Authorization': "bearer " + window.localStorage.getItem('token') }
        };
        axios.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        axios.patch(URL, rate).then(res => {
            console.log(res);
        }).catch(function (error) {
            console.log(error);
        });
    }

    loadMore = async () => {
        var current_no_results = this.state.movieList.length;
        const URL = `http://localhost:8000/movies/`;
        var movies = await axios.get(URL, { params: { results: current_no_results + 10, to_show: this.state.to_show } });
        this.setState({
            movieList: movies.data
        })
    }

    toggleSwitch = async () => {
        if (this.state.to_show === 'Movie') {
            const URL = `http://localhost:8000/movies/`;
            var movies = await axios.get(URL, { params: { results: 10, to_show: 'TVShow' } });
            this.setState({
                movieList: movies.data,
                to_show: 'TVShow',
                switched: false
            })
        }
        else if (this.state.to_show === 'TVShow') {
            const URL = `http://localhost:8000/movies/`;
            var movies = await axios.get(URL, { params: { results: 10, to_show: 'Movie' } });
            this.setState({
                movieList: movies.data,
                to_show: 'Movie',
                switched: true
            })
        }
        $('#search').val('');
    }

    handleSearchChange = async (event) => {
        var searchKey = event.target.value;
        var movies;
        var current_no_results = this.state.movieList.length;
        if (current_no_results < 10) {
            current_no_results = 10;
        }
        const URL = `http://localhost:8000/movies/`;
        /*if ((searchKey.match(/"/g) || []).length === 2 && searchKey.includes('star') && (searchKey.includes('less') || searchKey.includes('more'))) {
            var smart_search;
            if (searchKey.includes('less')) {
                smart_search = 'less';
            } else {
                smart_search = 'more';
            }
            movies = await axios.get(URL, {
                params:
                    { results: current_no_results, to_show: this.state.to_show, search_bar_text: searchKey, smart_search : smart_search }
            })
            this.setState({
                movieList: movies.data
            });
            */

        if (searchKey.length > 1) {
            movies = await axios.get(URL, {
                params:
                    { results: current_no_results, to_show: this.state.to_show, search_bar_text: searchKey }
            })
            this.setState({
                movieList: movies.data
            })
        } else {
            movies = await axios.get(URL, {
                params:
                    { results: current_no_results, to_show: this.state.to_show }
            })
            this.setState({
                movieList: movies.data
            })
        }

    }

    handleSubmit = async () => {
        const URL = `http://localhost:8000/token`;
        var params = {
            username: $('#username').val(),
            password: $('#password').val()
        }
        var res = await axios.post(URL, params);
        window.localStorage.setItem('token', res.data.access_token);
        this.setState({
            login_status : true
        })

    }

    render() {
        var actors;
        return (
            <div>
            {this.state.login_status === false ? (
                <div>
                Username: <input type='text' id='username' />
                <br />
                Password: <input type='password' id='password' />
                <input type='submit' onClick={this.handleSubmit} />
                <br />
                <input type='search' placeholder='search' id='search' onChange={this.handleSearchChange} />
                <br />
                </div>
            ) : (
                <div>Hello User</div>
            )}
                
                <Switch onClick={this.toggleSwitch} on={this.state.switched}>{this.state.to_show}</Switch>
                {this.state.movieList.map((movie, index) => {
                    return (
                        <div>
                            <div key={index} style={{ position: 'relative', width: '100%' }}>

                                <img alt="" src={'http://localhost:8000' + movie.cover_image} />
                                <div className='content' style={{ display: 'inline-block', height: '100%' }}>
                                    <h4>{movie.name}</h4>
                                    <h5>rating: {movie.rating.toFixed(2)}</h5>
                                    {
                                        actors = movie.cast.map(function (val) {
                                            return val.first_name + " " + val.second_name;
                                        }).join(",")
                                    }
                                    <h5>description: {movie.description}</h5>
                                    <StarRatingComponent
                                        name={movie.id.toString()}
                                        onStarClick={this.starClickHandler}
                                    />
                                </div>
                            </div>
                            <br />
                        </div>
                    )
                })}
                <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.loadMore}>Load More</span>
            </div>
        )
    }
}

export default MovieList;