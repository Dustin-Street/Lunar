//server.js
import express from 'express';
const app = express();

//database 
import './database/connection.js';


//passport
import passport from 'passport';

//strategies
import './authentication/jwtStrategy.js'
import './authentication/localStrategy.js'


//session-cookies
import cookieParser from 'cookie-parser';

//cors
import cors from 'cors';

//body parser
import bodyParser from 'body-parser';

//mongoose
import mongoose from 'mongoose';

//import routes
import journalRoutes from './routes/journals.js';
import quotesRoute from './routes/quotes.js';
import userRoute from './routes/user.js';

//env variables
const PORT = process.env.PORT || 5050;


//mongoose connection

//CORS setup
const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(",") : [];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));



//cookie parser and body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

//passport config


app.use(passport.initialize());



//route handling
app.use('/journals', journalRoutes);
app.use('/quotes', quotesRoute);
app.use('/account', userRoute);

//error handling middleware



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return;
    res.status(500).json({ message: "Something went wrong" });
});
