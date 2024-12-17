import { Camera, StaticImage, MovingImage, Sprite } from "./classes";

const canvas: HTMLCanvasElement = document.getElementById(
  "animationCanvas"
) as HTMLCanvasElement;

const ctx = canvas.getContext("2d")!;

ctx.textAlign = "center";

const pixellariFont = new FontFace("pixellari", "url(pixellari.ttf)");

await pixellariFont.load().then((font) => {
  document.fonts.add(font);
});

console.log(document.fonts.has(pixellariFont))

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let rightClouds: MovingImage[];
let leftClouds: MovingImage[];

let images: MovingImage[];
let camera: Camera;

const background = new StaticImage(
  "/src/assets/bg.png",
  0,
  0,
  canvas.height * 1.77,
  canvas.height
);

const character_y = (canvas.height * 0.87) - 64;

const fountain = new Sprite(
  "/src/assets/fountain.png",
  (canvas.width * 3/5) + 32, character_y + 42,
  52, 52,
  11
);

const character = new Sprite(
  "/src/assets/_side walk.png",
  0,
  character_y,
  128,
  128,
  5
)

const init = () => {
  rightClouds = Array.from({ length: 10 }, (_, index) => {
    const img = new MovingImage(
      "/src/assets/cloud.png",
      -100,
      index * 130 - 100,
      482,
      200
    );
    img.setSpeed(2 + Math.random() * 2, 0);
    return img;
  });

  leftClouds = Array.from({ length: 10 }, (_, index) => {
    const img = new MovingImage(
      "/src/assets/cloud.png",
      canvas.width - 250,
      index * 100 - 100,
      482,
      200
    );
    img.setSpeed(2 + Math.random() * 2, 0);
    return img;
  });

  images = [...rightClouds, ...leftClouds];

  camera = new Camera(0, 0);
  camera.setSpeed(3, 3);

  let loadedImages = 0;
  images.forEach((img) => {
    img.onload(() => {
      loadedImages++;
      if (loadedImages === images.length) {
        animate();
      }
    });
  });

  setTimeout(() => {
    rightClouds.forEach((cloud) => {
      cloud.moveTo(-2000, cloud.getY);
    });
    leftClouds.forEach((cloud) => {
      cloud.moveTo(2000, cloud.getY);
    });
  }, 1000);

  const characterFn = () => {
    character.setSpeed(0.3, 2);
    character.moveTo(canvas.width * 3/5, character_y, () => {
      character.setImg("/src/assets/_up idle.png");
      setTimeout(() => {
        character.setImg("/src/assets/_side walk.png");
        character.moveTo(canvas.width + 128, character_y, () => {
          character.setPosition(-128, character_y);
          characterFn();
        });
      }, 3500);
    });
  }

  setTimeout(() => {
    characterFn();
  }, 1000)
};

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  camera.update();
  character.update();

  background.draw(ctx, camera);
  fountain.draw(ctx, camera);
  character.draw(ctx, camera);

  ctx.font = '20px "pixellari"';
  ctx.fillText(
    "Complimenti coglione,",
    25,
    50,
    canvas.width
  );
  ctx.fillText(
    "hai risparmiato 344 etti di minchia",
    25,
    75,
    canvas.width
  );

  images.forEach((img) => {
    img.update();
    img.draw(ctx, camera);
  });

  requestAnimationFrame(animate);
}

init();
animate();