//* Making A 2D Array
let cols = 10 
let rows = 10
let grid = new Array(cols).fill(new Array(rows).fill(null))
let openSet;    // PriorityQueue
let closedSet;  // Set
let start
let end
let w, h
let path = []
let WallChance = 34
let Repeat = true
let Stoped = false
let Done = false
// ------------------------------------------------------
// Maze Generation: returns a 2D array of 1s and 0s
//   1 -> Wall (black)
//   0 -> Open space (white)
// ------------------------------------------------------
function generateMazeBinary(rows, cols) {
    // 1) Create internal "Cell" structures to track walls & visited status
    const cells = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        cells.push(new Cell(i, j));
      }
    }
  
    // 2) Depth-first search (DFS) to carve out a perfect maze
    const stack = [];
    const startIndex = 0; // e.g. top-left cell, or pick random if you wish
    const startCell = cells[startIndex];
    startCell.visited = true;
    let current = startCell;
    let visitedCount = 1;
    const totalCells = rows * cols;
  
    while (visitedCount < totalCells) {
      // 2a) Check for an unvisited neighbor
      const next = current.getUnvisitedNeighbor(cells, cols, rows);
      if (next) {
        // We found an unvisited neighbor: push current to stack
        stack.push(current);
  
        // Mark neighbor visited
        next.visited = true;
        visitedCount++;
  
        // Remove walls between current & next
        removeWalls(current, next);
  
        // Move to neighbor
        current = next;
      } else if (stack.length > 0) {
        // 2b) Backtrack
        current = stack.pop();
      }
    }
  
    // 3) Convert the carved maze into a 2D array of 1 (wall) and 0 (open)
    // Dimensions: (2*rows + 1) × (2*cols + 1)
    const maze = Array.from({ length: 2 * rows + 1 }, () =>
      Array(2 * cols + 1).fill(1) // Initialize everything as wall
    );
  
    // For each cell, carve out the corresponding positions in the final matrix
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const cell = cells[index(i, j, cols)];
        // Map cell (i, j) into the maze array coords
        // "Center" of this cell in the final array:
        const x = 2 * i + 1;
        const y = 2 * j + 1;
  
        // The cell interior is open
        maze[y][x] = 0;
  
        // If no top wall, open the space above
        if (!cell.walls[0]) {
          maze[y - 1][x] = 0;
        }
        // If no right wall, open the space to the right
        if (!cell.walls[1]) {
          maze[y][x + 1] = 0;
        }
        // If no bottom wall, open the space below
        if (!cell.walls[2]) {
          maze[y + 1][x] = 0;
        }
        // If no left wall, open the space to the left
        if (!cell.walls[3]) {
          maze[y][x - 1] = 0;
        }
      }
    }
  
    return maze; // 2D array of 1 (wall) and 0 (open)
  }
  
  // ------------------------------------------------------
  // Helper: array index for the cells[] one-dimensional
  // ------------------------------------------------------
  function index(i, j, cols) {
    return i + j * cols;
  }
  
  // ------------------------------------------------------
  // The "Cell" class used for internal carving
  // walls = [top, right, bottom, left] -> booleans
  // visited = whether we've visited during DFS
  // ------------------------------------------------------
  class Cell {
    constructor(i, j) {
      this.i = i;
      this.j = j;
      // By default, all walls exist
      this.walls = [true, true, true, true];
      this.visited = false;
    }
  
    // Return a random unvisited neighbor
    getUnvisitedNeighbor(cellArray, cols, rows) {
      const neighbors = [];
  
      // Top neighbor =>    (i, j-1)
      if (this.j > 0) {
        const top = cellArray[index(this.i, this.j - 1, cols)];
        if (!top.visited) neighbors.push(top);
      }
      // Right neighbor =>  (i+1, j)
      if (this.i < cols - 1) {
        const right = cellArray[index(this.i + 1, this.j, cols)];
        if (!right.visited) neighbors.push(right);
      }
      // Bottom neighbor => (i, j+1)
      if (this.j < rows - 1) {
        const bottom = cellArray[index(this.i, this.j + 1, cols)];
        if (!bottom.visited) neighbors.push(bottom);
      }
      // Left neighbor =>   (i-1, j)
      if (this.i > 0) {
        const left = cellArray[index(this.i - 1, this.j, cols)];
        if (!left.visited) neighbors.push(left);
      }
  
      if (neighbors.length > 0) {
        const r = Math.floor(Math.random() * neighbors.length);
        return neighbors[r];
      }
      return null;
    }
  }
  
  // ------------------------------------------------------
  // removeWalls(a, b):
  //   Given two adjacent cells 'a' and 'b', remove the shared wall
  //   a.walls: [top, right, bottom, left]
  // ------------------------------------------------------
  function removeWalls(a, b) {
    const x = a.i - b.i;
    if (x === 1) {
      // b is left of a
      a.walls[3] = false; // a's left
      b.walls[1] = false; // b's right

    } else if (x === -1) {
      // b is right of a
      a.walls[1] = false; // a's right
      b.walls[3] = false; // b's left
      if(Math.random() > 0.3){
        b.walls[1] = false; // b's left
        b.walls[3] = true; // b's left

      }
    }
  
    const y = a.j - b.j;
    if (y === 1) {
      // b is above a
      a.walls[0] = false; // a's top
      b.walls[2] = true; // b's bottom
      if(Math.random() > 0.9){
      a.walls[0] = true; // a's top

      }
    } else if (y === -1) {
      // b is below a
      a.walls[2] = true; // a's bottom
      b.walls[0] = false; // b's top
    }
  }
  
