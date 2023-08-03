'use strict'
console.clear


const GAME_FREQ = 1000

const BOMB = '💣' // BOMB is a MINE
const FLAG = '📍'
const ONE = '1️⃣'
const TWO = '2️⃣'
const THREE = '3️⃣'
const FOUR = '4️⃣'
const FIVE = '5️⃣'


var gGameInterval = 0

// The Model
var isFirstClick = true

var gBoard = [
]

var gLevel = {
    SIZE: 4,
    MINES: 0
}

var gGame = {
    isOn: false, //Boolean, when true we let the user play
    showCount: 0, //How many cells are shown
    markedCount: 0, //How many cells are marked (with a flag)
    secsPassed: 0 //How many seconds passed
}

function onInit() {
    console.log('in <onInit>')
    gBoard = buildBoard()

    renderBoard(gBoard)
    // play()
}

function toggleGame(elBtn) {

    if (gGameInterval) {
        clearInterval(gGameInterval)
        gGameInterval = 0
        elBtn.innerText = 'Resume Game'
    } else {
        gGameInterval = setInterval(play, GAME_FREQ)
        console.log('gGameInterval: ', gGameInterval)
        elBtn.innerText = 'Pause Game'
    }
}

function play() {
    gBoard = placeElementsOnBoard(gBoard)
    renderBoard(gBoard)
}

// Builds the board ,Set the mines, Call setMinesNegsCount() ,Return the created board
//
function buildBoard() {
    console.log('<in: buildBoard>')
    var board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []

        for (var j = 0; j < gLevel.SIZE; j++) {
            //board[i][j] = (Math.random() > 0.95) ? BOMB : ''
            board[i][j] = {
                type: '',
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            
        }
    }// outer 'for'


    setMinesRandomly(board, 1)
    setMinesNegsCount(board)


    updateNumOfNeighborsOnBoard()
    board[0][0].type = BOMB
    board[0][0].isShown = true
    board[0][0].isMine = true

    board[2][1].type = BOMB
    board[2][1].isShown = true
    board[2][1].isMine = true

    board[1][1].type = BOMB
    board[1][1].isShown = true
    board[1][1].isMine = true


    setNeighboursCountOnBoard(board)


    //console.log('current BOARD looks like this: ', board)
    return board;
}
//Update the renderBoard() function to also display the neighbor count and the mines
function renderBoard(board) {
    console.log('<in: renderBoard>')
    setMinesNegsCount(board)
    updateTotalNumOfMines()

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < board[i].length; j++) {
            //var currentNumOfBombs = calcNumOfMinesAroundCount(board, i, j)

            //console.log('num of bombs around location ['+i,','+j+'] is: '+currentNumOfBombs) // works
            const classStr = board[i][j] ? `class="occupied"` : ''
            const dataAttrStr = `data-i="${i}" data-j="${j}"`
            strHTML += `\t<td ${dataAttrStr} onclick="onCellClicked(this, ${i}, ${j})" ${classStr}>${board[i][j].type}</td>\n`
        }
        strHTML += `</tr>\n`
    }
    const elTable = document.querySelector('.board')
    elTable.innerHTML = strHTML
    //console.log('BOARD: ',board)
    return board
}



// function recreateBoard(board) {
//     var newBoard = copyMat(board)

//     for (var i = 0; i < board.length; i++) {
//         for (var j = 0; j < board[0].length; j++) {

//             var numOfNeighbors = countNeighbors(i, j, board)

//             if ((numOfNeighbors > 2) && (numOfNeighbors < 6)) {
//                 if (board[i][j] === '') newBoard[i][j] = LIFE
//             } else if (board[i][j] === LIFE) {
//                 newBoard[i][j] = ''
//             }
//         }
//     }
//     return newBoard
// }

//Count mines around each cell and set the cell's minesAroundCount.


function setMinesNegsCount() { // V
    console.log('<in: setMinesNegsCount>')
    // for every cell in gBoard: checking number of neighbours which are   equal to 'BOMB' & updating model.
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            //return number of mines around  cell in 'rowIdx, colIdx'
            //and set the cell's minesAroundCount.
            gBoard[i][j].minesAroundCount = calcNumOfMinesAroundCount(gBoard, i, j)

        }
    }
}

//return number of mines around  cell in 'rowIdx, colIdx'
function calcNumOfMinesAroundCount(mat, rowIdx, colIdx) { //V
    console.log('<in: calcNumOfMinesAroundCount>')
    var numOfBombsAround = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j].type === BOMB) {
                numOfBombsAround++
            }
        }
    }
    return numOfBombsAround
}

//
function updateNumOfCurrentNeighbors(mat, rowIdx, colIdx) { //V
    console.log('<in: updateNumOfCurrentNeighbors>')
    // update model
    gBoard[rowIdx][colIdx].minesAroundCount = calcNumOfMinesAroundCount(gBoard, rowIdx, colIdx);
    // update dom
    document.querySelector('.numOfNegs').innerText = gBoard[rowIdx][colIdx].minesAroundCount
}


//Called when a cell is right- clicked See how you can h ide the context
// menu on right click
function onCellMarked(elCell) { }

function checkGameOver() { }

function expandShown(board, elCell, i, j) { }


