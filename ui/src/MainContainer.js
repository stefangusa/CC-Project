import React from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest'
import './App.css';


const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);


const getSuggestionValue = suggestion => suggestion;

const ADDR = '3.121.110.93';

class MainContainer extends React.Component {

    state = {
        response: "",
        dest: "",
        travel_mode: "DRIVING",
        suggestions: [],
        all_locations: [],
        value: ""
    };

    componentDidMount() {
        let thisApp = this;
        let URL = `http://${ADDR}:5000`;

        axios.get(URL)
            .then(function (res) {
                thisApp.setState({lat: res.data.lat, lon: res.data.lon, ip: res.data.ip});
                thisApp.refreshLocations()
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    refreshLocations() {
        let URL = `http://${ADDR}:5001/retrieve`;
        let body = new FormData();
        let thisApp = this;

        body.append('ip', this.state.ip);

        axios.post(URL, body, {'Content-Type': 'application/json'})
            .then(function (res) {
                console.log(res.data);
                thisApp.setState({all_locations: res.data});
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let thisApp = this;
        let URL = `http://${ADDR}:5001/insert`;

        let body = new FormData();
        body.append('ip', this.state.ip);
        body.append('dest', this.state.dest);

        axios.post(URL, body,{'Content-Type': 'application/json'})
            .then(function(res) {
                URL = `http://${ADDR}:3001/`;
                body = {
                    'lat': thisApp.state.lat,
                    'lon': thisApp.state.lon,
                    'dest': thisApp.state.dest,
                    'travel_mode': thisApp.state.travel_mode
                };

                axios.post(URL, body, {'Content-Type': 'application/json'})
                    .then(function(res) {
                        thisApp.setState({response: res.data});

                        if (thisApp.state.response !== "") {
                            eval(thisApp.state.response);
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    });

                thisApp.refreshLocations();
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    checkDisabled() {
        return this.state.dest === '' || this.state.travel_mode === ''
    }

    getSuggestions = destination => {
        const dest = destination.trim().toLowerCase();
        const len = dest.length;

        return len === 0 ? [] : this.state.all_locations.filter(sug =>
            sug.toLowerCase().slice(0, len) === dest
        );
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    handleSuggestionChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
            dest: newValue
        });
    };

    render() {
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Destination',
            value,
            onChange: this.handleSuggestionChange
        };

        return (
            <div id="respDiv">
                <div id="left">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                    />
                </div>
                <div id="right">
                    <select name="travel_mode"
                            value={this.state.travel_mode}
                            onChange={(e) => this.handleChange(e)}
                    >
                        <option value="DRIVING">Driving</option>
                        <option value="WALKING">Walking</option>
                        <option value="BICYCLING">Bicycling</option>
                        <option value="TRANSIT">Public Transport</option>
                    </select>
                    <button name="submit"
                            value="submit"
                            onClick={(e) => this.handleSubmit(e)}
                            disabled={this.checkDisabled()}>
                        START
                    </button>
                </div>
            </div>
        )
    }
}

export default MainContainer;