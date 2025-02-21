
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
        console.log(getBoardWithCells());
    }

    const getBoardWithCells = () => {
        const boardWithCells = board.map((row) => row.map((cell) => cell.getMarkValue()));
        return boardWithCells;
    }

    const addMark = (currentPlayerMark, row, column) => {
        if (board[row][column].getMarkValue() != "") {return "Taken"};
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
        document.querySelector(".player-one-name").classList.toggle("waiting-player");
        document.querySelector(".player-two-name").classList.toggle("waiting-player");
    }

    const getCurrentPlayer = () => currentPlayer;

    const endCurrentGame = (winnerMark) => {
        console.log("Winner! " + winnerMark);
        screen.removeButtonEventListeners();
    }

    const playRound = (row, column) => {
        // Adding the mark, and checking if it returns "Taken" so it does not change the turn or check for wins
        if ((board.addMark(getCurrentPlayer().mark, row, column)) === "Taken") {
            return "Taken";
        } else {
            board.winCheck();
            changePlayerTurn();
        }
    }

    return {changePlayerTurn, getCurrentPlayer, endCurrentGame, playRound};
}

function ScreenController() {

    const markAdded = (event) => {
        const cellClicked = event.target;
        const cellRow = cellClicked.parentElement.parentElement.dataset.row;
        const cellColumn = cellClicked.dataset.column;
        const currentPlayer = game.getCurrentPlayer();

        if (game.playRound(cellRow, cellColumn) === "Taken") return;

        // Adding the mark to the display
        let newImg = document.createElement("img");

        if (currentPlayer.mark === "X") {
            newImg.src = "./images/close.svg";
        } else {
            newImg.src = "./images/circle-outline.svg";
        }

        cellClicked.appendChild(newImg);
    };


    const buttons = document.querySelectorAll(".tictactoe-button");
    // Adding the event listeners when a new game starts.
    const addButtonEventListeners = () => {
        buttons.forEach((button) => {
            button.addEventListener("click", markAdded);
        });
    }

    // Removing event listeners for when a game has ended
    const removeButtonEventListeners = () => {
        buttons.forEach((button) => {
            button.removeEventListener("click", markAdded);
        });
    }

    // Initialize buttons
    addButtonEventListeners();

    return {markAdded, removeButtonEventListeners};
}

const game = GameController();
const screen = ScreenController();