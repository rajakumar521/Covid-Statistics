const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080;
const data = require("./data")
console.log(data.data.length)

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')
let len = data.data.length
let totalData = data.data
let recovered = 0;
let active = 0;
let death = 0;
let infected = 0;
for (let i = 0; i < len; i++) {
    recovered += totalData[i].recovered;
    death += totalData[i].recovered;
    infected += totalData[i].infected
}
active = infected - recovered
console.log(recovered, infected, active)



app.get("/totalRecovered", (req, res) => {
    res.status(200).json({
        data: {
            "_id": "total",
            recovered: recovered
        }
    })
    // console.log(totalRecovered)
})
app.get("/totalActive", (req, res) => {
    res.status(200).json({
        data: {
            "_id": "total",
            active: active
        }
    })
    console.log(active)
})

app.get("/totalDeath", (req, res) => {
    res.status(200).json({
        data: {
            "_id": "total",
            death: death
        }
    })
    console.log(active)
})

app.get("/hotspotStates", (req, res) => {
    let states = []
    let rate;
    for (let i = 0; i < len; i++) {
        inf = totalData[i].infected;
        rec = totalData[i].recovered;
        rate = ((inf - rec) / inf).toFixed(5);
        if (rate > 0.1) {
            states.push({ state: totalData[i].state, rate: rate })
        }
    }
    res.status(200).send({
        data: states
    })
})

app.get("/healthyStates", (req, res) => {
    let mortality;
    let healthy = []
    for (let i = 0; i < len; i++) {
        mortality = (totalData[i].death / totalData[i].infected).toFixed(5)
        if (mortality < 0.005) {
            healthy.push({ state: totalData[i].state, mortality: mortality })
        }
    }
    res.status(200).send({
        data: healthy
    })
})


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;