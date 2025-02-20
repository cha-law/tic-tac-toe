
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
        board.forEach((row) => {
            row.forEach((column) => {
                console.log(column.getMarkValue())
            })
        });
    }

    return {getBoard, outputBoard};
}


function Cell() {
    let value = "";

    const addMark = (player) => {
        if (value != "") return;
        value = player.mark;
    }

    const getMarkValue = () => value;
    return {addMark, getMarkValue};
}


function GameController(player1Name = "Player 1", player2Name = "Player Two") {
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
        if (currentPlayer === players[0]) {currentPlayer = players[1]}
        else {currentPlayer = players[0]};
    }

    const getCurrentPlayer = () => currentPlayer;

    const newRound = () => {
        board.outputBoard();
        console.log(`${getCurrentPlayer().name}'s turn!`);

        currentColumn = prompt("Enter column (0-2): ");
        currentRow = prompt("Enter row (0-2): ");

        playRound(currentRow, currentColumn);
    }

    const playRound = (row, column) => {
        const board = Board().getBoard();
        board[column][row].addMark(getCurrentPlayer().mark);
        // Win check needed
        changePlayerTurn();
        newRound();
    }

    // Start the game.
    //newRound();

    return {changePlayerTurn, getCurrentPlayer, newRound, playRound};
}

const game = GameController();

