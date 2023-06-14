const express = require('express');
const app = express();
require('dotenv').config();
const port = 5000;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const User = require('./models/user');

const url = process.env.MONGODB_URI;

mongoose.connect(url, (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.static('public'));

//logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next();
});

const connectionParams = { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }

app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome!'});
});


app.post('/user', (req, res) => {
    const formData = JSON.parse(JSON.stringify(req.body));
    const email = JSON.parse(JSON.stringify(formData.email));
    const password = JSON.parse(JSON.stringify(formData.password));
    console.log(typeof(email), typeof(password));
    console.log(email, password);
    let user = User.find({"password": req.body.password}, (err, user) => {
        if (err) throw err;
        if (user.length == 0) {
            res.status(404).send({message: "No user found"});
        }
        else {
            res.send({message: "User found", user: user});
        }
    });
});

app.get('/db', (req, res) => {
    // let user = User.find({"email": "ankush", "password": "gan"}, (err, user) => {
    //     if (err) throw err;
    //     if (user.length == 0) {
    //         res.send("No user found");
    //     }
    //     else {
    //         res.send(user);
    //     }
    // });
    let user = User.find({}, (err, user) => {
        if (err) throw err;
        if (user.length == 0) {
            res.status(404).send({message: "No user found"});
        }
        else {
            res.send(user);
        }
    });
});

app.listen(port, () => {
    console.log(`server is listening at port ${port}`);
});

module.exports = app;