const { abs, max, round, random, sin, cos, PI } = Math

const maybeNegative = (number) => random() >= .5 ? number : -number

const getRandomAngle = (max = 360) => random() * max * PI / 180

const immutableSort = (array, sortFn) => [...array].sort(sortFn)

const query = document.querySelector.bind(document)

const pickByChance = items => {
  const itemsSorted = immutableSort(items, (a, b) => a.chance > b.chance ? -1 : b.chance > a.chance ? 1 : 0)
  for (let i = 0; i < itemsSorted.length; i++) {
    if (random() * itemsSorted[i].chance > random()) {
      return itemsSorted[i]
    }
  }
  return pickByChance(items)
}

const createTree = (opts = {
  ctx: null,
  width: 0,
  height: 0,
  padding: 0,
  background: '',
  color: '',
  segments: 0,
  segmentWidth: 0,
  segmentHeight: 0,
  segmentAngleLimit: 0,
  enableSplittingAt: 0,
  splitChance: 0,
  splitSegmentAngleLimit: 0,
  leaves: [],
  onPaintFinish: () => {}
}) => {
  const createSegment = ({ parent, thickness, angleLimit, start, depth }) => {
    const { segmentHeight } = opts
    const angle = (parent?.angle || 0) + maybeNegative(getRandomAngle(angleLimit))
    return {
      angle,
      children: [],
      thickness,
      start: start || { x: 0, y: 0 },
      end: {
        x: start.x - sin(angle) * segmentHeight,
        y: start.y - cos(angle) * segmentHeight
      },
      depth: depth || 0
    }
  }

  const generateTree = (parent, depthLimit, isSplit) => {
    const {
      segments,
      segmentAngleLimit,
      splitSegmentAngleLimit,
      enableSplittingAt,
      splitChance
    } = opts
    const newSegment = createSegment({
      parent,
      start: {
        x: parent.end.x,
        y: parent.end.y
      },
      angleLimit: isSplit
        ? splitSegmentAngleLimit
        : segmentAngleLimit,
      thickness: isSplit
        ? parent.thickness / 1.3
        : parent.thickness / 1.03,
      depth: segments - depthLimit,
      isSplit
    })
    if (depthLimit > 0) {
      const segmentOrder = segments - depthLimit
      if (segmentOrder > enableSplittingAt && splitChance >= random()) {
        const children = [
          generateTree(newSegment, depthLimit - 1, true),
          generateTree(newSegment, depthLimit - 1, !!round(random())),
        ]
        newSegment.children.push(...children)
      } else {
        newSegment.children.push(
          generateTree(newSegment, depthLimit - 1)
        )
      }
    }
    return newSegment
  }

  const traverse = (tree, forEachFn) => {
    tree.children.forEach(child => {
      forEachFn(child, tree)
      traverse(child, forEachFn)
    })
  }

  const drawLeaves = segment => {
    const { ctx, segments, leaves } = opts
    const remainingSegments = segments - segment.depth
    const leaf = pickByChance(leaves)
    if (remainingSegments > leaf.startsAt) {
      return
    }
    ctx.save()
    ctx.translate(segment.start.x - random() * 10, segment.start.y - maybeNegative(random() * 5))
    ctx.rotate(getRandomAngle())
    ctx.font = `${leaf.size} sans-serif`
    ctx.fillText(leaf.char, 0, 0)
    ctx.restore()
  }

  const draw = () => {
    const { ctx, background, color, width, height, segments, onPaintFinish } = opts
    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = color
    traverse(tree, segment => {
      requestAnimationFrame(() => {
        ctx.lineWidth = segment.thickness
        ctx.beginPath()
        ctx.moveTo(segment.start.x, segment.start.y)
        ctx.lineTo(segment.end.x, segment.end.y)
        ctx.stroke()
        ctx.closePath()
        drawLeaves(segment)
      })
    })
    requestAnimationFrame(onPaintFinish)
  }

  const tree = createSegment({
    parent: null,
    angleLimit: 1,
    thickness: opts.segmentWidth,
    start: {
      x: opts.width / 2,
      y: opts.height - opts.padding
    },
  })
  tree.children.push(generateTree(tree, opts.segments))

  return {
    draw,
    tree
  }
}

const createCanvas = ({ width, height, events }) => {
  const canvas = document.createElement('canvas')
  canvas.id = 'canvas'
  canvas.width = width
  canvas.height = height
  Object.keys(events).forEach(eventType => {
    canvas.addEventListener(eventType, events[eventType])
  })
  return canvas
}

const init = () => {
  const width = 800
  const height = 640
  // To eliminate flickering during the drawing to the existing ctx, use a brand-new canvas for the new drawing.
  const newCanvas = createCanvas({
    width,
    height,
    events: {
      click: init
    }
  })
  const ctx = newCanvas.getContext('2d')
  const tree = createTree({
    onPaintFinish() {
      // And display the new canvas once the drawing has finished.
      query('#canvas').replaceWith(newCanvas)
    },
    ctx,
    width,
    height,
    padding: 75,
    background: 'beige',
    color: 'rgb(60, 20, 10)',
    segments: 100,
    segmentWidth: 20,
    segmentHeight: 5,
    enableSplittingAt: 20,
    splitChance: 0.06,
    splitSegmentAngleLimit: 60,
    segmentAngleLimit: 6,
    leaves: [
      {
        chance: .25,
        startsAt: 40,
        char: '🌸',
        size: '8px',
      },
      {
        chance: .75,
        startsAt: 40,
        char: '🍃',
        size: '12px',
      },
    ]
  })
  tree.draw()
}

let c = 0
const loop = () => {
  if (!(c++ % 100)) {
    init()
  }
  return requestAnimationFrame(loop)
}

loop()
