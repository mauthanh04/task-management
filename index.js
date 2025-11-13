const express = require('express');
const database = require('./config/database');
require('dotenv').config();

const routes = require('./api/routers/index.route');

database.connect();

const app = express(); 
const port = process.env.PORT;

routes(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});