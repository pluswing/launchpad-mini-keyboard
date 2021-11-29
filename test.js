const midi = require('midi');
const robot = require("robotjs");

const inputDAW = new midi.Input();
const inputMIDI = new midi.Input();
const output = new midi.Output();

for (let i = 0; i < inputDAW.getPortCount(); i++) {
  const name = inputDAW.getPortName(i);
  console.log("INPUT", i, name)
}
for (let i = 0; i < output.getPortCount(); i++) {
  const name = output.getPortName(i);
  console.log("OUTPUT", i, name)
}

inputDAW.on('message', (deltaTime, message) => {
  console.log(`DAW  m: ${message} d: ${deltaTime}`);
});
inputMIDI.on('message', (deltaTime, message) => {
  console.log(`MIDI m: ${message} d: ${deltaTime}`);

  const [_, note, velocity] = message;
  if (velocity == 0) {
    // keyup -> 無視する
    return
  }
  output.sendMessage([
    0x80, note, 0x00
  ])
  robot.typeString(`note: ${note}`);
});

inputDAW.openPort(0);
inputMIDI.openPort(1);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
inputDAW.ignoreTypes(false, false, false);
inputMIDI.ignoreTypes(false, false, false);

output.openPort(1); // MIDI

// get Version
// output.sendMessage([0xF0, 0x7E, 0x7F, 0x06, 0x01, 0xF7]);

// change keys mode
//output.sendMessage([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x00, 0x05, 0xF7]);

const HEADER = [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D]
const DELIMITER = [0xF7];
output.sendMessage([
  ...HEADER,
  0x0E, // Programmer / Live mode change
  0x01, // Programmer mode
  ...DELIMITER
])

// // Lighting the lower left pad static red
// output.sendMessage([
//   0x90, 0x0B, 0x05
// ])

// // Flashing the upper left pad green
// output.sendMessage([
//   0x90, 0x51, 0x05
// ])
// output.sendMessage([
//   0x91, 0x51, 0x13
// ])

// // Pulsing the lower right pad blue
// output.sendMessage([
//   0x92, 0x12, 0x2D
// ])

output.sendMessage([
  ...HEADER,
  0x03,
  0x03, 0x0B, 127, 127, 127,
  0x03, 0x0C, 127, 0, 0,
  0x03, 0x0D, 0, 0, 127,
  0x03, 0x0E, 0, 127, 0,
  ...DELIMITER
])

function set(r, g, b, out) {
  out[0] = Math.round(r * 127);
  out[1] = Math.round(g * 127);
  out[2] = Math.round(b * 127);
}

function clamp(v, l, u) {
  return Math.max(l, Math.min(v, u));
}

function hsv2rgb(h, s, v, out) {
  out = out || [0, 0, 0];
  h = h % 360;
  s = clamp(s, 0, 1);
  v = clamp(v, 0, 1);
  if (!s) {
    out[0] = out[1] = out[2] = ceil(v * 127);
  } else {
    var b = ((1 - s) * v);
    var vb = v - b;
    var hm = h % 60;
    switch((h/60)|0) {
      case 0: set(v, vb * h / 60 + b, b, out); break;
      case 1: set(vb * (60 - hm) / 60 + b, v, b, out); break;
      case 2: set(b, v, vb * hm / 60 + b, out); break;
      case 3: set(b, vb * (60 - hm) / 60 + b, v, out); break;
      case 4: set(vb * hm / 60 + b, b, v, out); break;
      case 5: set(v, b, vb * (60 - hm) / 60 + b, out); break;
    }
  }
  return out;
}

const range = (n) => [...new Array(n).keys()]

class Pixel {
  constructor(r, g, b) {
    this.r = r || 0
    this.g = g || 0
    this.b = b || 0
  }
}
class Image {
  constructor() {
    this.width = 9;
    this.height = 9;
    this.pixels = [];
    range(this.width).forEach((x) => {
      const row = []
      range(this.height).forEach((y) => {
        row.push(new Pixel())
      })
      this.pixels.push(row)
    })
  }

