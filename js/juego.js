document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('puzzle-board');
    const restartButton = document.getElementById('restart-button');
    const moveCountElement = document.getElementById('move-count');
    const messageElement = document.getElementById('message');

    const GRID_SIZE = 4;
    const TILE_COUNT = GRID_SIZE * GRID_SIZE;

    let tiles = [];
    let moveCount = 0;

    // Inicializa y mezcla el rompecabezas
    function setupGame() {
        moveCount = 0;
        messageElement.textContent = '';
        updateMoveCount();
        
        // Crea el rompecabezas resuelto
        tiles = Array.from({ length: TILE_COUNT - 1 }, (_, i) => i + 1);
        tiles.push(null); // El espacio vacío

        // Mezcla hasta que sea resolvible
        shuffleTiles();
        while (!isSolvable(tiles)) {
            shuffleTiles();
        }

        renderBoard();
    }

    function shuffleTiles() {
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
    }

    // Dibuja el tablero basado en el array de fichas actual
    function renderBoard() {
        boardElement.innerHTML = '';
        tiles.forEach((tileValue, index) => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('puzzle-tile');
            if (tileValue === null) {
                tileElement.classList.add('empty');
            }
            else {
                tileElement.textContent = tileValue;
                tileElement.addEventListener('click', () => handleTileClick(index));
            }
            boardElement.appendChild(tileElement);
        });
    }

    // Maneja los clics en las fichas
    function handleTileClick(clickedIndex) {
        const emptyIndex = tiles.indexOf(null);
        const { row: clickedRow, col: clickedCol } = getRowCol(clickedIndex);
        const { row: emptyRow, col: emptyCol } = getRowCol(emptyIndex);

        // Verifica si la ficha clickeada es adyacente al espacio vacío
        if (
            (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
            (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow)
        ) {
            // Intercambia las fichas
            [tiles[clickedIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[clickedIndex]];
            moveCount++;
            updateMoveCount();
            renderBoard();
            checkWinCondition();
        }
    }

    // Verifica si el rompecabezas está resuelto
    function checkWinCondition() {
        for (let i = 0; i < TILE_COUNT - 1; i++) {
            if (tiles[i] !== i + 1) {
                return; // No resuelto
            }
        }
        messageElement.textContent = '¡Felicidades, has ganado!';
    }

    function updateMoveCount() {
        moveCountElement.textContent = moveCount;
    }

    function getRowCol(index) {
        return {
            row: Math.floor(index / GRID_SIZE),
            col: index % GRID_SIZE,
        };
    }

    function isSolvable(puzzle) {
        let inversions = 0;
        const flatPuzzle = puzzle.filter(t => t !== null);
        for (let i = 0; i < flatPuzzle.length; i++) {
            for (let j = i + 1; j < flatPuzzle.length; j++) {
                if (flatPuzzle[i] > flatPuzzle[j]) {
                    inversions++;
                }
            }
        }
        
        if (GRID_SIZE % 2 === 1) { // Grilla impar
            return inversions % 2 === 0;
        }
        else { // Grilla par
            const emptyRow = getRowCol(puzzle.indexOf(null)).row;
            const emptyRowFromBottom = GRID_SIZE - emptyRow;
            if (emptyRowFromBottom % 2 === 0) {
                return inversions % 2 === 1;
            }
            else {
                return inversions % 2 === 0;
            }
        }
    }


    // Eventos (Listeners)
    restartButton.addEventListener('click', setupGame);

    // Configuración inicial
    setupGame();
});
