const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const PORT = 5000;
const authRouter = require('./routes/authRoute.js');
const productRouter = require('./routes/productRoute.js')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
mongoose
  .connect('mongodb+srv://ammaryousef172:ammaryousef172@e-commerce.ish0er7.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('connected');
  })
  .catch(() => {
    console.log('error');
  });

app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});