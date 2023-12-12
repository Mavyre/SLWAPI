const express = require('express');
const router = express.Router();
const axios = require('axios');

const wbkey = process.env.WEATHERBITAPIKEY;
const baseUrl = 'https://api.weatherbit.io/v2.0';

/* GET users listing. */
router.get('/', (req, res) => res.status(404).send());

router.get('/current', (req, res) => {
  const location = req.query.location;

  axios.get(baseUrl+'/current',{
    params: {
      key: wbkey,
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
});

module.exports = router;
