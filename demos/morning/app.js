const { abs, floor, ceil, round, sin, PI: π } = Math
const random = (x = 1) => Math.random() * x
const rgb = (...values) => `rgb(${values.join(',')})`
const rgba = (...values) => `rgba(${values.join(',')})`

function nArray(n) {
  return [...Array(n).keys()]
}

function generateGrid(size, cellCallback) {
  return nArray(size).map((row, y) => (
    nArray(size).map((cell, x) => cellCallback(x, y))
  ))
}

function generateField({ density, offset = 0, width, height }) {
  const pixels = nArray(width * height)
  return pixels
    .map((px, i) => {
      const star = {
        x: offset + px % width,
        y: floor(px / width)
      }
      // Put some colorful points if debug is enabled
      if (Settings.debug) {
        const isMiddle = i === (width * height) / 2
        const isLast = i === width * height - 1
        if (isLast) {
          return Object.assign(star, { color: 'red' })
        }
        if (isMiddle) {
          return Object.assign(star, { color: 'blue' })
        }
      }
      if (random() > 1 - density) {
        return star
      }
      return null
    })
    .filter(Boolean)
}

function drawSky(ctx, width, state) {
  ctx.fillStyle = Settings.sky.bg
  ctx.fillRect(0, 0, width, width)
  state.sky.shift += Settings.sky.shiftSpeed
}

function generateStars(ctx, width, state) {
  const { stars, fields, shift } = state.sky
  if (!stars.length || width * fields - shift <= width) {
    const newStars = generateField({
      density: Settings.sky.starDensity,
      offset: width * fields,
      width: width,
      height: width
    }).map(star => ({
      ...star,
      color: star.color || Settings.sky.starColor
    }))
    stars.splice(0, 1)
    stars.push(...newStars)
    state.sky.fields++
  }
}

function drawStars(ctx, width, state) {
  const stars = state.sky.stars
  stars.forEach(({ x, y, color }) => {
    ctx.fillStyle = color
    const shiftedX = x - state.sky.shift
    ctx.fillRect(shiftedX, y, 1, 1)
  })
}

function draw(ctx, width, state) {
  generateStars(ctx, width, state)
  drawSky(ctx, width, state)
  drawStars(ctx, width, state)
  requestAnimationFrame(() => {
    draw(ctx, width, state)
  })
}

function init(state, canvas) {
  const ctx = canvas.getContext('2d')
  draw(ctx, canvas.width, state)
}

const Settings = {
  debug: false,
  sky: {
    bg: '#f5f5f5',
    get shiftSpeed() {
      if (Settings.debug) return 0.8
      return 0.05
    },
    starDensity: 0.1,
    get starColor() {
      if (random() >= .5) {
        return 'black'
      }
      if (random() >= .66) {
        return 'hotpink'
      }
      if (random() >= .66) {
        return 'crimson'
      }
      if (random() >= .66) {
        return 'mediumspringgreen'
      }
      if (random() >= .25) {
        return '#fd5'
      }
      return 'palevioletred'
    }
  }
}

const State = {
  sky: {
    shift: 0,
    fields: 0,
    stars: []
  }
}

const image = new Image()
image.src = 'torni-clear-sm.png'
image.onload = () => {
  init(State, canvas)
  init(State, canvas2)
}
