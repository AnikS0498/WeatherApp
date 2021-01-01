require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("index");
});


app.post("/", function(req, res){
  const cityName = _.capitalize(req.body.cityName);
  const apiKey = process.env.API_KEY;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apiKey+"&units=metric";
  https.get(url, function(response){
    if(response.statusCode===200){
      response.on("data", function(data){
        const weatherData = JSON.parse(data);
        const weatherDescription = weatherData.weather[0].description;
        const weatherTemp = weatherData.main.temp;
        const weatherIconCode = weatherData.weather[0].icon;
        const iconUrl = "https://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png";
        res.render("weatherData",{description: weatherDescription, city: cityName, temp: weatherTemp, weatherIcon: iconUrl});
      });
    }else{
      res.render("error");
    }
  });
});

app.listen(process.env.PORT || 3000, function(req, res){
  console.log("Running in port 3000");
});
