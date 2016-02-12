var User = require('./../models/user');

module.exports = function (app, io) {
    app.post('/users', function(req, res) {
        var newUser = new User(req.body);

        newUser.save(function(err){
            if (err)
                return res.status(500).send(err);

            io.emit('newUser', req.body);
            res.status(200).send(newUser);
        });

    });

    app.get('/users', function (req, res) {
        User.find({}, function(err, users) {
            if (err)
                return res.status(500).send(err);

            res.status(200).send(users);
        });

    });

    app.get('/users/:id', function(req, res) {

        User.findById(req.params.id, function(err, user) {
            if (err)
                return res.status(500).send(err);

            res.status(200).send(user);
        });

    });

    app.put('/users/:id', function(req, res) {

        User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
            if (err)
                return res.status(500).send(err);

            res.status(200).send('User successfully updated!');
        });

    });

    app.delete('/users/:id', function(req, res) {

        User.findByIdAndRemove(req.params.id, function(err, user) {
            if (err)
                return res.status(500).send(err);

            res.status(200).send('User successfully deleted!');
        });

    });

};
