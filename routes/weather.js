const express = require('express');
const router = express.Router();
const axios = require('axios');
const tendencies = require("../helpers/tendencies");

const wbKey = process.env.WEATHERBITAPIKEY;
const baseUrl = 'https://api.weatherbit.io/v2.0';

/* GET users listing. */
router.get('/', (req, res) => res.status(404).send());

router.get('/current', (req, res) => {
  const location = req.query.location;
  if(!location) return res.status(400).json({status: 400, error: "No location specified"})

  axios.get(baseUrl+'/current',{
    params: {
      key: wbKey,
      lang: "fr",
      city: location
    }
  }).then(result => {
    if(result.data.count) {
      const data = result.data.data[0];

      res.json({
        text: (`Bulletin météo pour ${location} (${data.country_code}). `
              + `Dernière observation le ${new Intl.DateTimeFormat('fr-FR', {
                                            dateStyle: 'full',
                                            timeStyle: 'long',
                                          }).format(new Date(data.ob_time))}. `
              + `Météo actuellement observée : ${data.weather.description}. `
              + `Il fait ${data.temp}°C` + (data.app_temp === data.temp ? '. ' : `, ressenti ${data.app_temp}°C. `)
              + `Le vent est actuellement de ${data.wind_spd * 3.6}km/h, direction ${data.wind_cdir_full}. `
              + (data.precip ? `Il y a ${data.precip}mm de pluie actuellement. ` : '')
              + (data.snow ? `Il y a ${data.snow}mm de neige actuellement. ` : '')
              + (data.dewpt > data.temp ? 'Risques de ' + (data.dewpt < 0 ? 'gel. ' : 'brouillard. ') : '')).trim(),
        temperature: data.temp,
        wind: data.wind_spd*3.6,
        humidity: data.rh
      });
    } else res.status(404).json({status: 404, error: "Location not found", location: location});
  }).catch(err => {
    res.status(500).json({
      status: 500,
      error: err
    });
  });
});

router.get('/forecast', (req, res) => {
  const location = req.query.location;
  if(!location) return res.status(400).json({status: 400, error: "No location specified"})

  axios.get(baseUrl+'/forecast/daily',{
    params: {
      key: wbKey,
      lang: "fr",
      city: location,
      days: 7
    }
  }).then(result => {
    const data = result.data.data;

    // Wind calculation
    const windSpds = data.map(v => v.wind_spd);
    const avgWindSpds = windSpds.reduce((a,b) => a + b) / windSpds.length;
    // Beaufort scale calculation B=(v/0.836)^(2/3)
    const bfrtWindSpd = Math.min(Math.floor(Math.pow(avgWindSpds/0.836, 2/3)),12);

    // Temperature and pressure tendencies calculataion
    const temps = data.map(v => v.temp);
    const pres = data.map(v => v.pres);

    const tempReg = tendencies.calculateReg(temps);
    const presReg = tendencies.calculateReg(pres);

    // Global trend calculation
    const tempTrend = tendencies.calculateTrend(temps, 20);
    const presTrend = tendencies.calculateTrend(pres, 1013.25);
    const rainTrend = tendencies.calculateTrend(data.map(v => v.precip), 0);
    const windTrend = tendencies.calculateTrend(windSpds, 0);
    const globalTrend = Math.round([tempTrend, presTrend, rainTrend, windTrend].reduce((a, b) => a + b));

    res.json({
      tendency: tendencies.describeTrend(globalTrend),
      temperature: tendencies.describeReg(tempReg),
      pressure: tendencies.describeReg(presReg, 2),
      wind_beaufort: bfrtWindSpd
    });
  }).catch(err => {
    res.status(500).json({
      status: 500,
      error: err
    });
  });
});

module.exports = router;