  get(x, y) {
    if (this.outOfRange(x, y)) {
      return new Pixel(0, 0, 0)
    }
    return this.pixels[y][x];
  }

  set(x, y, r, g, b) {
    if (this.outOfRange(x, y)) {
      return
    }
    const p = this.pixels[y][x]
    if (r instanceof Pixel) {
      p.r = r.r
      p.g = r.g
      p.b = r.b
    } else {
      p.r = r
      p.g = g
      p.b = b
    }
  }

  outOfRange(x, y) {
    if (x < 0 || y < 0) return true
    if (x >= this.width || y >= this.height) return true
    return false
  }

  blend(image) {
    const img = new Image()
    range(this.width).forEach((x) => {
      range(this.height).forEach((y) => {
        const a = this.get(x, y)
        const b = image.get(x, y)
        img.set(x, y,
          Math.min(a.r + b.r, 127),
          Math.min(a.g + b.g, 127),
          Math.min(a.b + b.b, 127)
        )
      })
    })
    return img
  }

  stack(image) {
    const img = new Image()
    range(this.width).forEach((x) => {
      range(this.height).forEach((y) => {
        const a = this.get(x, y)
        const b = image.get(x, y)
        if (b.r != 0 || b.g != 0 || b.b != 0) {
          img.set(x, y, b.r, b.g, b.b)
        } else {
          img.set(x, y, a.r, a.g, a.b)
        }
      })
    })
    return img
  }
}

let v = 0
const updateRainbow = (image, hue) => {
  v += 1
  range(image.width).forEach((x) => {
    range(image.height).forEach((y) => {
      const saturation = 1
//      let value = Math.sin((Math.PI / 2) * (v / 60)) / 2 + 0.5
      const value = 0.6
      const s = 36
      const h = hue + ((10 - y) * s) + (10 - x) * s
      const [r, g, b] = hsv2rgb(h, saturation, value)
      image.set(x, y, r, g, b)
    })
  })
}

const gradient = (first, last, step) => {
  step += 2
  const r = last.r - first.r
  const g = last.g - first.g
  const b = last.b - first.b
  return range(step).map((v) => {
    return new Pixel(
      first.r + parseInt(r * v / step, 10),
      first.g + parseInt(g * v / step, 10),
      first.b + parseInt(b * v / step, 10)
    )
  })
}

class Ray {
  constructor() {
    this.x = parseInt(9 * Math.random(), 10)
    this.y = 0
    this.step = 6
    this.rand = Math.random() * 5
  }
  alive() {
    return this.y <= 9 + this.step + this.rand
  }
  update() {
    this.y += 0.2
  }

  draw(image) {
    gradient(new Pixel(0, 127, 0), new Pixel(0, 0, 0), this.step).forEach((p, i) => {
      image.set(this.x, parseInt(this.y, 10) - i, p)
    })
  }
}

class Line {
  constructor(x1, y1, x2, y2, color) {
    this.x1 = x1
    this.x2 = x2
    this.y1 = y1
    this.y2 = y2
    this.dx = 0
    this.dy = 0
    this.color = color
  }

  move(x, y) {
    this.dx += x
    this.dy += y
    if (this.dx >= 1 || this.dx <= -1) {
      const n = parseInt(this.dx, 10)
      this.x1 += n
      this.x2 += n
      this.dx -= n
    }
    if (this.dy >= 1 || this.dy <= -1) {
      const n = parseInt(this.dy, 10)
      this.y1 += n
      this.y2 += n
      this.dy -= n
    }
    return this
  }

  draw(image) {
    const dx = this.x2 - this.x1
    const dy = this.y2 - this.y1
    const step = Math.max(Math.abs(dx), Math.abs(dy))
    range(step).forEach((n) => {
      image.set(
        parseInt(this.x1 + (dx * n / step), 10),
        parseInt(this.y1 + (dy * n / step), 10),
        this.color)
    })
    image.set(this.x2, this.y2, this.color)
  }
}

