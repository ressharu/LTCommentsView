const params = new URL(window.location.href).searchParams;

type Connect = (callback: (msg: string) => void) => void;
export const connect: Connect = (callback) => {
    const host = `ws://${location.host}/ws`;
    let ws = new WebSocket(host);

    ws.addEventListener('message', (e: MessageEvent<string>) => {
        callback(e.data);
        console.log(e.data);
    });

    ws.addEventListener('open', (e) => {
        const sendData = {
            isViewOpen: true,
            room: params.get('room'),
            data: ''
        };
        ws.send(JSON.stringify(sendData));

        console.log('opened');
        console.log('Enjoy being on stage!')
    });

    ws.addEventListener('close', (e) => {
        console.log('closed');
        ws = new WebSocket(host);
        console.log('reopening...');
    });
};