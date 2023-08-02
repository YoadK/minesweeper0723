function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}

function countNeighbors(mat,rowIdx, colIdx) {
    var neighborsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j] === LIFE) neighborsCount++
        }
    }
    return neighborsCount
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getClassName(location) {
	const cellClass = 'cell-' + location.i + '-' + location.j
	return cellClass
}

function renderCell(location, value) {
	const cellSelector = '.' + getClassName(location)
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}