class PriorityQueue {
    constructor() {
      this.heap = [];
    }
  
    push(node) {
      this.heap.push(node);
      this.bubbleUp();
    }
  
    pop() {
      // Swap first and last, pop last (which is min after swap)
      this.swap(0, this.heap.length - 1);
      const popped = this.heap.pop();
      this.bubbleDown();
      return popped;
    }
  
    // Return number of elements
    size() {
      return this.heap.length;
    }
  
    // --- Helper methods for heap mechanics ---
    bubbleUp() {
      let index = this.heap.length - 1;
      while (index > 0) {
        let parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[index].f >= this.heap[parentIndex].f) {
          break;
        }
        this.swap(index, parentIndex);
        index = parentIndex;
      }
    }
  
    bubbleDown() {
      let index = 0;
      const length = this.heap.length;
      while (true) {
        let leftIndex = 2 * index + 1;
        let rightIndex = 2 * index + 2;
        let swapIndex = null;
  
        // Compare left child
        if (leftIndex < length) {
          if (this.heap[leftIndex].f < this.heap[index].f) {
            swapIndex = leftIndex;
          }
        }
        // Compare right child
        if (rightIndex < length) {
          if (
            (swapIndex === null && this.heap[rightIndex].f < this.heap[index].f) ||
            (swapIndex !== null && this.heap[rightIndex].f < this.heap[leftIndex].f)
          ) {
            swapIndex = rightIndex;
          }
        }
        if (swapIndex === null) break;
        this.swap(index, swapIndex);
        index = swapIndex;
      }
    }
  
    swap(i, j) {
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
  }
  
