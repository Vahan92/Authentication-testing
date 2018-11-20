const router = require('express').Router();
const express = require('express');
const validator = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const User = require('../models/user-model');
const app = express();
const passport = require('passport');

app.use(validator());

let user;
const badRequestStatusCode = 400;
const badRequestCode = 203;
const okStatusCode = 200;
const okCode = 100;
const internalServerErrorStatusCode = 500;
const internalServerErrorCode = 901;
const forbiddenStatusCode = 403;
const forbiddenCode = 205;

router.post('/sign-up', (req, res) => {
    const acceptHeaders = req.headers.accept;
    const userName = req.body.userName;
    const password = req.body.password;
    const email = req.body.email;    

    if (!acceptHeaders) {
        return res.status(forbiddenStatusCode).json({ "errors": [{ "message": 'Bad request. Set header to accept application/json', "code": forbiddenCode }] }).end();
    }

    if (!password) {
        return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Password is not specified', "code": badRequestCode }] }).end();
    }

    if (!userName) {
        return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Username is not specified', "code": badRequestCode }] }).end();
    }

    if (!email) {
        return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Email is not specified', "code": badRequestCode }] }).end();
    }

    if (!correctPassword(password)) {
        return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Password should contain at least 8 characters, at least one uppercase letter, at least one lowercase letter, at least one special character', "code": badRequestCode }] }).end();
    }

    if (!correctUserName(userName)) {
        return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Username should contain at least 6 characters', "code": badRequestCode }] }).end();
    }

    findUserInDb({ userName: userName }, (result) => {
        if (typeof result === 'object') {
            return res.status(internalServerErrorStatusCode).json({ "errors": [{ "message": 'Database Error', "code": internalServerErrorCode }] });
        }
        if (result) {
            return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Username already exists!', "code": badRequestCode }] }).end();
        }
        findUserInDb({ email: email }, (result) => {
            if (typeof result === 'object') {
                return res.status(internalServerErrorStatusCode).json({ "errors": [{ "message": 'Database Error', "code": internalServerErrorCode }] });
            }
            if (result) {
                return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Email is already in use', "code": badRequestCode }] }).end();
            } else
                new User({
                    userName: userName,
                    password: password,
                    email: email
                }).save((err) => {
                    if (err) {
                        return res.status(internalServerErrorStatusCode).json({ "errors": [{ "message": 'Database Error', "code": internalServerErrorCode }] }).end();
                    }
                    return res.status(okStatusCode).send({ message: 'Registration is successful!', code: okCode }).end();
                })
        });
    });
});

//  auth login
router.post('/login', (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;
    if (!req.headers.accept) {
        return res.status(forbiddenStatusCode).json({ "errors": [{ "message": 'Bad request. Set header to accept application/json', "code": forbiddenCode }] }).end();
    }
    if (!req.body.userName) {
        return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Username is required', "code": badRequestCode }] }).end();
    }
    if (!req.body.password) {
        return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Password is required', "code": badRequestCode }] }).end();
    }
    User.findOne({ userName: userName, password: password }, (err, currentUser) => {
        if (err) {
            return res.status(internalServerErrorStatusCode).json({ "errors": [{ "message": 'Database Error', "code": internalServerErrorCode }] }).end();
        }
        if (currentUser) {
            user = {
                username: currentUser.userName,
                password: currentUser.password,
                jwt: jwt.sign({
                    id: 1,
                }, config.JWT_SECRET, { expiresIn: 60 * 60 })
            };
            res.status(okStatusCode).json(user).end();
        } else {
            return res.status(forbiddenStatusCode).json({ "errors": [{ "message": 'Username or password is incorrect', "code": forbiddenCode }] }).end();
        }
    });
});

router.get('/homepage', (req, res) => {
    if (!req.headers.accept) {
        return res.status(forbiddenStatusCode).json({ "errors": [{ "message": 'Bad request. Set header to accept application/json', "code": forbiddenCode }] }).end();
    }
    if (req.headers.authorization) {
        return res.status(okStatusCode).send({ message: 'User is logged in succesfully', code: okCode }).end();
    }
    else {
        return res.status(forbiddenStatusCode).json({
            "errors": [{ "message": 'Token is not set', "code": forbiddenCode }]
        }).end();
    }
});

// auth logout
router.post('/logout', (req, res) => {
    if (!req.headers['accept']) {
        return res.status(forbiddenStatusCode).json({ "errors": [{ "message": 'Bad request. Set header to accept application/json', "code": forbiddenCode }] }).end();
    }
    if (req.headers['accept'] && req.headers['auth-key']) {
        jwt.verify(req.headers['auth-key'], config.JWT_SECRET, function (err, decoded) {
            if (err) {
                // token has expired
                return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Invalid authorization token provided', "code": badRequestCode }] }).end();
            } else {
                req.logout();
                return res.status(okStatusCode).redirect('/login');
            }
        });
    }
});

router.post('/reset', (req, res) => {
    const userName = req.body.userName;
    const newPassword = req.body.newPassword;
    if (!req.headers.accept) {
        return res.status(forbiddenStatusCode).json({ "errors": [{ "message": 'Bad request. Set header to accept application/json', code: forbiddenCode }] }).end();
    }
    if (!(correctPassword(newPassword))) {
        return res.status(badRequestStatusCode).json({
            "errors": [{ "message": "New password is of wrong format.", "code": badRequestCode }]
        }).end();
    }
    if (!userName) {
        return res.status(badRequestStatusCode).json({
            "errors": [{ "message": "Username does not specified.", "code": badRequestCode }]
        }).end();
    }
    User.findOne({ userName: userName }, (err, currentUser) => {
        if (err) {
            return res.status(internalServerErrorStatusCode).json({ "errors": [{ "message": 'Database Error', "code": internalServerErrorCode }] }).end();
        }
        if (currentUser) {
            if (currentUser.password == newPassword) {
                return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Your new password is identical to your old password', "code": badRequestCode }] }).end();
            } else {
                User.findOneAndUpdate({ userName: userName }, { $set: { password: newPassword } }, { new: true }, (err, doc) => {
                    if (err) {
                        return res.status(internalServerErrorStatusCode).json({ "errors": [{ "message": 'Database Error', "code": internalServerErrorCode }] }).end();
                    }
                    return res.status(okStatusCode).send({ message: "New password is set successfully.", code: okCode }).end();
                });
            }
        } else {
            return res.status(badRequestStatusCode).json({ "errors": [{ "message": 'Username does not exist.', "code": badRequestCode }] }).end();
        }
    });
});

checkPasswordInDb = (obj, oldpass, cb) => {
    User.findOne(obj, (err, currentUser) => {
        if (err) {
            cb && cb(err);
        }
        if (currentUser) {
            if (currentUser.password === oldpass) {
                cb && cb(false);
            } else {
                cb && cb(true);
            }
        }
    });
}

findUserInDb = (obj, cb) => {
    User.findOne(obj, (err, currentUser) => {
        if (err) {
            cb && cb(err);
        }
        if (currentUser) {
            cb && cb(true);
        } else {
            cb && cb(false);
        }
    });
}

correctPassword = (password) => {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\_\-])(?=.{8,})");
    return strongRegex.test(password);
}

correctUserName = (userName) => {
    return userName.length > 6;
}

module.exports = router;
