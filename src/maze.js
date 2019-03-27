import React, { Component } from "react";
import P5Wrapper from "react-p5-wrapper";

class Maze extends Component {
  gen_maze(p5) {
    //SETTINGS
    let canvasSize = 1000;
    let frameRate = 30;

    //MAZE_VARIABLES
    var row = [];
    var grid = [];

    var mazeComplexity = 30;

    //ENSURE AN ODD NUMBER SIZE MAZE
    var mazeSize = mazeComplexity % 2 === 0 ? mazeComplexity + 1 : mazeComplexity;
    var cellSize = canvasSize / mazeSize;

    // The statements in the setup() function
    // execute once when the program begins

    p5.setup = () => {
      p5.createCanvas(canvasSize + 1, canvasSize + 1); // Size must be the first statement
      p5.frameRate(frameRate);
      p5.background(0);

      //Program draw will not loop. Only loops on redraw()
      p5.noLoop();

      for (var x = 0; x < mazeSize; x++) {
        for (var y = 0; y < mazeSize; y++) {
          var cell = new Cell(x, y);
          row.push(cell);
        }
        grid.push(row);
        row = [];
      }

    //   console.table(grid);
    };

    class Cell {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = [true, true, true, true];
        this.visited = false;
      }

      checkNeighbors = () => {
        var neighbours = [];

        var top = grid[this.x][this.y - 1];
        var right = grid[this.x + 1][this.y];
        var bottom = grid[this.x][this.y + 1];
        var left = grid[this.x - 1][this.y];

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

      fill = (r, g ,b) => {
        var x = this.x * cellSize;
        var y = this.y * cellSize;
        p5.push();
        p5.fill(r, g, b);
        p5.rect(x+ 3, y + 3, cellSize - 5, cellSize- 5);
        p5.noStroke();
        p5.pop();
      };

      showCell = () => {
        var i = this.x * cellSize;
        var j = this.y * cellSize;
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

        if (this.visited) {
          p5.noStroke();
          p5.rect(i, j, cellSize, cellSize);
        }
      };
    }

    // The statements in draw() are executed until the
    // program is stopped. Each statement is executed in
    // sequence and after the last line is read, the first
    // line is executed again.
    p5.draw = function() {
      for (var x = 0; x < mazeSize; x++) {
        for (var y = 0; y < mazeSize; y++) {
            grid[x][y].showCell();
            // grid[x][y].fill(p5.floor(p5.random(0, 255)),p5.random(0, 255),p5.random(0, 255));
            var col = p5.random(0, 255);
            grid[x][y].fill(col,col,col);

        }
      }
    };

    //Redraw only on mouse press
    p5.mousePressed = function() {
        p5.redraw();
    };

    
  }

  render() {
    return (
      <div>
        <P5Wrapper sketch={this.gen_maze} />
      </div>
    );
  }
}

export default Maze;
