const textInput: HTMLInputElement | null = document.querySelector('#text');
const sendBtn = document.querySelector('#send');

const params = new URL(window.location.href).searchParams;

if (textInput == null || sendBtn == null) {
    throw new Error('something happened in html');
}

const host = `ws://${location.host}/ws`;
let ws = new WebSocket(host);

sendBtn.addEventListener('click', (e) => {
    const sendData = {
        isViewOpen: false,
        room: params.get('room'),
        data: textInput.value
    };
    ws.send(JSON.stringify(sendData));
    textInput.value = '';
});
addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const sendData = {
            isViewOpen: false,
            room: params.get('room') ?? '',
            data: textInput.value
        };
        ws.send(JSON.stringify(sendData));
        textInput.value = '';
    }
});

ws.addEventListener('message', (e: MessageEvent<String>) => {
    console.log(e.data);
});

ws.addEventListener('open', (e) => {
    console.log('opened');
});

ws.addEventListener('close', (e) => {
    console.log('closed');
    ws = new WebSocket(host);
    console.log('reopening...');
});