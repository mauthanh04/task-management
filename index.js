const express = require('express');
const database = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const routes = require('./api/routers/index.route');

database.connect();

const app = express(); 
const port = process.env.PORT;

// parse application/json
app.use(bodyParser.json());

routes(app);

// Enable CORS
app.use(cors());

// Enable cookie parser
app.use(cookieParser());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});