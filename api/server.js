const express = require('express');
const cors = require('cors');
const db = require('./models');
const app = express();
const contactController = require('./controllers/contact.controller')
var corsOptions = {
  origin: 'http://localhost:4200'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync();

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to contacts application.' });
});

app.get('/contacts', contactController.getAll);
app.get('/contacts/:id', contactController.get);
app.post('/contacts', contactController.create);
app.put('/contacts/:id', contactController.update);
app.delete('/contacts/:id', contactController.remove);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(8080, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;