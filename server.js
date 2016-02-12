var express = require('express'),
    app = express(),
    session = require('express-session'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


// localhost/users le users à la fin de l'adresse est le nom que l'on donne à la base de données
// sur laquelle on va tapper
mongoose.connect('mongodb://localhost/users');
console.log('Le serveur est connecte');


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
//cette ligne rend tout ce qui se trouve dans le dossier public a la racine de notre site web.
app.use(express.static(path.join(__dirname, './client/public')));


// Le body parser permet de chopper ce qu'il y a dans le champs text et de l transformer en objet javascript
// Le body parser prend une string en paramètre
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/client');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/users/connect', function(req, res) {
    res.status(200).send(req.user);
});

app.post('/users/connect', passport.authenticate('local'), function(req, res){
    res.status(200).send(req.user);
    if (req.user == 0){
        res.status(403).send();
    }
});

require('./routes/user_route')(app, io);
var User = require('./models/user');

passport.use( new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password'
    },
    function(login, password, done) {
        console.log();
        User.findOne({ login: login }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect login.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log(user);
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(_id, done) {
    User.findById(_id, function(err, user) {
        done(err, user);
    });
});

// on doit se servir de passport pour le cas ou l'utilisateur veut se connecter et non pour le cas ou il va s'inscrire
//app.post('/login',
//    passport.authenticate('local', { successRedirect: '/',
//        failureRedirect: '/#/login'})
//);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.emit('test','tata');
});

//passport.authenticate('local'),
//    function (req, res) {
//        console.log(res)
//    };

app.get('/', function (req, res) {
    res.render('index.html');
});


//faire un app.use c'est passer par tout les modules

//le render va permettre de changer la page en fonction du chemin qu'on lui passe �a peut remplacer un router
//app.get('/login', function (req, res) {
//    res.render('public/templates/login.html');
//});

http.listen(3000, function() {
    console.log('listenning on * 3000');
});

// underscore module
// nodemon server