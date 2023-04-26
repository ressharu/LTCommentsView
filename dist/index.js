import url from "url";
import path from "path";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from 'express';
import expressWs from 'express-ws';
import serveStatic from 'serve-static';
const { app, getWss, applyTo } = expressWs(express());
const port = 8080;
const views = {};
app.use(serveStatic(`${__dirname}/public`));
app.ws('/ws', (ws, req) => {
    ws.on('message', (msg) => {
        const recieveData = JSON.parse(msg);
        if (recieveData.room == null) {
            return;
        }
        if (views[recieveData.room] == null) {
            views[recieveData.room] = [];
        }
        if (recieveData.isViewOpen) {
            views[recieveData.room].push(ws);
            return;
        }
        views[recieveData.room].forEach(view => {
            view.send(recieveData.data);
        });
        ws.send(`return: ${msg}`);
    });
    ws.on('close', (code, reason) => {
        const viewsArray = Object.entries(views).map(views => [views[0], views[1].filter(view => view !== ws)]);
        for (const [room, wss] of viewsArray) {
            if (typeof room === "string" && typeof wss !== "string") {
                views[room] = wss;
            }
        }
    });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
