'use strict'
console.clear


const GAME_FREQ = 1000

const BOMB = '💣'
const mark = '📍'
const ONE = '1️⃣'
const TWO = '2️⃣'
const THREE = '3️⃣'
const FOUR = '4️⃣'
const FIVE = '5️⃣'

var gGameInterval = 0

// The Model


var gBoard = [
]

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    showCount: 0,
    markedCount: 0,
    secsPassed: 0
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
    
    board[0][0] = {
        type: BOMB,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true
    }

    board[2][1] = {
        type: BOMB,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true
    }


    for (var i = 0; i < 4; i++) {
        board[i] = []

        for (var j = 0; j < 4; j++) {
            //board[i][j] = (Math.random() > 0.95) ? BOMB : ''
            board[i][j] = {
                type: '',
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            };
            setMinesNegsCount(board, i, j)
        }
    }// outer 'for'

    //board[0][0].type = BOMB
    //board[2][1].type = BOMB

    console.log('BOARD: ', board)
    return board;
}
//Update the renderBoard() function to also display the neighbor count and the mines
//
function renderBoard(board) {
    console.log('<in: renderBoard>')
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


function onCellClicked(elCell, rowIdx, colIdx) {
    if (gBoard[rowIdx][colIdx] !== LIFE) return

    // First update the model...
    gBoard[rowIdx][colIdx] = SUPER_LIFE

    // ...then update the DOM
    elCell.innerText = SUPER_LIFE

    blowupNegs(rowIdx, colIdx)
}


function placeElementsOnBoard(rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (gBoard[i][j] !== LIFE) continue

            // Update the model
            gBoard[i][j] = ''

            // Update the DOM
            const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elCell.innerText = '💥'
        }
    }
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
function setMinesNegsCount(mat, rowIdx, colIdx) {
    console.log('<in: setMinesNegsCount>')
    // for every cell in mat: checking number of neighbours which are   equal to 'BOMB' & updating model.
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            calcNumOfMinesAroundCount(mat, i, j) //return number of mines around  cell in 'rowIdx, colIdx'
            mat[i][j].minesAroundCount++ //set the cell's minesAroundCount.  
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
function updateNumOfCurrentNeighbors(mat, rowIdx, colIdx) {
    console.log('<in: updateNumOfCurrentNeighbors>')
    // update model
    gBoard[i][j].minesAroundCount = calcNumOfMinesAroundCount(gBoard, rowIdx, colIdx);
    // update dom
    document.querySelector('.numOfNegs').innerText = gBoard[i][j].minesAroundCount
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
    gLevel.MINES = getNumOfMinesAroundCount()
    // update dom
    document.querySelector('.numOfMines').innerText = gLevel.MINES
}



