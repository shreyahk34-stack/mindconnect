const express = require('express');
const router = express.Router();

// Returns helpline numbers and instructions. In production, adapt by country/region.
router.get('/help', (req,res)=>{
  res.json({
    emergency_number: '112',
    campus_security: '+91-11-XXXX-XXXX',
    national_mental_health_helpline: '+91-22-2757-1000',
    advice: 'If you are in immediate danger, call emergency number. Use the one-tap call in-app and seek local help.'
  });
});
module.exports = router;
