
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
        board[column][row].addMark(currentPlayerMark);
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
        if (currentPlayer === players[0]) {currentPlayer = players[1]}
        else {currentPlayer = players[0]};
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
        console.log(`${getCurrentPlayer().name}'s turn!`);

        currentColumn = prompt("Enter column (0-2): ");
        currentRow = prompt("Enter row (0-2): ");

        playRound(currentRow, currentColumn);
    }

    const playRound = (row, column) => {
        board.addMark(getCurrentPlayer().mark, row, column);
        board.winCheck();
        changePlayerTurn();
        newRound();
    }

    return {changePlayerTurn, getCurrentPlayer, endCurrentGame, newRound, playRound};
}

function ScreenController() {

}

const game = GameController();

// Initialize the game.
game.newRound()