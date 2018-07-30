const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; //if Heroku's port doesn't exist, then use 3000
var app = express();

//__dirname is needed because we need the full path
hbs.registerPartials(__dirname + '/views/partials'); //to use partials, ie partial files
app.set('view engine', 'hbs'); // /views is the default directory for views
//middleware

app.use((req, res, next) => { //next tells express when the middleware is done
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
            //res.render('maintenance');
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//set up (register) a handler using app.get

app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');
    // res.send({
    //     name: 'Andrew',
    //     likes: [
    //         'Sailing',
    //         'Hiking'
    //     ]
    // });
    res.render('home.hbs', {
        pageTitle: 'Root Page',
        welcomeMessage: 'Hello David, you are brilliant and I love you'
    });
});

app.get('/about', (req, res) => {
    //res.send('About Page');
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/maintenance', (req, res) => {
    //res.send('About Page');
    res.render('maintenance.hbs', {
        pageTitle: 'Maintenance Page'
    });
});


// Create a route /bad response using response.send; send back json with errorMessage property

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Bad Web Server Response'
    });
});

// now we need to listen

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
}); // 3000 is a common port for developing locally

// try http://localhost:3000/