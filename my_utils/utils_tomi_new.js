function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}


function onBookSeat(elBtn) {
    console.log('Booking seat, button: ', elBtn)
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j    gCinema[i][j].isBooked = true
    renderCinema()    hideSeatDetails()
}


function countAvailableSeatsAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isSeat && !currCell.isBooked) count++
        }
    }
    return count


}


function onHighlight() {
    const rowIdx = gElSelectedSeat.dataset.i
    const colIdx = gElSelectedSeat.dataset.j
    const neighborCells = highlightAvailableSeatsAround(rowIdx, colIdx)    setTimeout(() => {
        for (var i = 0; i < neighborCells.length; i++) {
            neighborCells[i].classList.remove('highlight')
        }
    }, 2500);
}



function highlightAvailableSeatsAround(rowIdx, colIdx) {
    const neighborCells = []
    console.log('rowIdx:', rowIdx);
    console.log('colIdx:', colIdx);
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gCinema.length) continue        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gCinema[i].length) continue
            if (i === rowIdx && j === colIdx) continue            if (gCinema[i][j].isSeat && !gCinema[i][j].isBooked) {
                // console.log('j:', j);
                // console.log('i:', i);
                const elBtn = document.querySelector([data - i="${i}"][data - j= "${j}"])
                neighborCells.push(elBtn)
                console.log('elBtn:', elBtn);
                elBtn.classList.add('highlight')
            }
        }
    }
    return neighborCells
}


function closePop() {
    const elPopup = document.querySelector('.popup')
    elPopup.hidden = true
}