import bunyan from 'bunyan';

export const logger = bunyan.createLogger({
    name: 'effdem-node',
    serializers: {
        err: bunyan.stdSerializers.err,
        req: reqSerializer,
    },
    streams: [{
        path: '/var/log/effdem/error.log',
    }]
});

function reqSerializer(req) {
    if (!req || !req.connection) {
        return req;
    }
    return {
        method: req.method,
        url: req.originalUrl || req.url,
        remoteAddress: req.ip,
    };
}