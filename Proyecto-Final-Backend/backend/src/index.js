//fix

// * Server
import 'dotenv/config'
import router from './routes/index.routes.js'
import express from 'express'
//import { Server } from 'socket.io'
import { __dirname } from "./path.js";
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session';
import initializePassport from './config/passport.js'
import passport from 'passport'
import cors from 'cors'

const whiteList = ['http://localhost:3000']

const corsOptions = { //Reviso si el cliente que intenta ingresar a mi servidor esta o no en esta lista
     origin: (origin, callback) => {
       if (whiteList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by Cors'))
        }
     }
} 

const app = express()

// Middlewares
app.use(express.json())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URLMONGODB,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 120
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: false
}))

// Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Port setting
app.set("port", process.env.PORT || 8080)

// Router
app.use('/', router)

// Path
app.use('/', express.static(__dirname + '/public'))

// Server
const server = app.listen(app.get("port"), () => {
    console.log(`Server ready on http://localhost:${app.get("port")}`)
})

//Mongo DB
const connectionMongoose = async () => {
    await mongoose.connect(process.env.URLMONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .catch((err) => console.log(err));
    console.log(`Database connected`)
}

connectionMongoose()