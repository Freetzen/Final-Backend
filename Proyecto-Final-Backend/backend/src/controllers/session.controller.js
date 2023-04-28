import passport from "passport";
import { createUser } from "../services/userService.js";

export const registerUser = async (req, res, next) => {
    try {
        passport.authenticate('register', async (err, user) => {
            if (err) {
                return res.status(401).send({
                    message: `Error on register`,
                    error: err.message
                })
            }
            if (!user) {
                return res.status(401).send({ msg: 'email already in use'})
            }

            return res.status(200).send({ msg:'user succesfully registered'})
        })(req, res, next)
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const loginUser = async (req, res, next) => {
    try {
        passport.authenticate('login', (err, user) => {
            if (err) {
                return res.status(401).send({
                    message: `Error on login`,
                    error: err.message
                })
            }
            if (!user) {
                return res.status(401).send({ msg:`wrong credentials`})
            }
            req.session.login = true
            req.session.user = user

            return res.status(200).send({ msg:`welcome ${req.session.user.role} ${req.session.user.first_name}`})
        })(req, res, next)
    } catch (error) {
        res.status(500).send({
            message: "server internal error",
            error: error.message
        })
    }
}

export const destroySession = async (req, res) => {
    try {
        if (req.session.login) {
            req.session.destroy()
            res.status(200).send({ msg:`session terminated.`})
        } else {
            return res.status(401).send({ msg:`no active session found`})
        }
    } catch (error) {
        res.status(500).send({
            message: "Server internal error",
            error: error.message
        })
    }
}

export const getSession = async (req, res) => {
    try {
        if (req.session.login) {
            console.log(req.session.user)
            res.status(200).json(req.session.user);
        } else {
            return res.status(401).send({ msg:`no active session found`})
        }
    } catch (error) {
        res.status(500).send({
            message: "Server internal error",
            error: error.message
        })
    }
}