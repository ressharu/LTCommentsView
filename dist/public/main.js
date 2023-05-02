"use strict";
const textInput = document.querySelector('#text');
const sendBtn = document.querySelector('#send');
const params = new URL(window.location.href).searchParams;
if (textInput == null || sendBtn == null) {
    throw new Error('something happened in html');
}
sendBtn.addEventListener('click', async (e) => {
    const sendData = {
        isViewOpen: false,
        room: params.get('room') ?? '',
        data: textInput.value
    };
    const res = await fetch('/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData)
    });
    console.log(await res.text());
    textInput.value = '';
});
addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const sendData = {
            isViewOpen: false,
            room: params.get('room') ?? '',
            data: textInput.value
        };
        const res = await fetch('/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        });
        console.log(await res.text());
        textInput.value = '';
    }
});
