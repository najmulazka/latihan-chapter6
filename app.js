require('dotenv').config();
const express = require('express');
const app = express();
const { PORT, SENTRY_DSN, RAILWAY_ENVIRONMENT_NAME } = process.env;
const Sentry = require('@sentry/node');
const router = require('./routes/index');

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  environment: RAILWAY_ENVIRONMENT_NAME,
});

app.use(express.json());
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/', (req, res) => {
  console.log(name);
  return res.json({
    status: true,
    messages: 'WELCOME TO RAILWAY',
    err: null,
    data: null,
  });
});
app.use('/api/v1', router);

app.use(Sentry.Handlers.errorHandler());

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: 'Not Found',
    err: null,
    data: null,
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    status: false,
    message: 'Internal Server Error',
    err: err.message,
    data: null,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
