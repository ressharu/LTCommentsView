const video = document.querySelector('video');
if (video == null) {
    throw new Error('something happened in html');
}
const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: false,
    video: true
});
video.srcObject = stream;
video.play();
export {};
