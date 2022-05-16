(() => {
  function generateCrack({ deepness, segments } = {}) {
    function generateChild(segments, children, deepness) {
      const crackAt = Math.floor(Math.random() * segments / 2)
      return new Array(segments).join(' ').split(' ').map((segment, index) => {
        return children + 1 >= deepness ? [] :
          crackAt !== index ? [] :
            [generateChild(segments / 2, children + 1, deepness)]
      })
    }
    return generateChild(segments, 0, deepness)
  }

  function drawCrack(options) {
    const {
      crack,
      ctx, x, y,
      fillStyle, shadeStyle, tintStyle,
      segmentLength, segmentWidth,
      variation
    } = options

    const lineWidth = segmentWidth || 2
    ctx.lineWidth = lineWidth
    crack.forEach(segment => {
      const xVariation = (Math.random() >= .5 ? 1 : -1) * (
        Math.random() * variation
      )
      const newX = x + xVariation
      const newY = y + xVariation + segmentLength
      // Shade
      if (shadeStyle) {
        ctx.beginPath()
        ctx.strokeStyle = shadeStyle
        ctx.moveTo(
          x + Math.random() * lineWidth,
          y - Math.random() * lineWidth
        )
        ctx.lineTo(
          newX + Math.random() * lineWidth,
          newY - Math.random() * lineWidth
        )
        ctx.stroke()
      }
      // Tint
      if (tintStyle) {
        ctx.beginPath()
        ctx.strokeStyle = tintStyle
        ctx.moveTo(
          x - Math.random() * lineWidth,
          y + Math.random() * lineWidth
        )
        ctx.lineTo(
          newX - Math.random() * lineWidth,
          newY + Math.random() * lineWidth
        )
        ctx.stroke()
      }
      // segment
      ctx.beginPath()
      ctx.strokeStyle = fillStyle
      ctx.moveTo(x, y)
      ctx.lineTo(newX, newY)
      ctx.stroke()
      if (segment.length) {
        drawCrack({
          crack: segment,
          ctx, x: newX, y: newY,
          fillStyle, shadeStyle, tintStyle,
          segmentLength: segmentLength / 2,
          variation: variation * 1.6
        })
      }
    })
  }

  function isTileHere(x, y, tile) {
    const tileTop = tile.y
    const tileRight = tile.x + tile.width
    const tileBottom = tile.y + tile.height
    const tileLeft = tile.x
    return (
      (x >= tileLeft && x <= tileRight) &&
      (y >= tileTop && y <= tileBottom)
    )
  }

  function getEmptySpot(width = 1, height = 1, tiles = []) {
    let x = 0
    let y = 0
    let limit = width * height
    if (!tiles.length) {
      return [x, y]
    }
    while (limit > 0) {
      let tileIndex = 0
      let isBlocked = false
      o: while (tileIndex < tiles.length) {
        let tile = tiles[tileIndex]
        if (isTileHere(x, y, tile)) {
          isBlocked = true
          break o
        }
        tileIndex++
      }
      if (!isBlocked) {
        return [x, y]
      }
      limit--
      if (x < width) {
        x++
      } else {
        x = 0
        y++
      }
    }
    return null
  }

  function getLayout(options = {}) {
    const {
      variationFactor = .5,
      totalWidth = 512,
      totalHeight = 512,
      baseTileSize = 128
    } = options

    const baseSize = baseTileSize
    const variation = baseSize * variationFactor
    const minSize = baseSize - variation
    const maxSize = baseSize + variation
    const tiles = []
    
    let limit = 100

    while (true) {
      if (limit-- < 0) {
        alert('something went wrong')
        break
      }

      const emptySpot = getEmptySpot(
        totalWidth,
        totalHeight,
        tiles
      )

      if (!emptySpot) {
        break
      }

      const [ x, y ] = emptySpot

      const varyWidth = Math.random() >= .8 ? minSize :
        Math.random() >= .66 ? maxSize : baseSize

      let width = varyWidth
      let tileEndX = x + width

      if (tileEndX > totalWidth) {
        if (x + baseSize <= totalWidth) {
          width = x + baseSize
        } else if (x + minSize <= totalWidth) {
          width = x + minSize
        } else {
          width -= (tileEndX - totalWidth)
        }
      }

      if (totalWidth - tileEndX < minSize) {
        const gap = totalWidth - tileEndX
        width += gap
      }

      let neighbourIndex = 0
      let lim = 1000
      o: while (lim-- > 0 && neighbourIndex < tiles.length) {
        let neighbour = tiles[neighbourIndex]
        if (isTileHere(tileEndX, y, neighbour)) {
          width = neighbour.x - 1 - x
          break o
        }
        neighbourIndex++
      }

      const varyHeight = Math.random() >= .8 ? minSize :
        Math.random() >= .75 ? maxSize : baseSize

      let height = varyHeight
      let tileEndY = y + height

      const gap = totalHeight - tileEndY
      if (gap > 0 && gap < minSize) {
        height = gap
      }

      if (tileEndY > totalHeight) {
        const overflow = tileEndY - totalHeight
        height -= overflow
      }

      if (width < minSize) {
        height = Math.min(width, height)
      }

      let lastTile = tiles[tiles.length - 1]
      if (lastTile && y < lastTile.y && tileEndY > lastTile.y) {
        height = lastTile.y - y
      }

      tiles.push({
        x,
        y,
        width,
        height
      })
    }

    return tiles
  }

  const width = 480
  const height = 360
  const baseTileSize = 96
  const canvas = document.getElementById('canvas')
  canvas.width = width
  canvas.height = height
  canvas.addEventListener('click', generate)
  generate()

  function generate() {
    const ctx = canvas.getContext('2d')

    const tileOptions = {
      base: {
        color: '#575935'
      },
      shade: {
        color: '#484024',
        width: 5
      },
      darkerShade: {
        color: '#2F2419',
        width: 3
      },
      tint: {
        color: '#70744C',
        width: 5
      }
    }

    const layoutOptions = {
      totalWidth: width,
      totalHeight: height,
      baseTileSize,
      variationFactor: .25
    }

    const tiles = getLayout(layoutOptions)

    tiles.forEach((tile, index) => {
      // Base
      ctx.fillStyle = tileOptions.base.color
      ctx.fillRect(tile.x, tile.y, tile.width, tile.height)

      // Darker Shade
      ctx.beginPath()
      ctx.strokeStyle = tileOptions.darkerShade.color
      ctx.lineWidth = tileOptions.darkerShade.width
      ctx.moveTo(
        tile.x,
        tile.y
      )
      ctx.lineTo(
        tile.x,
        tile.y + tile.height
      )
      ctx.lineTo(
        tile.x + tile.width,
        tile.y + tile.height
      )
      ctx.stroke()

      let shadeWidth, tintWidth

      // Shade
      shadeWidth = tileOptions.shade.width
      ctx.beginPath()
      ctx.strokeStyle = tileOptions.shade.color
      ctx.lineWidth = tileOptions.shade.width
      ctx.moveTo(
        tile.x + shadeWidth,
        tile.y
      )
      ctx.lineTo(
        tile.x + shadeWidth,
        tile.y + tile.height - shadeWidth
      )
      ctx.lineTo(
        tile.x + tile.width,
        tile.y + tile.height - shadeWidth
      )
      ctx.stroke()

      // Lighting
      shadeWidth = shadeWidth + tileOptions.tint.width / 2
      tintWidth = tileOptions.tint.width / 2
      ctx.beginPath()
      ctx.strokeStyle = tileOptions.tint.color
      ctx.lineWidth = tileOptions.tint.width
      ctx.moveTo(
        tile.x + shadeWidth,
        tile.y + tintWidth
      )
      ctx.lineTo(
        tile.x + tile.width - tintWidth,
        tile.y + tintWidth
      )
      ctx.lineTo(
        tile.x + tile.width - tintWidth,
        tile.y + tile.height - shadeWidth
      )
      ctx.stroke()

      // Shade vertical
      noise.seed(Math.random())
      var noiseX = 0
      var noiseY = 500 + Math.round(Math.random() * 20500)
      var noiseYCopy = noiseY
      var distortionX = tile.x
      var distortionY = tile.y
      while (distortionY < tile.y + tile.height) {
        distortionY += 1
        distortionX = tile.x + tileOptions.shade.width - noise.simplex2(noiseX += .05, noiseY += .05) * tileOptions.shade.width
        if (Math.random() >= .5) {
          ctx.fillStyle = tileOptions.shade.color
          ctx.fillRect(
            distortionX,
            distortionY,
            tileOptions.shade.width / 1.25,
            tileOptions.shade.width / 1.25
          ) 
        }
      }

      // Darkershade vertical
      var noiseY = noiseYCopy
      var distortionX = tile.x
      var distortionY = tile.y
      while (distortionY < tile.y + tile.height) {
        distortionY += tileOptions.darkerShade.width / 2
        distortionX = tile.x + (tileOptions.darkerShade.width / 2) - noise.simplex2(noiseX += .05, noiseY += .05) * tileOptions.darkerShade.width / 2
        if (Math.random() >= .125) {
          if (Math.random() >= .5) {
            ctx.fillStyle = tileOptions.darkerShade.color
            ctx.fillRect(
              tile.x,
              distortionY,
              distortionX - tile.x,
              tileOptions.darkerShade.width
            )
          } else {
            ctx.fillStyle = tileOptions.shade.color
          }
          ctx.fillRect(
            distortionX,
            distortionY,
            tileOptions.darkerShade.width / 1.25,
            tileOptions.darkerShade.width / 1.25
          ) 
        }
      }

      // Tint horizontal
      noise.seed(Math.random())
      var noiseX = 0
      var noiseY = 500 + Math.round(Math.random() * 25000)
      var distortionX = tile.x
      var distortionY = tile.y
      while (distortionX < tile.x + tile.width) {
        distortionX += 1
        distortionY = tile.y + (tileOptions.tint.width / 2) - noise.simplex2(noiseX += .05, noiseY += .05) * tileOptions.tint.width
        if (Math.random() >= .5) {
          if (Math.random() >= .5) {
            ctx.fillStyle = tileOptions.tint.color
            ctx.fillRect(
              distortionX,
              distortionY,
              tileOptions.tint.width / 1.5,
              tileOptions.tint.width / 1.5
            ) 
          } else {
            ctx.fillStyle = tileOptions.base.color
            ctx.fillRect(
              distortionX,
              distortionY,
              tileOptions.base.width / 1.75,
              tileOptions.base.width / 1.75
            ) 
          }
        }
      }

      // Tint vertical
      noise.seed(Math.random())
      var noiseX = 0
      var noiseY = 500 + Math.round(Math.random() * 20500)
      var distortionX = tile.x + tile.width
      var distortionY = tile.y
      while (distortionY < tile.y + tile.height) {
        distortionY += 1
        distortionX = tile.x + tile.width - tileOptions.tint.width - noise.simplex2(noiseX += .05, noiseY += .05) * tileOptions.tint.width
        if (Math.random() >= .5) {
          ctx.fillStyle = tileOptions.tint.color
          ctx.fillRect(
            distortionX,
            distortionY,
            tileOptions.tint.width / 1.5,
            tileOptions.tint.width / 1.5
          ) 
        }
      }

      // Shade horizontal
      noise.seed(Math.random())
      var noiseX = 0
      var noiseY = 500 + Math.round(Math.random() * 25000)
      var noiseYCopy = noiseY
      var distortionX = tile.x
      var distortionY = tile.y + tile.height
      while (distortionX < tile.x + tile.width) {
        distortionX += 1
        distortionY = tile.y + tile.height - (tileOptions.shade.width * 2) - noise.simplex2(noiseX += .05, noiseY += .05) * tileOptions.shade.width
        if (Math.random() >= .5) {
          if (Math.random() >= .5) {
            ctx.fillStyle = tileOptions.shade.color
            ctx.fillRect(
              distortionX,
              distortionY,
              tileOptions.shade.width / 1.25,
              tileOptions.shade.width / 1.25
            ) 
          } else {
            ctx.fillStyle = tileOptions.base.color
            ctx.fillRect(
              distortionX,
              distortionY,
              tileOptions.shade.width / 1.5,
              tileOptions.shade.width / 1.5
            ) 
          }
        }
      }

      // Darkershade horizontal
      var noiseY = noiseYCopy
      var distortionX = tile.x
      var distortionY = tile.y + tile.height
      while (distortionX < tile.x + tile.width) {
        distortionX += tileOptions.darkerShade.width / 1.25
        distortionY = tile.y + tile.height - tileOptions.darkerShade.width - noise.simplex2(noiseX += .01, noiseY += .01) * tileOptions.darkerShade.width
        if (Math.random() >= .25) {
          if (Math.random() >= .4) {
            ctx.fillStyle = tileOptions.darkerShade.color
            if (Math.random() >= .5) {
              ctx.fillRect(
                distortionX,
                distortionY,
                tileOptions.darkerShade.width / 1.5,
                tile.y + tile.height - distortionY
              )
            }
          } else {
            ctx.fillStyle = tileOptions.shade.color
          }
          ctx.fillRect(
            distortionX,
            distortionY,
            tileOptions.darkerShade.width / 1.25,
            tileOptions.darkerShade.width / 1.25
          ) 
        }
      }

      // Cracks
      if (tile.width > width / 10 && Math.random() >= .5) {
        const showLighting = Math.random() >= .5
        drawCrack({
          ctx,
          x: tile.width / 5 + tile.x + Math.random() * (tile.width - tile.width / 5),
          y: Math.random() >= .5 ? tile.y : tile.y + tile.height - 40,
          fillStyle: tileOptions.shade.color,
          shadeStyle: showLighting ? tileOptions.darkerShade.color : null,
          tintStyle: showLighting ? tileOptions.tint.color : null,
          crack: generateCrack({
            deepness: 2,
            segments: 4
          }),
          segmentLength: 10,
          segmentWidth: 1,
          variation: 5
        })
      }

      if (tile.width > width / 20 && Math.random() >= .5) {
        drawCrack({
          ctx,
          x: tile.width / 5 + tile.x + Math.random() * (tile.width - tile.width / 5),
          y: tile.height / 5 + tile.y + Math.random() * (tile.height - tile.height / 5),
          fillStyle: tileOptions.shade.color,
          crack: generateCrack({
            deepness: 2,
            segments: 4
          }),
          segmentLength: 5,
          segmentWidth: 1,
          variation: 3
        })
      }

      if (tile.width > width / 20 && Math.random() >= .25) {
        var i = Math.round(Math.random() * 4)
        while (i-- > 0) {
          drawCrack({
            ctx,
            x: tile.width / 5 + tile.x + Math.random() * (tile.width - tile.width / 5),
            y: tile.y + Math.random() * tile.height,
            fillStyle: tileOptions.shade.color,
            shadeStyle: Math.random() >= .5 ? tileOptions.darkerShade.color : null,
            tintStyle: Math.random() >= .5 ? tileOptions.tint.color : null,
            crack: generateCrack({
              deepness: 1,
              segments: 3
            }),
            segmentLength: 1,
            segmentWidth: 3,
            variation: 2
          })
        }
      }
    })
  }
})()
