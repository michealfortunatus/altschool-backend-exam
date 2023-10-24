const express = require("express");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogRoutes");
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

// Middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

app.use(
  hpp({
    whitelist: ['tags', 'author', 'state', 'timestamp'],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

app.use("/users", userRouter);
app.use("/blogs", blogRouter);

app.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Fortune Eso Blog EXAM',
  });
});

app.all("*", (req, res, next) => {
  res.status(404).json({status: 'failed', message: 'This route does not exist'});
});


module.exports = app;