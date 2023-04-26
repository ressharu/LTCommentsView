const textInput: HTMLInputElement | null = document.querySelector('#text');
const sendBtn = document.querySelector('#send');

if (textInput == null || sendBtn == null) {
    throw new Error('something happened in html');
}

const host = `ws://${location.host}/ws`;
let ws = new WebSocket(host);

sendBtn.addEventListener('click', (e) => {
    ws.send(textInput.value);
    textInput.value = '';
});
addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        ws.send(textInput.value);
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