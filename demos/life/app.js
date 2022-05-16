function getRandomWave(x, y) {
  return noise.simplex2(x, y)
}

function adjustCanvas(canvasElement) {
  canvasElement.width = window.innerWidth
  canvasElement.height = window.innerHeight
  return canvasElement
}

window.addEventListener('resize', _ => adjustCanvas(canvas))

var canvas = adjustCanvas(document.createElement('canvas'))
var ctx = canvas.getContext('2d')
document.body.appendChild(canvas)

var noiseY = 0
var x = 0
var y = 0
var thickness = 40
var frequency = 40
var wavelength = 100
var baseY = Math.floor(Math.random() * wavelength)
var colors = [
  'black',
  'crimson',
  '#00d',
  '#fd5',
  'hotpink',
  'mediumspringgreen',
  'orange',
  'cadetblue',
  'white'
]

noise.seed(Math.random())

requestAnimationFrame(function draw() {
  requestAnimationFrame(draw)

  if (x > window.innerWidth) {
    x = 0
    baseY += wavelength
  }

  if (baseY > window.innerHeight) {
    baseY = Math.floor(Math.random() * wavelength)
    colors.push(colors.shift())
  }

  ctx.beginPath()
  ctx.moveTo(x, y + baseY)

  x += frequency

  y = getRandomWave(
    noiseY += .1,
    noiseY += .1
  ) * wavelength

  ctx.lineTo(x, y + baseY)
  ctx.lineWidth = thickness
  ctx.lineCap = 'round'
  ctx.strokeStyle = colors[0]
  ctx.stroke()
})
