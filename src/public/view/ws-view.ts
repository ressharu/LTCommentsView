const params = new URL(window.location.href).searchParams;

type Connect = (callback: (msg: string) => void) => void;
export const connect: Connect = (callback) => {
    const source = new EventSource(`/events?room=${params.get('room') ?? ''}`);

    source.addEventListener('message', e => {
        callback(e.data);
        console.log(e.data);
    });
};