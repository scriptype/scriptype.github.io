(({ utils: { query } }) => {
  const { random, floor, round, sqrt } = Math
  const randomFrom = arr => arr[floor(random() * arr.length)]
  const randomInt = (min = 0, max = 1) => min + round(random() * (max - min))

  const fps = 30
  const numberTiles = 256
  const numberRows = sqrt(numberTiles)
  const numberCols = sqrt(numberTiles)
  const container = query('.wfc-container')

  const createGrid = (numberRows, numberCols) => {
    const table = document.createElement('table')
    table.innerHTML = Array(numberRows).fill(`
      <tr>${Array(numberCols).fill('<td></td>').join('')}</tr>
    `).join('')
    
    return {
      table,
      getCell(x, y) {
        return table.querySelector(`tr:nth-child(${y})`).querySelector(`td:nth-child(${x})`)
      },
      hasEmptyCells() {
        return !!table.querySelector('td:empty')
      }
    }
  }

  const getTile = (tileIndex, angle) => {
    const tile = tiles[tileIndex]
    const el = tile.el.content.cloneNode(true)
    if (angle) {
      el.firstElementChild.style.cssText += `
        transform: rotate(${angle}deg);
      `
    }
    el.firstElementChild.style.cssText += `
      --hue: ${randomInt(0, 255)};
    `
    return el.firstElementChild
  }

  const tiles = [
    {
      el:  query('#tile-0'),
      sockets: {
        top: [
          [0, 180],
          [1, 90],
          [1, 180],
          [2],
          [3],
          [3, 90],
        ],
        right: [
          [0],
          [0, 90],
          [0, 180],
          [1],
          [1, 90],
          [2],
          [3],
          [3, 270],
        ],
        bottom: [
          [0, 90],
          [0, 180],
          [0, 270],
          [1, 90],
          [1, 180],
          [2, 90],
          [3],
          [3, 90],
        ],
        left: [
          [0],
          [0, 180],
          [0, 270],
          [1, 180],
          [1, 270],
          [2],
          [3, 90],
          [3, 180],
        ],
      }
    },
    {
      el: query('#tile-1'),
      sockets: {
        top: [
          [0, 180],
          [1, 90],
          [1, 180],
          [2],
          [3],
          [3, 90],
        ],
        right: [
          [0, 270],
          [1, 180],
          [1, 270],
          [2, 90],
          [3, 90],
        ],
        bottom: [
          [0, 90],
          [0, 180],
          [0, 270],
          [1, 90],
          [1, 180],
          [2, 90],
          [3],
          [3, 90],
        ],
        left: [
          [0],
          [0, 180],
          [0, 270],
          [1, 180],
          [1, 270],
          [2],
          [3, 90],
          [3, 180],
        ],
      }
    },
    {
      el:  query('#tile-2'),
      sockets: {
        top: [
          [0, 180],
          [1, 90],
          [1, 180],
          [2],
          [3],
          [3, 90],
        ],
        right: [
          [0],
          [0, 90],
          [0, 180],
          [1],
          [1, 90],
          [2],
          [3],
          [3, 270],
        ],
        bottom: [
          [0],
          [1],
          [1, 270],
          [2],
          [3, 180],
          [3, 270],
        ],
        left: [
          [0],
          [0, 180],
          [0, 270],
          [1, 180],
          [1, 270],
          [2],
          [3, 90],
          [3, 180],
        ],
      }
    },
    {
      el:  query('#tile-3'),
      sockets: {
        top: [
          [0, 90],
          [0, 180],
          [0, 270],
          [1],
          [1, 270],
          [2, 90],
          [3],
          [3, 90],
        ],
        right: [
          [0, 270],
          [1, 180],
          [1, 270],
          [2, 90],
          [3, 90],
          [3, 180],
        ],
        bottom: [
          [0],
          [1],
          [1, 270],
          [2],
          [3, 180],
          [3, 270],
        ],
        left: [
          [0],
          [0, 180],
          [0, 270],
          [1, 180],
          [1, 270],
          [2],
          [3, 90],
          [3, 180],
        ],
      }
    }
  ]
  const sockets = ['top', 'right', 'bottom', 'left']

  const pickSocket = (x, y, grid, limit = 10) => {
    if (limit < 1) {
      return undefined
    }
    let socket = randomFrom(sockets)
    const newX = socket === "left" ? x - 1 : socket === "right" ? x + 1 : x
    const newY = socket === "top" ? y - 1 : socket === "bottom" ? y + 1 : y
    if (newX < 1 || newX > numberCols - 1 || newY < 1 || newY > numberRows - 1) {
      return pickSocket(x, y, grid, limit - 1)
    }
    const cell = grid.getCell(newX, newY)
    if (!cell || cell.innerHTML !== "") {
      return pickSocket(x, y, grid, limit - 1)
    }
    return {
      newX, newY, socket, cell
    }
  }

  let interval
  const init = () => {
    let randomLimit = round(80 + random() * 20)
    clearInterval(interval)
    const grid = createGrid(numberRows, numberCols)
    container.innerHTML = ""
    container.appendChild(grid.table)
    let randomX = randomInt(1, numberCols)
    let randomY = randomInt(1, numberCols)
    const randomCell = grid.getCell(randomX, randomY)
    const tile = randomFrom(tiles)
    randomCell.appendChild(tile.el.content.cloneNode(true))
    interval = setInterval(() => {
      if (!grid.hasEmptyCells() || randomLimit-- < 0) {
        clearInterval(interval)
        return
      }
      const newSettings = pickSocket(randomX, randomY, grid)
      if (newSettings) {
        const { newX, newY, socket, cell } = newSettings
        randomX = newX
        randomY = newY
        const nextTileParams = randomFrom(tile.sockets[socket])
        const nextTile = getTile.apply(null, nextTileParams)
        cell.appendChild(nextTile)
      } else {
        randomX = randomInt(1, numberCols)
        randomY = randomInt(1, numberCols)
      }
    }, 1000/fps)
  }

  init()

  query('.masthead').addEventListener('click', init)
})({
  utils: window.utils
})
