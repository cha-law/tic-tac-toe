
function Board() {
    const board = [];

    // Creating the 2d board array.
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Cell());
        }
    }

    // Function to retrieve the entire board.
    const getBoard = () => board; 

    const outputBoard = () => {
        const boardWithCells = getBoardWithCells();
        console.log(boardWithCells);
    }

    const getBoardWithCells = () => {
        const boardWithCells = board.map((row) => row.map((cell) => cell.getMarkValue()));
        return boardWithCells;
    }

    const addMark = (currentPlayerMark, row, column) => {
        if (board[row][column].getMarkValue() != "") return "Taken";
        board[row][column].addMark(currentPlayerMark);
        outputBoard();
    }

    const winCheck = () => {
        const boardWithCells = getBoardWithCells();
        // Check the rows
        boardWithCells.forEach((row) => {
            if (((row[0] === row[1]) && (row[1] === row[2])) && (row[0] != "")) {
                game.endCurrentGame(row[0]);
            }
        })

        let i = 0;
        // Check the columns
        boardWithCells[0].forEach((cell) => {
            if (((cell === boardWithCells[1][i]) && (boardWithCells[1][i] === boardWithCells[2][i])) && (boardWithCells[1][i] != "")) {
                game.endCurrentGame(cell);
            }
            i++;
        });

        // Check the diagonals
        if ((((boardWithCells[0][0] === boardWithCells[1][1]) && (boardWithCells[1][1] === boardWithCells[2][2])) || ((boardWithCells[0][2] === boardWithCells[1][1]) && (boardWithCells[1][1] === boardWithCells[2][0]))) && (boardWithCells[1][1] != "")) {
            game.endCurrentGame(boardWithCells[1][1]);
        }
    }

    return {getBoard, outputBoard, addMark, winCheck};
}


function Cell() {
    let value = "";

    const addMark = (player) => {
        if (value != "") return;
        value = player;
    }

    const getMarkValue = () => value;

    return {addMark, getMarkValue};
}


function GameController(player1Name = "Player 1", player2Name = "Player 2") {
    const board = Board();
    let winner = false;

    // Players
    const players = [
        {
            name: player1Name,
            mark: "X"
        },
        {
            name: player2Name,
            mark: "O"
        },
    ]

    let currentPlayer = players[0];

    const changePlayerTurn = () => {
        const turnText = document.querySelector(".turn");
        if (currentPlayer === players[0]) {currentPlayer = players[1];} 
        else {currentPlayer = players[0]};

        // Switch the display showing who's turn it is.
        document.querySelector(".player-one-name").classList.toggle("current-player");
        document.querySelector(".player-two-name").classList.toggle("current-player");
    }

    const getCurrentPlayer = () => currentPlayer;

    const endCurrentGame = (winnerMark) => {
        console.log("Winner! " + winnerMark);
        winner = true;
    }

    const newRound = () => {
        // Ensure there isn't a winner.
        if (winner === true) {
            return
        }
        // Need to change top text 
        console.log(`${getCurrentPlayer().name}'s turn!`);
        playRound(currentRow, currentColumn);
    }

    const playRound = (row, column) => {
        // Adding the mark, and checking if it returns "Taken" so it does not change the turn or check for wins
        if ((board.addMark(getCurrentPlayer().mark, row, column)) === "Taken") {
            return;
        };
        board.winCheck();
        changePlayerTurn();
    }

    return {changePlayerTurn, getCurrentPlayer, endCurrentGame, newRound, playRound};
}

function ScreenController() {
    const gameWrapper = document.querySelector(".tictactoe-wrapper");

    const gridRows = document.querySelectorAll(".tictactoe-grid > div");

    const markAdded = (event) => {
        const cellClicked = event.target;
        const cellRow = cellClicked.parentElement.dataset.row;
        const cellColumn = cellClicked.dataset.column;

        game.playRound(cellRow, cellColumn);
    };

    // Add event listeners onto displayed cells
    gridRows.forEach((row) => {
        for (const cell of row.children) {
            cell.addEventListener("click", markAdded);
        }
    });

    return {markAdded};
}

const game = GameController();
const screen = ScreenController();