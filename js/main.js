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
    MINES: 2
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


    setMines(board, gLevel.MINES)
    updateNumOfMines()
    setMinesNegsCount(board)
    setNeighboursCountOnBoard(board)
    updateNumOfNeighborsOnBoard()
    board[0][0].type = BOMB
    board[2][1].type = BOMB
    board[0][0].isShown = true
    board[2][1].isShown = true
    board[0][0].isMine = true
    board[2][1].isMine = true


    console.log('BOARD: ', board)
    return board;
}
//Update the renderBoard() function to also display the neighbor count and the mines
//
function renderBoard(board) {
    console.log('<in: renderBoard>')
    setMinesNegsCount(board)
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




function recreateBoard(board) {
    var newBoard = copyMat(board)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            var numOfNeighbors = countNeighbors(i, j, board)

            if ((numOfNeighbors > 2) && (numOfNeighbors < 6)) {
                if (board[i][j] === '') newBoard[i][j] = LIFE
            } else if (board[i][j] === LIFE) {
                newBoard[i][j] = ''
            }
        }
    }
    return newBoard
}

//Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount() { // V
    console.log('<in: setMinesNegsCount>')
    // for every cell in gBoard: checking number of neighbours which are   equal to 'BOMB' & updating model.
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            //return number of mines around  cell in 'rowIdx, colIdx'
            //and set the cell's minesAroundCount.
            gBoard[i][j].minesAroundCount = calcNumOfMinesAroundCount(gBoard, i, j)
            //console.log(gBoard[1][1].minesAroundCount)            
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

//
function updateNumOfMines() {
    console.log('<in: updateNumOfMines>')
    // update model
    gLevel.MINES = calcNumOfMinesAroundCount()
    // update dom
    document.querySelector('.numOfMines').innerText = gLevel.MINES
}
function onCellClicked(elCell, i, j) {

    console.log('<in: onCellClicked>')
    const cell = gBoard[i][j]
    console.log('Cell clicked: ', elCell, i, j)
    updateNumOfCurrentNeighbors(gBoard, i, j)


    if (cell.type !== BOMB) { revealCellArea(pos) }

    // Support selecting a seat
    elCell.classList.add('selected')
}

function setMines(board, numOfMines) {
    console.log('<in: setMines>')
    var maxNumOfMines = numOfMines

    for (var i = 0; i < maxNumOfMines; i++) {
        var tempXPos = getRandomIntInclusive(0, board.length - 1)
        console.log('x: ', tempXPos)
        var tempYPos = getRandomIntInclusive(0, board.length - 1)
        console.log('y: ', tempYPos)
        console.log('<in: setMines>: board ', board)
        board[tempXPos][tempYPos].type = BOMB
    }

}

//Called when a cell is right- clicked See how you can hide the context menu on right click
function onCellMarked(elCell) {

}

function revealCellArea(i, j) {
    console.log('<in: revealCellArea>')
    var elCurrentCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    console.log(elCurrentCell)
    elCurrentCell.classList.add('reveal')
}

function hideCellArea(i, j) {
    console.log('<in: hideCellArea>')
    var elCurrentCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCurrentCell.classList.remove('reveal')
}

function setNeighboursCountOnBoard() {
    console.log('<in: setNeighboursCountOnBoard>')
    //for each BOMB cell in board (2d) calculate neigbors and set the correct symbol
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === BOMB && gBoard[i][j].isMarked !== true) {
                markBombAreaWithNumbers(gBoard,i,j);
            }
        }
    }
}

function markBombAreaWithNumbers(mat, rowIdx, colIdx) {
    console.log('<in: markBombAreaWithNumbers>')
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            //if (mat[i][j].type !== LIFE) neighborsCount++
            mat[i][j].minesAroundCount++
            switch (mat[i][j].minesAroundCount) {
                case '1':
                    mat[i][j].type = ONE
                    break;
                case '2':
                    mat[i][j].type=TWO
                    break;
                case '3':
                    mat[i][j].type=THREE
                    break;
                case '4':
                    mat[i][j].type=FOUR
                    break;
                case '5':
                    mat[i][j].type=FIVE
                    break;
                default:
                    break;
            }//switch-case
        }
    }

}

function placeElementsOnBoard(rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (gBoard[i][j] !== BOMB) continue

            // Update the model
            gBoard[i][j.type] = ''

            // Update the DOM
            const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elCell.innerText = BOMB
        }
    }
}

function updateNumOfNeighborsOnBoard(board, i, j) {

}
