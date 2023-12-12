const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => res.status(404).send());

router.get('/current', (req, res) => {
  const location = req.query.location;
});

router.get('/forecast', (req, res) => {
  const location = req.query.location;
});

module.exports = router;
