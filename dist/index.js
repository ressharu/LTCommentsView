import express from 'express';
import expressWs from 'express-ws';
import serveStatic from 'serve-static';
let views = [];
const { app, getWss, applyTo } = expressWs(express());
const port = 8080;
app.use(serveStatic('dist/public'));
app.ws('/ws', (ws, req) => {
    ws.on('message', (msg) => {
        if (msg == 'I am a view client.') {
            views.push(ws);
            return;
        }
        views.forEach(view => {
            view.send(msg);
        });
        ws.send(`return: ${msg}`);
        console.log(msg);
    });
    ws.on('close', (code, reason) => {
        views = views.filter((view) => view !== ws);
    });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
