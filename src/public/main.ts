const textInput: HTMLInputElement | null = document.querySelector('#text');
const sendBtn = document.querySelector('#send');

const params = new URL(window.location.href).searchParams;

if (textInput == null || sendBtn == null) {
    throw new Error('something happened in html');
}

const send = async () => {
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
};

sendBtn.addEventListener('click', async () => {
    await send();
});

addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        await send();
    }
});