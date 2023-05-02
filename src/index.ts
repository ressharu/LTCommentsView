import url from "url";
import path from "path";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import serveStatic from 'serve-static';
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
const port = parseInt(process.env.PORT ?? '8080');

const views: { [room: string]: express.Response[] } = {};

app.use(serveStatic(`${__dirname}/public`));

type Params = {
    room: string
};

app.get('/events', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    if (typeof req.query.room != 'string') {
        res.end();
        return;
    }
    
    console.log('sse: ', req.query.room);

    if (views[req.query.room] == null) {
        views[req.query.room] = [];
    }

    if (!views[req.query.room].includes(res)) {
        views[req.query.room].push(res);
    }

    res.on('close', () => {
        if (typeof req.query.room != 'string') {
            return;
        }

        views[req.query.room] = views[req.query.room].filter(v => v === res);

        if (views[req.query.room].length === 0) {
            delete views[req.query.room];
        }
    });
});

app.post('/post', (req, res) => {
    const recieveData: { isViewOpen: boolean, room: string, data: string } = req.body;

    if (views[recieveData.room] == null) {
        res.end();
        return;
    }

    console.log('post: ', recieveData.room);
    
    views[recieveData.room].forEach(view => {
        view.write(`data: ${recieveData.data}\n\n`);
    })

    res.send(`return: ${JSON.stringify(req.body)}`);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});