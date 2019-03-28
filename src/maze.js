import React, { Component } from "react";
import P5Wrapper from "react-p5-wrapper";

class Maze extends Component {
  gen_maze(p5) {
    //SETTINGS
    let canvasSize =
      p5.windowHeight - p5.windowWidth < 0
        ? p5.windowHeight - 20
        : p5.windowWidth - 20;
    let frameRate = 60;

    //MAZE_VARIABLES
    var row = [];
    var grid = [];

    var mazeComplexity = 50;
    var speed = (mazeComplexity * mazeComplexity) / 300;

    //ENSURE AN ODD NUMBER SIZE MAZE
    var mazeSize =
      mazeComplexity % 2 === 0 ? mazeComplexity + 1 : mazeComplexity;
    var cellSize = canvasSize / mazeSize;

    var stack = [];
    var current;

    //PLAYER VARS
    var isPassage = false;
    var passWait = 0;
    var updatePos;
    p5.myCustomRedrawAccordingToNewPropsHandler = props => {
      updatePos = props.updatePos;
    };

    class Player {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
      }

      move(d) {
        grid[this.x][this.y].showCell(255, 255, 255, 100);
        if (d === 0) this.y -= 1;
        if (d === 1) this.x += 1;
        if (d === 2) this.y += 1;
        if (d === 3) this.x -= 1;
        this.show();
        updatePos(this.x, this.y);
      }

      show() {
        var i = this.x * cellSize;
        var j = this.y * cellSize;
        p5.noStroke();
        p5.fill(p5.color(this.color));
        for (var idx = 0; idx < 15; idx++) {
          p5.rect(i + 3, j + 3, cellSize - 5, cellSize - 5);
        }
      }
    }

    var player = new Player(0, 0, "green");

    p5.setup = () => {
      p5.createCanvas(canvasSize + 1, canvasSize + 1); // Size must be the first statement
      p5.frameRate(frameRate);
      p5.background(255);
      for (var x = 0; x < mazeSize; x++) {
        for (var y = 0; y < mazeSize; y++) {
          var cell = new Cell(x, y);
          row.push(cell);
        }
        grid.push(row);
        row = [];
      }

      current = grid[0][0];
      current.visited = true;
    };

    class Cell {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = [true, true, true, true];
        this.visited = false;
        this.paths = 0;
      }

      checkNeighbors = () => {
        var neighbours = [];

        var top = grid[this.x][this.y - 1];
        if (this.x < mazeSize - 1) var right = grid[this.x + 1][this.y];
        var bottom = grid[this.x][this.y + 1];
        if (this.x > 0) var left = grid[this.x - 1][this.y];

        // Check for neighbors
        if (top && !top.visited) {
          neighbours.push(top);
        }
        if (right && !right.visited) {
          neighbours.push(right);
        }
        if (bottom && !bottom.visited) {
          neighbours.push(bottom);
        }
        if (left && !left.visited) {
          neighbours.push(left);
        }

        // If there are neighbors
        if (neighbours.length > 0) {
          var randomNeighbour = p5.floor(p5.random(0, neighbours.length));
          return neighbours[randomNeighbour];
        } else {
          return undefined;
        }
      };

      cellFill = (r, g, b) => {
        var x = this.x * cellSize;
        var y = this.y * cellSize;
        p5.push();
        p5.noStroke();
        p5.fill(r, g, b);
        p5.rect(x + 3, y + 3, cellSize - 5, cellSize - 5);
        p5.pop();
      };

      showCell = (r, g, b, a) => {
        var i = this.x * cellSize;
        var j = this.y * cellSize;
        p5.noStroke();
        p5.fill(r, g, b, a);
        for (var idx = 0; idx < 15; idx++) {
          p5.rect(i, j, cellSize, cellSize);
        }
        p5.stroke(0, 0, 0);

        if (this.walls[0]) {
          p5.line(i, j, i + cellSize, j);
        }
        if (this.walls[1]) {
          p5.line(i + cellSize, j, i + cellSize, j + cellSize);
        }
        if (this.walls[2]) {
          p5.line(i + cellSize, j + cellSize, i, j + cellSize);
        }
        if (this.walls[3]) {
          p5.line(i, j + cellSize, i, j);
        }
      };
    }

    function removeWalls(cellA, cellB) {
      var x = cellA.x - cellB.x;
      var y = cellA.y - cellB.y;

      //CellA is on the right
      if (x === 1) {
        cellA.walls[3] = false;
        cellB.walls[1] = false;
        cellA.paths++;
      }
      //CellA is on the left
      if (x === -1) {
        cellA.walls[1] = false;
        cellB.walls[3] = false;
        cellA.paths++;
      }
      //CellA is on the bottom
      if (y === 1) {
        cellA.walls[0] = false;
        cellB.walls[2] = false;
        cellA.paths++;
      }
      //CellA is on the top
      if (y === -1) {
        cellA.walls[2] = false;
        cellB.walls[0] = false;
        cellA.paths++;
      }
    }

    //Display grid
    p5.draw = function() {
      var next;
      for (var i = 0; i < speed; i++) {
        current.showCell(255, 255, 255, 100);
        next = current.checkNeighbors();
        if (next) {
          next.visited = true;
          stack.push(current);
          removeWalls(current, next);
          current = next;
        } else if (stack.length > 0) {
          current = stack.pop();
        } else {
        }
      }
      grid[p5.floor(mazeSize / 2)][p5.floor(mazeSize / 2)].showCell(
        0,
        200,
        25,
        1
      );
      player.show();

      if (!isPassage) {
        if (
          p5.keyIsPressed === true &&
          p5.keyCode === p5.UP_ARROW &&
          grid[player.x][player.y].walls[0] === false
        ) {
          player.move(0);
        } else if (
          p5.keyIsPressed === true &&
          p5.keyCode === p5.DOWN_ARROW &&
          grid[player.x][player.y].walls[2] === false
        ) {
          player.move(2);
        } else if (
          p5.keyIsPressed === true &&
          p5.keyCode === p5.LEFT_ARROW &&
          grid[player.x][player.y].walls[3] === false
        ) {
          player.move(3);
        } else if (
          p5.keyIsPressed === true &&
          p5.keyCode === p5.RIGHT_ARROW &&
          grid[player.x][player.y].walls[1] === false
        ) {
          player.move(1);
        }
        isPassage = true;
      }
      // console.log(grid[player.x][player.y].paths)
      if (passWait % 10 === 0 || !p5.keyIsPressed) {
        isPassage = false;
        passWait = 0;
      }
      passWait++;
    };

    p5.mouseClicked = function(e) {
      this.updatePos(player.x, player.y);
    };
  }

  state = {
    playerx: 0,
    playery: 0
  };

  handleUpdate = (x, y) => {
    this.setState({
      playerx: x,
      playery: y
    });
    console.log("player-position", this.state.playerx, this.state.playery);
  };

  render() {
    return (
      <div>
        <P5Wrapper sketch={this.gen_maze} updatePos={this.handleUpdate} />
      </div>
    );
  }
}

export default Maze;
