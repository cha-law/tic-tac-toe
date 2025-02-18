
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

    return {getBoard};
}


function Cell() {
    let value = "";

    const addMark = (player) => {
        value = player;
    }

    const getMarkValue = () => value;
    return {addMark, getMarkValue};
}


function GameController() {
    const board = Board();

    // Players
    const players = [
        {
            name: "Player1",
            mark: "X"
        },
        {
            name: "Player2",
            mark: "O"
        },
    ]

    let currentPlayer = players[0];

    const changePlayerTurn = () => {
        if (currentPlayer === players[0]) {currentPlayer = players[1]}
        else {currentPlayer = players[0]};
    }

    const getCurrentPlayer = () => currentPlayer;
}

