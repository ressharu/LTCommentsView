import { connect } from './ws-view.js';
import './display-media.js';

class Message {
    data: string;
    x: number;
    y: number;
    width: number;
    constructor(data: string, x: number, y: number, width: number) {
        this.data = data;
        this.x = x;
        this.y = y;
        this.width = width;
    }
    checkStartPos(canvasWidth: number) {
       return this.x + this.width / 2 >= canvasWidth;
    }
    update(deltaTime: number, canvasWidth: number): boolean {
        const time = 3;
        this.x -= (this.width + canvasWidth) / time * deltaTime;

        if (this.x < 0 - this.width) {
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

let fontheight = 0;

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
        const isEnd = message.update(deltaTime, canvas.width);
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

let nextY = fontheight / 2;
connect((msg) => {
    fontheight = parseInt(fontsize.value);
    nextY = fontheight / 2;
    while (nextY < canvas.height) {
        if (messages.filter(message => message.y === nextY).filter(message => message.checkStartPos(canvas.width)).length === 0) {
            break;
        } else {
            nextY += fontheight;
        }
    }

    messages.push(new Message(msg, canvas.width + ctx.measureText(msg).width / 2, nextY, ctx.measureText(msg).width))
});