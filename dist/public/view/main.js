import { connect } from './ws-view.js';
import './display-media.js';
class Message {
    data;
    x;
    y;
    constructor(data, x, y) {
        this.data = data;
        this.x = x;
        this.y = y;
    }
    update(deltaTime, textWidth, canvasWidth) {
        const time = 3;
        this.x -= (textWidth + canvasWidth) / time * deltaTime;
        if (this.x < 0 - textWidth / 2) {
            return true;
        }
        else {
            return false;
        }
    }
    draw(ctx) {
        ctx.fillText(this.data, this.x, this.y);
    }
}
const canvas = document.querySelector('canvas');
if (canvas == null) {
    throw new Error('something happened in html');
}
const ctx = canvas.getContext('2d');
if (ctx == null) {
    throw new Error('Not suported');
}
const fontsize = document.querySelector('#fontsize');
if (fontsize == null) {
    throw new Error('something happened in html');
}
const font = document.querySelector('#font');
if (font == null) {
    throw new Error('something happened in html');
}
const color = document.querySelector('#color');
if (color == null) {
    throw new Error('something happened in html');
}
const settings = () => {
    ctx.font = `${fontsize.value}px ${font.value}`;
    ctx.fillStyle = color.value;
};
const messages = [];
let prevTimeStamp = 0;
const update = (timeStamp) => {
    if (prevTimeStamp === 0) {
        prevTimeStamp = timeStamp;
        id = requestAnimationFrame(update);
        return;
    }
    const deltaTime = (timeStamp - prevTimeStamp) * 0.001;
    settings();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    messages.flatMap((message) => {
        const isEnd = message.update(deltaTime, ctx.measureText(message.data).width, canvas.width);
        if (isEnd) {
            return [];
        }
        else {
            return message;
        }
    });
    messages.forEach((message) => {
        message.draw(ctx);
    });
    prevTimeStamp = timeStamp;
    id = requestAnimationFrame(update);
};
let id = requestAnimationFrame(update);
connect((msg) => {
    messages.push(new Message(msg, canvas.width + ctx.measureText(msg).width / 2, Math.random() * canvas.height / 2 + parseInt(fontsize.value)));
});
