import bunyan from 'bunyan';

export const logger = bunyan.createLogger({
    name: 'effdem-node',
    streams: [{
        path: '/var/log/effdem/error.log',
    }]
});