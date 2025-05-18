const cluster = require('cluster');
const os = require('os');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const redis = require('redis');

const port = process.env.PORT || 80;

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master process running. Forking ${numCPUs} workers...`);
    
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    const app = express();
    const client = redis.createClient();

    hbs.registerPartials(__dirname + '/views/partials');
    app.set('view engine', 'hbs');

    const limiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 100, // Limit each IP to 100 requests per minute
    });
    app.use(limiter);

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'server.log' })
        ]
    });

    app.use((req, res, next) => {
        logger.info(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
    });

    app.use(express.static(__dirname + '/public'));

    hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
    hbs.registerHelper('screamIt', (text) => text.toUpperCase());

    app.get('/', (req, res, next) => {
        const page = req.params.page;
        res.sendFile(`${__dirname}/${page}.html`);
      });

    app.get('/about', (req, res) => {
        res.render('about.hbs', { pageTitle: 'About Page' });
    });

    app.get('/bad', (req, res) => {
        res.send({ errorMessage: 'Unable to handle request.' });
    });

    app.listen(port, () => {
        console.log(`Worker ${process.pid} is running on port ${port}`);
    });

    app.get('*', (req, res) => {
        res.status(404).render('404.hbs', { pageTitle: '404 Page' });
    });
}
