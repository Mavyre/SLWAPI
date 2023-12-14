const express = require('express');
const router = express.Router();

// If needed, we might add SPA distribution if not done through S3/Cloud Storage
router.get('/', (req, res) => res.status(404).send());

module.exports = router;
