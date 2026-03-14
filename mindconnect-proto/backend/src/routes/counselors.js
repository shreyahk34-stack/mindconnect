const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Mock counselors with lat/lng (in degrees). In production, query DB & compute distance.
const counselors = [
  { id:'c1', name:'Dr. R. Sharma', dept:'Psych', email:'rsharma@univ.edu', lat:28.7041, lng:77.1025 },
  { id:'c2', name:'Ms. A. Roy', dept:'Student Wellness', email:'aroy@univ.edu', lat:28.7050, lng:77.1036 },
  { id:'c3', name:'Dr. N. Gupta', dept:'Counseling', email:'ngupta@univ.edu', lat:28.7037, lng:77.1040 },
  { id:'c4', name:'Mr. S. Mehta', dept:'Mental Health', email:'smehta@univ.edu', lat:28.7058, lng:77.1019 },
  { id:'c5', name:'Dr. L. Singh', dept:'Academic Counseling', email:'lsingh@univ.edu', lat:28.7065, lng:77.1051 },
  { id:'c6', name:'Ms. P. Kaur', dept:'Wellness', email:'pkaur@univ.edu', lat:28.7029, lng:77.1008 }
];

function distanceKm(lat1, lon1, lat2, lon2){
  function toRad(v){ return v * Math.PI/180; }
  const R=6371;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

router.get('/nearby', authMiddleware, (req,res)=>{
  // client should send lat & lng (optional). If not provided return campus default.
  const lat = parseFloat(req.query.lat) || 28.7041;
  const lng = parseFloat(req.query.lng) || 77.1025;
  const list = counselors.map(c=>{
    const dist = distanceKm(lat,lng,c.lat,c.lng);
    return { ...c, distance_km: Number(dist.toFixed(2)) };
  }).sort((a,b)=>a.distance_km - b.distance_km);
  res.json(list);
});

module.exports = router;
