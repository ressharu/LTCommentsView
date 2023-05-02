const params = new URL(window.location.href).searchParams;
export const connect = (callback) => {
    const source = new EventSource(`/events?room=${params.get('room') ?? ''}`);
    source.addEventListener('message', e => {
        callback(e.data);
        console.log(e.data);
    });
};