class Circle {
  constructor(x, y, r, color) {
    this.x = x
    this.y = y
    this.r = r
    this.color = color
  }

  move(r) {
    this.r += r
  }

  draw(image) {
    const dots = range(360).map((d) => {
      const r = d * Math.PI / 180
      return [
        ~~(this.r * Math.cos(r)) + this.x,
        ~~(this.r * Math.sin(r)) + this.y
      ]
    })
    dots.forEach((d) => {
      image.set(d[0], d[1], this.color)
    })
  }
}

const darken = (c, d) => new Pixel(
    Math.max(0, c.r - d),
    Math.max(0, c.g - d),
    Math.max(0, c.b - d))

class AACircle {
  constructor(x, y, r, color) {
    this.cs = [
      new Circle(x, y, r -  1, darken(color, 64)),
      new Circle(x, y, r - .5, darken(color, 32)),
      new Circle(x, y, r -  0, darken(color, 0))
    ]
    this.life = 100 + Math.random() * 50
  }

  alive() {
    return this.life > 0
  }

  move(r) {
    this.life -= 1
    this.cs.forEach((c) => c.move(r))
  }
  draw(image) {
    this.cs.forEach((c) => c.draw(image))
  }
}

let rays = []
const createMatrixEffect = () => {
  rays = rays.filter((r) => r.alive())
  if (rays.length <= 5) {
    rays.push(new Ray())
  }
  const image = new Image()
  rays.forEach((r) => {
    r.update()
    r.draw(image)
  })
  return image
}

let lines = [
  new Line(0, 0, 9, 9, new Pixel(0, 0, 127)).move(-9, 0),
  new Line(0, 0, 0, 9, new Pixel(0, 127, 0)).move(-5, 0),
  new Line(0, 9, 9, 0, new Pixel(64, 64, 64)).move(-9, 0),
]
const drawLines = () => {
  const image = new Image()
  lines.forEach((l) => {
    l.move(0.2, 0)
    l.draw(image)
  })
  return image
}

let circles = [
  new AACircle(4, 4, 1, new Pixel(127, 0, 0))
]

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max + min) - min)
}

const colors = [
  new Pixel(127, 0, 0),
  new Pixel(0, 127, 0),
  new Pixel(0, 0, 127),
  new Pixel(127, 127, 0),
  new Pixel(127, 0, 127),
  new Pixel(0, 127, 127),
  new Pixel(127, 127, 127),
]

const drawCircles = () => {
  let image = new Image()
  circles = circles.filter((c) => c.alive())
  if (circles.length <= 1) {
    circles.push(
      new AACircle(
        randInt(0, 9),
        randInt(0, 9),
        1,
        colors[randInt(0, colors.length)]
    ))
  }
  circles.forEach((c) => {
    const img = new Image()
    c.move(0.1)
    c.draw(img)
    image = image.blend(img)
  })
  return image
}

const draw = (image) => {
  messages = []
  range(image.width).forEach((x) => {
    range(image.height).forEach((y) => {
      const note = 0x0B + x + (10 * (8 - y));
      const p = image.get(x, y)
      messages.push([0x03, note, p.r, p.g, p.b])
    })
  })

  output.sendMessage([
    ...HEADER,
    0x03,
    ...messages.flat(),
    ...DELIMITER
  ])
}

let hue = 0
const bg = new Image()
const buttons = new Image()
buttons.set(0, 8, 127, 0, 0)
buttons.set(1, 8, 0, 127, 0)
buttons.set(2, 8, 0, 0, 127)
setInterval(() => {
  updateRainbow(bg, hue)
  // draw(bg.blend(buttons))
  // draw(createMatrixEffect().blend(buttons))
  // draw(drawLines())
  draw(drawCircles())
  hue = (hue + 3) % 360
}, 16)


process.on("SIGINT", () => {
  console.log("exit!")
  output.closePort();
  inputMIDI.closePort()
  inputDAW.closePort()
  process.exit(0)
});
