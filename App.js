import React, { Component } from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import Weather from "./Weather";

const API_KEY = "e52ecb83529544efd37a361c9d704743";

export default class App extends Component {
  state = {
    isLoaded: false,
    error: null,
    temperature: null,
    locationName: null,
    weather: null,
    weatherCode: null
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this._getWeather(position.coords.latitude, position.coords.longitude);
        // this.setState({ error: "Something error" }); //error test
      },
      error => {
        this.setState({
          error: error
        });
      }
    );
  }

  _getWeather = async (lat, lon) => {
    try {
      const weatherInfoJson = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`
      );
      const weatherInfo = await weatherInfoJson.json();
      console.log(weatherInfo);
      this.setState({
        isLoaded: true,
        locationName: weatherInfo.name,
        weather: weatherInfo.weather[0].main,
        temperature: weatherInfo.main.temp
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { isLoaded, error, temperature, locationName, weather } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        {isLoaded ? (
          <Weather
            temp={Math.floor(temperature - 273.15)}
            location={locationName}
            weather={weather}
          />
        ) : (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>Getting the weather</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  loading: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fdf6aa",
    justifyContent: "flex-end",
    paddingRight: 24,
    paddingLeft: 24
  },
  loadingText: {
    fontSize: 30,
    marginBottom: 80
  },
  errorText: {
    color: "red",
    backgroundColor: "transparent",
    marginBottom: 40
  }
});
