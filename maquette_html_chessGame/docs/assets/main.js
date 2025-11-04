const boardState = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

const pieceIcons = {
    "R": "♖", "N": "♘", "B": "♗", "Q": "♕", "K": "♔", "P": "♙",
    "r": "♜", "n": "♞", "b": "♝", "q": "♛", "k": "♚", "p": "♟",
    "": ""
};

const board = document.getElementById("chessboard");
const boardButtons = [];

let selectedCell = null;

let selectedRow = -1;

let selectedCol = -1;


function createBoard() {
    for (let row = 0; row < 8; row++) {
        boardButtons = [row] = [];
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.className = `cell $ { (row + col ) % 2 === 0 ? "ligth" : "dark" }`;
            cell.textContent = pieceIcons[boardState[row][col]];
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", onCellClick);
            board.appendChild(cell);
            boardButtons[row][col] = cell;
        }
    }
}

function onCellClick(e) {
    const cell = e.currentTarget;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (!selectedCell && boardState[row][col] !== "") {
        selectedCell = cell;
        selectedRow = row;
        selectedCol = col;
        cell.classList.add("selected");
    } else if (selectedCell) {
        boardState[row][col] = boardState[selectedRow][selectedCol];
        boardState[selectedRow][selectedCol] = "";

        boardButtons[row][col].textContent = pieceIcons[boardState[row][col]];
        boardButtons[selectedRow][selectedCol].textContent = "";

        selectedCell.classList.remove("selected");

        selectedCell = null;
        selectedRow = -1;
        selectedCol = -1;
    }
}

