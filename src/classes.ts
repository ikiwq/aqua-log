import { getMagnitude } from "./math";

class Camera {
  private x: number;
  private y: number;
  private toY: number = 0;
  private toX: number = 0;
  private speedX: number = 0;
  private speedY: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public moveTo(x: number, y: number) {
    this.toX = x;
    this.toY = y;
  }

  public setSpeed(sX: number, sY: number) {
    this.speedX = sX;
    this.speedY = sY;
  }

  public update() {
    if (this.x !== this.toX) {
      if (Math.abs(this.toX - this.x) > this.speedX) {
        this.x += this.speedX * getMagnitude(this.toX - this.x);
      } else {
        this.x = this.toX;
      }
    }

    if (this.y !== this.toY) {
      if (Math.abs(this.toY - this.y) > this.speedY) {
        this.y += this.speedY * getMagnitude(this.toY - this.y);
      } else {
        this.y = this.toY;
      }
    }
  }

  public get getX() {
    return this.x;
  }

  public get getY() {
    return this.y;
  }
}

class StaticImage {
  protected image: HTMLImageElement;
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;

  constructor(
    src: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.image = new Image();
    this.image.src = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.drawImage(
      this.image,
      this.x - camera.getX,
      this.y - camera.getY,
      this.width,
      this.height
    );
  }

  public setImg(src: string){
    this.image.src = src;
  }

  public onload(callback: () => void) {
    this.image.onload = callback;
  }

  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get getX() {
    return this.x;
  }

  public get getY() {
    return this.y;
  }

  public get getImage() {
    return this.image;
  }
}

class MovingImage extends StaticImage {
  protected toX: number;
  protected toY: number;
  protected speedX: number = 0;
  protected speedY: number = 0;
  private onComplete?: () => void;

  constructor(
    src: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(src, x, y, width, height);
    this.toX = x;
    this.toY = y;
  }

  public setSpeed(sX: number, sY: number) {
    this.speedX = sX;
    this.speedY = sY;
  }

  public moveTo(toX: number, toY: number, onComplete?: () => void) {
    this.toX = toX;
    this.toY = toY;
    this.onComplete = onComplete;
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    ctx.drawImage(
      this.image,
      this.x - camera.getX,
      this.y - camera.getY,
      this.width,
      this.height
    );
  }

  public update() {
    if (this.x !== this.toX) {
      if (Math.abs(this.toX - this.x) > this.speedX) {
        this.x += this.speedX * getMagnitude(this.toX - this.x);
      } else {
        this.x = this.toX;
      }
    }

    if (this.y !== this.toY) {
      if (Math.abs(this.toY - this.y) > this.speedY) {
        this.y += this.speedY * getMagnitude(this.toY - this.y);
      } else {
        this.y = this.toY;
      }
    }

    if(this.y === this.toY && this.x === this.toX && this.onComplete){
      this.onComplete();
    }
  }
}

class Sprite extends MovingImage {
  protected spriteFrames: number;
  private currentFrame = 0;
  private frameInterval = 35;
  private lastFrameTime = 0;
  private timestamp = 0;

  constructor(
    src: string,
    x: number,
    y: number,
    width: number,
    height: number,
    animationFrames: number
  ){
    super(src, x, y, width, height);
    this.spriteFrames = animationFrames;
  }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera){
    if (this.timestamp - this.lastFrameTime > this.frameInterval) {
      this.currentFrame = (this.currentFrame + 1) % this.spriteFrames;
      this.lastFrameTime = this.timestamp;
    }

    this.timestamp++;

    const frameX = this.currentFrame * 64;

    ctx.drawImage(
      this.image,
      frameX, 0,
      64, 64,
      this.x - camera.getX, this.y - camera.getY,
      this.width, this.height
    );
  }

  public setSpriteFrames(spriteFrames: number) {
    this.spriteFrames = spriteFrames;
  }
}

export { Camera, StaticImage, MovingImage, Sprite };