function updateTotalNumOfMines() {
    var counter = 0
    console.log('<in: updateTotalNumOfMines>')
    // console.log(gLevel.MINES   )
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].type === BOMB && gBoard[i][j].isMine) {
                counter++
                // update model     
                gLevel.MINES = counter
            }
        }
    }
    // update dom
    document.querySelector('.numOfMines').innerText = gLevel.MINES
    // console.log('glevel.MINES: ', gLevel.MINES)
}


function onCellClicked(elCell, i, j) {

    console.log('<in: onCellClicked>')
    const cell = gBoard[i][j]
    console.log('Cell clicked: ', elCell, i, j)
    updateNumOfCurrentNeighbors(gBoard, i, j)

     toggleCellVisibility(i, j)

    elCell.classList.add('selected')
}

function setMinesRandomly(board, numOfMines) {
    console.log('<in: setMinesRandomly>')

    // console.log('gLevel.MINES: ', gLevel.MINES)
    for (var i = 0; i < numOfMines; i++) {
        var tempXPos = getRandomIntInclusive(0, board.length - 1)
        var tempYPos = getRandomIntInclusive(0, board.length - 1)
        // console.log('x,y: ', tempXPos+','+tempYPos)

        board[tempXPos][tempYPos].type = BOMB
        board[tempXPos][tempYPos].isMine = true
        gLevel.MINES++

        // console.log('numOfMines: ',numOfMines) // V
        // console.log('gLevel.MINES: ', gLevel.MINES)
    }

}

//Called when a cell is right- clicked See how you can hide the context menu on right click
function onCellMarked(elCell) {

}

function revealCellArea(i, j) {
    
    var elClassName= getClassName(i,j)
    console.log('elClassName ',elClassName)
    console.log('i ',i)
    console.log('j' ,j)
    //if (elClassName.includes('revealed')

    console.log('<in: revealCellArea>')
    var elCurrentCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    console.log(elCurrentCell)
    elCurrentCell.classList.remove('hidden')
    elCurrentCell.classList.add('cell')
}

function hideCellArea(i, j) {
    console.log('<in: hideCellArea>')
    var elCurrentCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCurrentCell.classList.remove('cell')
    elCurrentCell.classList.add('hidden')
}


function setNeighboursCountOnBoard(board) {
    console.log('<in: setNeighboursCountOnBoard>')

    //for each cell in board (2d) calculate its 'bomb' neigbors and set the correct mark
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currentCell = board[i][j]
            if (currentCell.type === BOMB || currentCell.isMine) {
                continue;
            }
            var minesCounter = 0
            //count neighbor cells
            for (var m = i - 1; m <= i + 1; m++) {
                if (m < 0 || m >= board.length) continue;
                for (var n = j - 1; n <= j + 1; n++) {
                    if (m === i && n === j) continue;
                    if (n < 0 || n >= board[0].length) continue;

                    if (board[m][n].type === BOMB) {
                        minesCounter++
                    }
                }//inner 'for'
            }//outer 'for'

            currentCell.minesAroundCount = minesCounter
            //placing numbers on board
            switch (currentCell.minesAroundCount) {
                case 1:
                    currentCell.type = ONE
                    break;
                case 2:
                    currentCell.type = TWO
                    break;
                case 3:
                    currentCell.type = THREE
                    break;
                case 4:
                    currentCell.type = FOUR
                    break;
                case 5:
                    currentCell.type = FIVE
                    break;
                default:
                    console.log('default')
                    break;
            }//switch-case


        }
    }

}//setNeighboursCountOnBoard



// function setNeighboursCountOnBoard(board) {
//     console.log('<in: setNeighboursCountOnBoard>');

//     for (var i = 0; i < board.length; i++) {
//         for (var j = 0; j < board[0].length; j++) {
//             const cell = board[i][j];

//             // Skip if the current cell is a bomb
//             if (cell.type === BOMB) {
//                 continue;
//             }


//             var mineCount = 0;

//             // go through neighbor cells
//             for (var x = i - 1; x <= i + 1; x++) {
//                 for (var y = j - 1; y <= j + 1; y++) {
//                     if (x === i && y === j) {
//                         continue; // Skip the current cell
//                     }

//                     if (isValidCell(board, x, y) && board[x][y].type === BOMB) {
//                         mineCount++;
//                     }
//                 }
//             }

//             // Set minesAroundCount
//             cell.minesAroundCount = mineCount;

//             // Mark bomb area with numbers
//             switch (cell.minesAroundCount) {
//                 case 1:
//                     cell.type = ONE;
//                     break;
//                 case 2:
//                     cell.type = TWO;
//                     break;
//                 case 3:
//                     cell.type = THREE;
//                     break;
//                 case 4:
//                     cell.type = FOUR;
//                     break;
//                 case 5:
//                     cell.type = FIVE;
//                     break;
//                 default:
//                     console.log('default');
//                     break;
//             }
//         }
//     }

//     console.log('board is: ', board);
//     console.log('END of <setNeighboursCountOnBoard>');
// }



function updateNumOfNeighborsOnBoard(board, i, j) {

}

function setLevel ()
    {
        alert ('doing nothing, so far')
    }

    function resetGame ()
    {
        alert ('this also does nothing, so far')
    }


    function toggleCellVisibility(i, j) {
        var cell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
        cell.classList.toggle('hidden');
    }