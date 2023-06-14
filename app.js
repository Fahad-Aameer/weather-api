require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post("/", (req, res) => {
    console.log(process.env.API_KEY)
    const app_id = process.env.API_KEY;
    const query = req.body.cityName;
    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?appid=${app_id}&q=${query}&units=${unit}`;

    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            res.write(`<h1>The temperature in ${query} is ${temp} degrees Celcius.</h1>`);
            res.write(`<p>The weather is currently ${description}</p>`);
            res.write(`<img src="https://openweathermap.org/img/wn/${icon}@2x.png">`);
            res.send();
        })
    } )
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});