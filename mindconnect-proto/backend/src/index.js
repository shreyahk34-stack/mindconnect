const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // initialize db
const authRoutes = require('./routes/auth');
const screeningRoutes = require('./routes/screening');
const chatbotRoutes = require('./routes/chatbot');
const counselorsRoutes = require('./routes/counselors');
const sessionsRoutes = require('./routes/sessions');
const emergencyRoutes = require('./routes/emergency');
const parentRoutes = require('./routes/parent');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/screening', screeningRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/counselors', counselorsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/parent', parentRoutes);

app.get('/api/health', (req,res)=>res.json({ ok:true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Backend running on', PORT));
