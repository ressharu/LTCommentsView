import { connect } from './ws-view.js';
import './display-media.js';

class Message {
    data: string;
    x: number;
    y: number;
    constructor(data: string, x: number, y: number) {
        this.data = data;
        this.x = x;
        this.y = y;
    }
    update(deltaTime: number, textWidth: number, canvasWidth: number): boolean {
        const time = 3;
        this.x -= (textWidth + canvasWidth) / time * deltaTime;

        if (this.x < 0 - textWidth) {
            return true;
        } else {
            return false;
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
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

const fontsize: HTMLInputElement | null = document.querySelector('#fontsize');
if (fontsize == null) {
    throw new Error('something happened in html');
}
const font: HTMLInputElement | null = document.querySelector('#font');
if (font == null) {
    throw new Error('something happened in html');
}
const color: HTMLInputElement | null = document.querySelector('#color');
if (color == null) {
    throw new Error('something happened in html');
}

type Settings = (arg: void) => void;
const settings: Settings = () => {
    ctx.font = `${fontsize.value}px ${font.value}`;
    ctx.fillStyle = color.value;
};

let messages: Message[] = [];

let prevTimeStamp = 0;
type Update = (timeStamp: number) => void;
const update: Update = (timeStamp) => {
    if (prevTimeStamp === 0) {
        prevTimeStamp = timeStamp;
        id = requestAnimationFrame(update);
        return;
    }
    const deltaTime = (timeStamp - prevTimeStamp) * 0.001;

    settings();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    messages = messages.flatMap((message) => {
        const isEnd = message.update(deltaTime, ctx.measureText(message.data).width, canvas.width);
        if (isEnd) {
            return [];
        } else {
            return message;
        }
    });

    messages.forEach((message) => {
        message.draw(ctx);
    });

    prevTimeStamp = timeStamp;
    id = requestAnimationFrame(update);
};

let id = requestAnimationFrame(update)

connect((msg) => {
    messages.push(new Message(msg, canvas.width + ctx.measureText(msg).width / 2, Math.random() * canvas.height / 2 + parseInt(fontsize.value)));
});