// By Mehdi Farahani
// Diagonal compo of Siyah mashq (Dual Movement)

var song;
var fft;
let particles = [];
let maxRadius = 350;
let minRadius = 10;
let font;
let images = [];
let imgSize1, imgSize2;

function preload() {
  song = loadSound('2.mp3');
  font = loadFont('MehrNastaliqWebRegular.ttf');
  images.push(loadImage('1.png'));
  images.push(loadImage('2.png'));
}

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  rectMode(CENTER);
  fft = new p5.FFT();

  // Calculate image size based on the original dimensions of each image
  const maxSize = min(width, height) * 0.5; // Limit the size to half the canvas dimensions
  const imageSize = maxRadius * 2; // Adjust as needed
  
  // Image 1
  const imageWidth1 = min(imageSize, images[0].width);
  const imageHeight1 = min(imageSize, images[0].height);
  imgSize1 = { width: imageWidth1, height: imageHeight1 };
  
  // Image 2
  const imageWidth2 = min(imageSize, images[1].width);
  const imageHeight2 = min(imageSize, images[1].height);
  imgSize2 = { width: imageWidth2, height: imageHeight2 };
}

function draw() {
  background(250);
  strokeWeight(2);
  stroke(255);
  noFill();

  translate(width / 2, height / 2);

  // analyze the audio frequencies
  fft.analyze();
  amp = fft.getEnergy(200, 200);

  var wave = fft.waveform();

  for (var t = -1; t <= 1; t += 2) {
    for (let i = 0; i <= 180; i++) {
      let index = floor(map(i, 0, 300, 0, wave.length - 1));
      let r = map(wave[index], -0, 0, minRadius, maxRadius);
      let x = r * sin(i) * t;
      let y = r * cos(i);
      point(x, y);
      vertex(x, y);
    }
  }

  var p = new Particle();
  particles.push(p);

  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 220);
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector(0, 0);
    this.size = random(100, 13);
    this.c = color(random(255), random(255), random(255));
    this.direction = random([-1, 1]); // Randomly choose the movement direction
    this.image = random(images); // Randomly choose between the images
  }

  show() {
    noStroke();
    fill(this.c);
    textSize(40);
    textFont(font);
    textAlign(CENTER, CENTER);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(45); // Rotate image by 45 degrees
    imageMode(CENTER);
    
    if (this.image === images[0]) {
      image(this.image, 0, 0, imgSize1.width, imgSize1.height);
    } else if (this.image === images[1]) {
      image(this.image, 0, 0, imgSize2.width, imgSize2.height);
    }
    
    pop();
  }

  update(condition) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    if (condition) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }

  edges() {
    if (
      (this.direction === -1 && (this.pos.x < -imgSize1.width / 2 || this.pos.y > height + imgSize1.height / 2)) ||
      (this.direction === 1 && (this.pos.x > width + imgSize1.width / 2 || this.pos.y < -imgSize1.height / 2))
    ) {
      return true;
    } else {
      return false;
    }
  }
}