function mousePressed() {
    grid.forEach((arr) => {
        arr.forEach((obj) => {
            obj.toggleWall()
        })
    })
}
function mouseDragged() {
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
class Stop {
    constructor(i, j, t) {
        this.x = i
        this.y = j
        this.f = 0
        this.g = 0
        this.h = 0
        this.neighbors = []
        this.previous = undefined
        this.wall = false


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
document.querySelector("#Ten").addEventListener(("click"), () => {
    cols = 10
    rows = 10

})
document.querySelector("#Twenty").addEventListener(("click"), () => {
    cols = 20
    rows = 20
})
document.querySelector("#Thirty").addEventListener(("click"), () => {
    cols = 100
    rows = 100
})
//* Thing
function createGrid(cols, rows) {
    const arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }
  const mazeArray = generateMazeBinary(100, 100);

// Now let's create your A* grid for pathfinding:
 rows = mazeArray.length;      // 2*20 + 1 = 41
 cols = mazeArray[0].length;   // 2*20 + 1 = 41

// You might store your A* nodes in a 2D array "grid" of size rows×cols
 grid = new Array(rows);
 console.log(grid)
for (let i = 0; i < rows; i++) {
  grid[i] = new Array(cols);
  for (let j = 0; j < cols; j++) {
    grid[i][j] = new Stop(i, j,mazeArray[i][j]);  // or whatever your A* 'Node' or 'Stop' class is
    // Mark walls
    if (mazeArray[i][j] === 1) {
      grid[i][j].wall = true;  // black cell => wall
    } else {
      grid[i][j].wall = false; // white cell => free space
    }
  }
}

function heuristic(a, b) {
    let d = (Math.abs(a.x - b.x) + Math.abs(a.y - b.y))
    return d
}
function between(x, min, max) {
    return x >= min && x <= max
}


//* Call On Init
function setup() {
    createCanvas(2000, 2000);
    w = width / cols;
    h = height / rows;
  
    // Create a proper 2D array (so each cell is unique)

  
    // Add neighbors for each Stop
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j].addNeighbors(grid);
      }
    }
  
    start = grid[1][1];
    end = grid[cols - 2][rows - 2];
  
    // Force start/end to not be walls
    end.wall = false;
    start.wall = false;
  
    // Force clearing around the end
    grid[cols - 1][rows - 2].wall = false;
    grid[cols - 1][rows - 3].wall = false;
    grid[cols - 2][rows - 1].wall = false;
    grid[cols - 2][rows - 2].wall = false;
    grid[cols - 2][rows - 3].wall = false;
    grid[cols - 3][rows - 1].wall = false;
    grid[cols - 3][rows - 2].wall = false;
    grid[cols - 3][rows - 3].wall = false;
  
    // Initialize the priority queue and the closedSet
    openSet = new PriorityQueue();
    closedSet = new Set();
  
    // Push the start node into the openSet
    openSet.push(start);
  
    // Show walls once at the beginning
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j].wall) {
          grid[i][j].show(color(0, 0, 0));
        }
      }
    }
  }

//* Call On Frame
function draw() {
    const rand = Math.random();
  
    if (Repeat) {
      // If we still have nodes to explore in the open set
      if (openSet.size() > 0) {
        // Pop the node with the lowest f-value
        const current = openSet.pop();
  
        // Check if we've reached the end
        if (current === end) {
          Repeat = false;
          Done = true;
          console.log("Done!");
        }
  
        // Add current node to closedSet so it won't be processed again
        closedSet.add(current);
  
        // Check all neighbors
        const neighbors = current.neighbors;
        for (let neighbor of neighbors) {
          // Only process if not in closedSet and not a wall
          if (!closedSet.has(neighbor) && !neighbor.wall) {
            // This is the g cost from current to neighbor
            let tempG = current.g + heuristic(neighbor, current);
  
            // If neighbor.g is 0 or we find a shorter path
            // (You could do a membership check in openSet here,
            // but for simplicity, we'll just update and push.)
            if (neighbor.g === 0 || tempG < neighbor.g) {
              neighbor.g = tempG;
              neighbor.previous = current;
  
              // Weighted heuristic
              neighbor.h = heuristic(neighbor, end) **2;
              neighbor.f = neighbor.g + neighbor.h;
  
              // Push this neighbor into the priority queue
              // (Even if it's already there, we might have found a better path,
              // so we allow duplicates. The closedSet will keep it from reprocessing.)
              openSet.push(neighbor);
            }
          }
        }
  
        // Reconstruct path for drawing
        path = [];
        let temp = current;
        path.push(temp);
        while (temp.previous) {
          path.push(temp.previous);
          temp = temp.previous;
        }
      } else {
        // If no nodes left, no valid path found. You re-init your grid here:
        console.log("No Solution");
        grid = [];
        openSet = null;
        closedSet = null;
        setup();
      }
  
      // Drawing (skip some frames if you want better performance)
      if (rand > 0) {
        // closedSet is now a Set, so iterate differently
        for (const c of closedSet) {
          c.show(color(255, 0, 0));
        }
        // openSet is a PriorityQueue; we can draw everything inside it if you want:
        for (const o of openSet.heap) {
          o.show(color(0, 255, 0));
        }
        // Draw the current path in blue
        for (const p of path) {
          p.show(color(0, 0, 255));
        }
      }
    }
  
    // If we pressed "Stop"
    if (Stoped) {
      for (const c of closedSet) {
        c.show(color(255, 0, 0));
      }
      for (const o of openSet.heap) {
        o.show(color(0, 255, 0));
      }
      for (const p of path) {
        p.show(color(0, 0, 255));
      }
    }
  
    // If we're done, draw the final path in blue
    if (Done) {
      for (const p of path) {
        p.show(color(0, 0, 255));
      }
    }
  }