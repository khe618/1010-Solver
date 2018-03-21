/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+R),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+I), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+L)
 */
var BLOCK1 = [[1]]
var BLOCK2 = [[1,1],[1,1]]
var BLOCK3 = [[1,1,1],[1,1,1],[1,1,1]]
var ROW2 = [[1,1]]
var ROW3 = [[1,1,1]]
var ROW4 = [[1,1,1,1]]
var ROW5 = [[1,1,1,1,1]]
var COLUMN2 = [[1],[1]]
var COLUMN3 = [[1],[1],[1]]
var COLUMN4 = [[1],[1],[1],[1]]
var COLUMN5 = [[1],[1],[1],[1],[1]]
var SL1 = [[1,1],[1,0]]
var SL2 = [[1,1],[0,1]]
var SL3 = [[0,1],[1,1]]
var SL4 = [[1,0],[1,1]]
var BL1 = [[1,1,1],[1,0,0],[1,0,0]]
var BL2 = [[1,1,1],[0,0,1],[0,0,1]]
var BL3 = [[0,0,1],[0,0,1],[1,1,1]]
var BL4 = [[1,0,0],[1,0,0],[1,1,1]]
var grid = Array(10)
for (var i = 0; i < 10; i++){
  grid[i] = Array(10).fill(0)
}
function copy(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
   }
   return output;
}
function permute(arr){
  if (arr.length <= 1)
    return arr
  var temp = [[arr[0]]]
  var permutations;
  var temp_arr;
  for (var i = 1; i < arr.length; i++){
    permutations = []
    for (var item of temp){
      for (var j = 0; j <= i; j++){
        temp_arr = item.slice()
        temp_arr.splice(j, 0, arr[i])
        permutations.push(temp_arr)
      }
    }
    temp = permutations.slice()
  }
  return permutations
}
function getColumn(matrix, n){
  return matrix.map(x => x[n])
}
function getNeighbors(matrix, x, y){
  var sum = 0
  if (x > 0){
    sum += 1 - matrix[y][x - 1]
  }
  if (x < 9){
    sum += 1 - matrix[y][x + 1]
  }
  if (y > 0){
    sum += 1 - matrix[y - 1][x]
  }
  if (y < 9){
    sum += 1 - matrix[y + 1][x]
  }
  return sum 
}
function isValidPlacement(matrix, piece, x, y){
  if (y + piece.length > 10 || x + piece[0].length > 10 || y < 0 || x < 0){
    return false
  }
  for (var i = 0; i < piece.length; i++){
    for (var j = 0; j < piece[0].length; j++){
      if (piece[i][j] + matrix[y + i][x + j] == 2){
        return false
      }
    }
  }
  return true 
}
function calculateScore(matrix){
  var score = 0
  var neighbors;
  for (var i = 0; i < matrix.length; i++){
    if (matrix[i].includes(1)){
      score += 2
    }
    for (var j = 0; j < matrix[0].length; j++){
      if (i == 0 && getColumn(matrix, j).includes(1)){
        score += 2
      }
      neighbors = getNeighbors(matrix, j, i)
      if (matrix[i][j] == 1){
        score += 1 + neighbors
      }
      else if (neighbors == 0){
        score += 5
      }
    }
  }
  return score
}
function placePiece(matrix, piece, x, y){
  var temp = JSON.parse(JSON.stringify(matrix))
  for (var i = 0; i < piece.length; i++){
    for (var j = 0; j < piece[0].length; j++){
      temp[y + i][x + j] += piece[i][j]
    }
  }
  return temp
}
function clearCompletions(matrix){
  var rows = []
  for (var i = 0; i < 10; i++){
    if (matrix[i].reduce((a,b) => a + b, 0) == 10){
      rows.push(i)
    }
  }
  for (var i = 0; i < 10; i++){
    if (getColumn(matrix, i).reduce((a,b) => a + b, 0) == 10){
      for (var j = 0; j < 10; j++){
        matrix[j][i] = 0
      }
    }
  }
  for (var row of rows){
    matrix[row].fill(0)
  }
  return matrix
}
function findPlacements(matrix, piece){
  var options = []
  for (var i = 0; i < matrix.length; i++){
    for (var j = 0; j < matrix[0].length; j++){
      if (isValidPlacement(matrix, piece, j, i)){
        options.push([calculateScore(clearCompletions(placePiece(matrix, piece, j, i))), j, i, piece])
      }
    }
  }
  if (options.length > 0){
    options.sort((a,b) => a[0] - b[0])
    /*if (options.length < 5){
      return options
    }
    return options.slice(0, 5)*/
    return options[0]
  }
  return null
}
function greedyPlacements(matrix, piece1, piece2, piece3){
  
  var permutations = permute([piece1, piece2, piece3])
  var options = []
  var temp, nextPlacement, flag, placements
  for (var permutation of permutations){
    temp = JSON.parse(JSON.stringify(matrix))
    flag = false
    placements = []
    for (var piece of permutation){
      nextPlacement = findPlacements(temp, piece)
      if (nextPlacement){
        temp = placePiece(temp, piece, nextPlacement[1], nextPlacement[2])
        temp = clearCompletions(temp)
        placements.push(nextPlacement)
      }
      else{
        flag = true
        break
      }
    }
    if (!flag){
      placements.unshift(calculateScore(temp))
      options.push(placements)
    }
  }
  if (options.length > 0){
    options.sort((a,b) => a[0] - b[0])
    playPlacements(options[0])
    placements = []
    for (var i = 1; i < 4; i++){
      placements.push(options[0][i].slice(1))
    }
    return placements
  }
  return null
}
function playPlacements(placements){
  for (var i = 1; i < placements.length; i++){
    grid = placePiece(grid, placements[i][3], placements[i][1], placements[i][2])
    grid = clearCompletions(grid)
  }
  return grid
}
greedyPlacements(grid, COLUMN2, COLUMN3, BLOCK2)
/*
6,0,1,1,1,7,0,1,1,8,0,1,1,1,1
*/

/*grid[0] = [0,0,0,0,0,0,0,0,0,0]
grid[1] = [0,0,0,0,0,0,0,0,0,0]
grid[2] = [0,0,0,0,0,0,0,0,0,0]
grid[3] = [0,0,0,0,0,0,0,0,0,0]
grid[4] = [0,0,0,0,0,1,1,1,1,1]
grid[5] = [0,0,0,0,0,0,1,1,1,1]
grid[6] = [0,0,0,0,0,1,1,1,1,1]
grid[7] = [0,0,0,0,0,1,1,1,1,1]
grid[8] = [0,0,0,0,0,1,1,1,1,1]
grid[9] = [0,0,0,0,0,1,1,1,1,1]*/
grid

