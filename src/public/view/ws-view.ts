type Connect = (callback: (msg: string) => void) => void;
export const connect: Connect = (callback) => {
    const host = `ws://${location.host}/ws`;
    let ws = new WebSocket(host);

    ws.addEventListener('message', (e: MessageEvent<string>) => {
        callback(e.data);
        console.log(e.data);
    });

    ws.addEventListener('open', (e) => {
        ws.send('I am a view client.')
        console.log('opened');
        console.log('Enjoy being on stage!')
    });

    ws.addEventListener('close', (e) => {
        console.log('closed');
        ws = new WebSocket(host);
        console.log('reopening...');
    });
};