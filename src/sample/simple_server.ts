import * as express from 'express';
import {Request, Response} from 'express';


const server = express();

server.get('/readiness', (_:Request, res: Response) => {
    res.json({
        status: 'ok',
    })
} )

server.get('/ping', (req:Request, res:Response) => {
    const content = req.query.message
    console.log(content);
    res.json({
        say: 'pong'
    })
})

server.get('/error', (_:Request, res:Response) => {
    res.status(500).send({
        say: 'error'
    })
})

server.get('/bad-request',  (_:Request, res:Response) => {
    res.status(400).send({
        say: 'bad request'
    })
})

server.listen(process.env.PORT, () => {
    console.log(`listening port: ${process.env.PORT}`);
});