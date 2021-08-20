//* Making A 2D Array
let cols = 30
let rows = 30
let grid = new Array(cols).fill(new Array(rows).fill(null))
let openSet = []
let closedSet = []
let start
let end
let w, h
let path = []
let WallChance = 30
let Repeat = true
let Stoped = false
let Done = false
function mousePressed() {
    grid.forEach((arr) => {
        arr.forEach((obj) => {
            obj.toggleWall()
        })
    })
}
document.querySelector("#Random").addEventListener(("click"), () => {
    Done = false
    WallChance = 30
    grid = new Array(cols).fill(new Array(rows).fill(null))
    openSet = []
    path = []
    closedSet = []
    setup()
    Repeat = false
    Stoped = false


})
document.querySelector("#Clear").addEventListener(("click"), () => {
    Done = false
    WallChance = 0
    grid = new Array(cols).fill(new Array(rows).fill(null))
    openSet = []
    closedSet = []
    path = []
    setup()
    Repeat = false
    Stoped = false

})
document.querySelector("#Start").addEventListener(("click"), () => {
    if (!Done) {

        Repeat = true
        Stoped = false
    }
})
document.querySelector("#Stop").addEventListener(("click"), () => {
    Repeat = false
    Stoped = true
})
document.querySelector("#Ten").addEventListener(("click"), () => {
    cols = 10
    rows = 10

})
document.querySelector("#Twenty").addEventListener(("click"), () => {
    cols = 20
    rows = 20
})
document.querySelector("#Thirty").addEventListener(("click"), () => {
    cols = 30
    rows = 30
})
//* Thing
function heuristic(a, b) {
    let d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
    return d
}
function between(x, min, max) {
    return x >= min && x <= max
}
class Stop {
    constructor(i, j) {
        this.x = i
        this.y = j
        this.f = 0
        this.g = 0
        this.h = 0
        this.neighbors = []
        this.previous = undefined
        this.wall = false
        if (Math.floor(Math.random() * 100) < WallChance) {
            if (this.x > 4 || this.y > 4) {

                this.wall = true

            }
        }

    }

    toggleWall = () => {
        const x = this.x * w
        const y = this.y * w
        if (mouseX > x && mouseX < x + w) {
            if (mouseY > y && mouseY < y + w) {
                this.wall = !this.wall
            }
        }
    }
    show = (col) => {
        fill(col)
        stroke(0)
        rect(this.x * w, this.y * h, w, h)
    };
    addNeighbors(grid) {
        var i = this.x
        var j = this.y
        if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j])
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j])
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1])
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1])
        }

    }
}

//* Call On Init
function setup() {
    createCanvas(801, 801)
    w = width / cols
    h = height / rows
    // Populating a 2D array

    grid = grid.map((arr, i) => {
        return arr.map((obj, j) => {
            return new Stop(i, j)
        })
    })
    grid.forEach((arr, i) => {
        arr.forEach((obj, j) => {
            grid[i][j].addNeighbors(grid)
        })
    })
    start = grid[0][0]
    end = grid[cols - 1][rows - 1]
    end.wall = false
    start.wall = false

    grid[cols - 1][rows - 2].wall = false
    grid[cols - 1][rows - 3].wall = false
    grid[cols - 2][rows - 1].wall = false
    grid[cols - 2][rows - 2].wall = false
    grid[cols - 2][rows - 3].wall = false
    grid[cols - 3][rows - 1].wall = false
    grid[cols - 3][rows - 2].wall = false
    grid[cols - 3][rows - 3].wall = false

    openSet.push(start)
}

//* Call On Frame
function draw() {
    background(0)
    grid.forEach((coll, i) => {
        coll.forEach((el, j) => {
            grid[i][j].show(color(255))
        })
    })
    if (Repeat) {
        if (openSet.length !== 0) {

            // Check node with lowest f
            let winner = 0
            for (var i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                    winner = i
                }
            }
            let current = openSet[winner]

            if (openSet[winner] === end) {
                // Find a path
                Repeat = false
                Done = true
                console.log("Done!")

            }
            openSet = openSet.filter(obj => obj !== current)
            closedSet.push(current)
            let neighbors = current.neighbors
            for (neighbor of neighbors) {
                if (!closedSet.includes(neighbor) && neighbor.wall === false) {
                    let tempG = current.g + heuristic(neighbor, current)
                    if (openSet.includes(neighbor)) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG
                        }
                    } else {
                        neighbor.g = tempG
                        openSet.push(neighbor)
                    }
                    neighbor.previous = current
                    neighbor.h = heuristic(neighbor, end)
                    neighbor.f = neighbor.g + neighbor.h

                }
            }
            path = [current]
            let temp = current
            while (temp.previous) {
                path.push(temp.previous)
                temp = temp.previous
            }
        } else {
            grid = new Array(cols).fill(new Array(rows).fill(null))
            openSet = []
            closedSet = []
            setup()
            loop()
        }
        closedSet.forEach((obj, i) => {
            obj && obj.show(color(255, 0, 0))
        })
        openSet.forEach((obj, i) => {
            obj.show(color(0, 255, 0))
        })
        path.forEach((obj) => {
            obj.show(color(0, 0, 255))
        })
    }
    if (Stoped) {
        closedSet.forEach((obj, i) => {
            obj && obj.show(color(255, 0, 0))
        })
        openSet.forEach((obj, i) => {
            obj.show(color(0, 255, 0))
        })
        path.forEach((obj) => {
            obj.show(color(0, 0, 255))
        })
    }
    if (Done) {
        path.forEach((obj) => {
            obj.show(color(0, 0, 255))
        })
    }

    grid.forEach((arr) => {
        arr.forEach((obj) => {
            if (obj.wall) {
                obj.show(color(0, 0, 0))
            }
        })
    })
}
