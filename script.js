
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

    const getBoardWithCells = () => {
        const boardWithCells = board.map((row) => row.map((cell) => cell.getMarkValue()));
        return boardWithCells;
    }

    const addMark = (currentPlayerMark, row, column) => {
        if (board[row][column].getMarkValue() != "") {return "Taken"};
        board[row][column].addMark(currentPlayerMark);
    }

    const winCheck = () => {
        const boardWithCells = getBoardWithCells();
        // Used to prevent a win and draw happening
        let win = false;

        // Check the rows
        boardWithCells.forEach((row) => {
            if (((row[0] === row[1]) && (row[1] === row[2])) && (row[0] != "")) {
                game.endCurrentGameWin(row[0]);
                win = true;
            }
        })

        let i = 0;
        // Check the columns
        boardWithCells[0].forEach((cell) => {
            if (((cell === boardWithCells[1][i]) && (boardWithCells[1][i] === boardWithCells[2][i])) && (boardWithCells[1][i] != "")) {
                game.endCurrentGameWin(cell);
                win = true;
            }
            i++;
        });

        // Check the diagonals
        if ((((boardWithCells[0][0] === boardWithCells[1][1]) && (boardWithCells[1][1] === boardWithCells[2][2])) || ((boardWithCells[0][2] === boardWithCells[1][1]) && (boardWithCells[1][1] === boardWithCells[2][0]))) && (boardWithCells[1][1] != "")) {
            game.endCurrentGameWin(boardWithCells[1][1]);
            win = true;
        }

        // No win found, check for a draw instead
        if (win === false) drawCheck();
    }

    const drawCheck = () => {
        let emptyValue = false;
        board.forEach((row) => {
            row.forEach((cell) => {
                if (cell.getMarkValue() === "") {
                    emptyValue = true;
                }
            })
        })
        // All cells checked, no spaces left
        if (emptyValue === false) {
            game.endCurrentGameDraw();
        }
    }

    const refreshBoard = () => {
        board.forEach((row) => {
            row.forEach((cell) => {
                cell.clearMark();
            });
        });
    }

    return {getBoard, addMark, winCheck, drawCheck, refreshBoard};
}


function Cell() {
    let value = "";

    const addMark = (player) => {
        if (value != "") return;
        value = player;
    }

    const clearMark = () => {
        value = "";
    }

    const getMarkValue = () => value;

    return {addMark, getMarkValue, clearMark};
}


function GameController(player1Name = "Player 1", player2Name = "Player 2") {
    const board = Board();

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
        if (currentPlayer === players[0]) {currentPlayer = players[1];} 
        else {currentPlayer = players[0]};

        // Switch the display showing who's turn it is.
        document.querySelector(".player-one-name").classList.toggle("waiting-player");
        document.querySelector(".player-two-name").classList.toggle("waiting-player");
    }

    const getCurrentPlayer = () => currentPlayer;

    const endCurrentGameWin = (winnerMark) => {
        screen.colourAllYellow();
        screen.removeButtonEventListeners();

        // Add win text with correct winner
        if (winnerMark === "X") {screen.addWinText(players[0]);}
        else {screen.addWinText(players[1]);}

        screen.addNewGameButton();
    }

    const endCurrentGameDraw = () => {
        screen.colourAllGrey();

        screen.removeButtonEventListeners();
        screen.addDrawText();
        screen.addNewGameButton();
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

    const refreshBoard = () => {
        board.refreshBoard();
    }

    return {changePlayerTurn, getCurrentPlayer, endCurrentGameWin, endCurrentGameDraw, playRound, refreshBoard};
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
        newImg.classList.toggle("tictactoe-img");

        if (currentPlayer.mark === "X") {
            newImg.src = "./images/close.svg";
        } else {
            newImg.src = "./images/circle-outline.svg";
        }

        cellClicked.appendChild(newImg);
    };


    const buttons = document.querySelectorAll(".tictactoe-button");
    // Changing button styles and event listeners
    const resetGame = () => {
        const text = document.querySelector(".win-content > p");
        if (text) text.remove();

        // Remove new game button
        const newGameButton = document.querySelector(".new-game-button");
        if (newGameButton) newGameButton.remove();

        // Reset turn to player 1
        const currentPlayer = game.getCurrentPlayer();
        if (currentPlayer.mark === "O") game.changePlayerTurn();

        // Remove previous game marks in the tictactoe grid
        const images = document.querySelectorAll(".tictactoe-img");
        images.forEach((img) => {
            img.remove();
        })

        // Add event listeners
        buttons.forEach((button) => {
            button.addEventListener("click", markAdded);

            // Remove greyed out features if needed
            if (button.classList.contains("greyed")) {
                button.classList.toggle("greyed");
            }
            // Remove colours for winning tiles
            if (button.classList.contains("win")) {
                button.classList.toggle("win");
            }
        });

        // Refresh board
        game.refreshBoard();
    }

    // Removing event listeners for when a game has ended
    const removeButtonEventListeners = () => {
        buttons.forEach((button) => {
            button.removeEventListener("click", markAdded);
        });
    }

    const colourAllYellow = () => {
        buttons.forEach((button) => {
            button.classList.toggle("win");
        })
    }

    const colourAllGrey = () => {
        buttons.forEach((button) => {
            button.classList.toggle("greyed");
        })
    }

    const addWinText = (winner) => {
        const winContent = document.querySelector(".win-content");
        let newText = document.createElement("p");
        newText.textContent = `Winner: ${winner.name} (${winner.mark})`;
        winContent.appendChild(newText);
    }

    const addDrawText = () => {
        const winContent = document.querySelector(".win-content");
        let newText = document.createElement("p");
        newText.textContent = "Draw";
        winContent.appendChild(newText);
    }

    const addNewGameButton = () => {
        const winContent = document.querySelector(".win-content");
        let newButton = document.createElement("button");
        newButton.textContent = "Start new game";
        newButton.classList.toggle("new-game-button");
        newButton.addEventListener("click", resetGame);
        winContent.appendChild(newButton);
    }

    // Initialize buttons
    resetGame();

    return {removeButtonEventListeners, colourAllYellow, colourAllGrey, addNewGameButton, addWinText, addDrawText};
}

const game = GameController();
const screen = ScreenController();