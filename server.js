require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./db');

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// for development
if(process.env.NODE_ENV === 'development'){
    app.use(cors({
        origin: process.env.CLIENT_URL
    }));

    app.use(morgan('dev'));
}

// Routes
app.use('/api', require('./routes/auth'));

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Page not found'
    });
});

const PORT = process.env.PORT || 8000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server is running ${PORT}`)))