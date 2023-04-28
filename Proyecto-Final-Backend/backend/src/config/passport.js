import local from "passport-local";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import { createUser, findUserByEmail } from "../services/userService.js";
import { createCart } from "../services/cartServices.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register",
        new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
            const { first_name, last_name, email } = req.body;

            try {
                const user = await findUserByEmail(username); // username <=> email
                if (user) {
                    return done(null, false); // null: no errores - false: no se creo el user
                } else {
                    const hashPassword = createHash(password);
                    const newCart = await createCart()

                    const createdUser = await createUser({
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        password: hashPassword,
                        role: "user",
                        cart_id: newCart._id
                    });

                    return done(null, createdUser);
                }
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.use("login",
        new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
            try {
                const user = await findUserByEmail(username);
                console.log(`PASSPORT[login]> user logging-in: ${user.email}`);
                if (!user) {
                    //User not found
                    console.log(`PASSPORT[login]> User not found`);
                    return done(null, false);
                }
                if (validatePassword(password, user.password)) {
                    //const token = generateToken(user);
                    console.log(`PASSPORT[login]> User found: ${user}`);
                    return done(null, user);
                }
                // Wrong password
                console.log("PASSPORT[login]> Wrong credentials");
                return done(null, false);
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.use("github", new GitHubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:8080/authSession/githubSession",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
                const user = await findUserByEmail(profile._json.email);

                if (user) {
                    console.log("Found user on Github");
                    done(null, user);
                } else {
                    console.log("New Github user");

                    const newCart = await createCart()

                    const createdUser = await createUser({
                        first_name: profile._json.name,
                        last_name: " ",
                        email: profile._json.email,
                        password: " ",
                        role: "user",
                        cart_id: newCart[0]._id
                    });

                    done(null, createdUser);
                }
            } catch (error) {
                return done(error);
            }
        }
    )
    );

    // Iniciar sesión
    passport.serializeUser((user, done) => {
        if (!user) {
            done(null, null);
        }
        if (Array.isArray(user)) {
            done(null, user[0]._id);
        } else {
            done(null, user._id);
        }
    });

    // Eliminar sesión
    passport.deserializeUser(async (id, done) => {
        const user = await userManager.getElementById(id);
        done(null, user);
    });
};

export default initializePassport;