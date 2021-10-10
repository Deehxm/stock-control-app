const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', routesHandler);

mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology: true})
.then(() => {
    console.info('DB Connected');
})
.catch((error)=>{
    console.error(error);
})
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`)
})