// DOM elements

let boxes = document.querySelectorAll('.box');
const resetButton = document.querySelector('#reset');
let message = document.querySelector('#message');
const playScreen = document.querySelector('#playScreen');
const startScreen = document.querySelector('#startScreen');
const vsComputer = document.querySelector('#vsComputer');
const vsPlayer = document.querySelector('#vsPlayer');
const playerName = document.querySelector('.nameContainer');
const pvp = document.querySelectorAll('.pvp');

const player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {
        getName,
        getSymbol,
    };
};

// global variables
let player1Name = document.querySelector('#player1');
let player2Name = document.querySelector('#player2');
let player1 = player('Player 1', 'X');
let player2 = player('Player 2', 'O');
let currentPlayer = player1;
let gameOver = false;
let playvsComputer = false;
let oppcomputer = false;
// hide play screen and show start screen on page load
playScreen.style.display = 'none';

pvp.forEach((player) => {
    player.style.display = 'none';
});

// display play screen on click 
const startGame = () => {
    startScreen.style.display = 'none';
    playScreen.style.display = 'block';
}

vsComputer.addEventListener('click', () => {
    const computer = player('Computer', 'O');
    player2 = computer;
    playvsComputer = true;
    oppcomputer = true;
    startGame();
});

vsPlayer.addEventListener('click', startGame);

// display player name input on click
vsPlayer.addEventListener('click', () => {
    pvp.forEach((player) => {
        player.style.display = 'block';
    });
});

// player name input

// Factory Functions
player1Name.addEventListener('change', () => {
    player1 = player(player1Name.value, 'X');
    currentPlayer = player1;
    message.textContent = `${player1.getName()}'s turn`;

});

player2Name.addEventListener('change', () => {
    player2 = player(player2Name.value, 'O');
});


// Modules

// Gameboard Module

const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];
    
    const getBoard = () => board;
    
    const setBoard = (index, playerSymbol) => {
        board[index] = playerSymbol;
    };
    
    // reset the boxes color
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        boxes.forEach((box) => {
            box.style.color = 'rgb(163,163,163)';
        });
    };
    
    return {
        getBoard,
        setBoard,
        resetBoard,
    };
})();


// displayController Module

const displayController = (() => {
    
    const render = () => {
        let board = gameBoard.getBoard();
        boxes.forEach((box, index) => {
            box.textContent = board[index];
        });
    };

    const reset = () => {
        gameBoard.resetBoard();
        render();
        message.textContent = `${player1.getName()}'s turn`;
        gameOver = false;

        if (oppcomputer) {
            player1 = player('Player 1', 'X');
            player2 = player('Computer', 'O');
            clicks = 0;
            currentPlayer = player1;
        }
        else {
        // clear player names and reset player names
        player1Name.value = '';
        player2Name.value = '';
        player1 = player('Player 1', 'X');
        player2 = player('Player 2', 'O');
        currentPlayer = player1;
        }   
        
    }

    resetButton.addEventListener('click', reset);

    let clicks = 0;

    // add click event to each box 
    const addClickEvent = () => {
        boxes.forEach((box, index) => {
            box.addEventListener('click', () => {
                if (gameBoard.getBoard()[index] === '' && !gameOver) {
                    
                    gameBoard.setBoard(index, currentPlayer.getSymbol());
                    render();
                    clicks++;
            
                    if (gameFlow.checkWin()){
                        message.textContent = `${currentPlayer.getName()} wins!`;
                        gameOver = true;
                    } 
                    else {
                        gameFlow.switchPlayer();
                        console.log(clicks);
                        console.log(playvsComputer);
                        console.log(currentPlayer.getName());

                        if (playvsComputer && currentPlayer.getName() === 'Computer' && clicks < 5) {
                            // if all boxes are filled after last player render, game is over and do not call computerMove()
                            console.log('entered');
                            computerMove();
                            if (gameFlow.checkWin()){
                                message.textContent = `${currentPlayer.getName()} wins!`;
                                gameOver = true;
                            }
                            else {
                                gameFlow.switchPlayer();
                            }
                            
                        }
                    }

                    // check for draw
                    let draw = true;
                    gameBoard.getBoard().forEach((box) => {
                        if (box === '' ) {
                            draw = false;
                        }
                    }
                    );
                    if (draw && !gameOver) {
                        message.textContent = 'Draw!';
                        gameOver = true;
                    }
                }
            });
        });
    }

    // computer move using random number
    const computerMove = () => {
            
        let board = gameBoard.getBoard();
        let random = Math.floor(Math.random() * 9);
        while (board[random] !== '') {
            random = Math.floor(Math.random() * 9);
        }
        gameBoard.setBoard(random, player2.getSymbol());
        render();
        if (gameFlow.checkWin()){
            message.textContent = `${player2.getName()} wins!`;
            gameOver = true;
        }
        // check for draw
        let draw = true;
        gameBoard.getBoard().forEach((box) => {
            if (box === '' ) {
                draw = false;
            }
        }
        );
        if (draw && !gameOver) {
            message.textContent = 'Draw!';
            gameOver = true;
        }
    }

    addClickEvent();
    render();

})();

    
    
// Game Module

const gameFlow = (() => {

    const checkWin = () => 
    {
        let win = false;
        let board = gameBoard.getBoard();
        let winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        winConditions.forEach((condition) => {
            if (board[condition[0]] === board[condition[1]] && board[condition[1]] === board[condition[2]] && board[condition[0]] !== '') {
                boxes[condition[0]].style.color = 'green';
                boxes[condition[1]].style.color = 'green';
                boxes[condition[2]].style.color = 'green';
                win = true;
            }
        });
        return win;
    };

    const switchPlayer = () => {
        if (currentPlayer === player1) {
            currentPlayer = player2;
            message.textContent = `${player2.getName()}'s turn`;
        } 
        else if (currentPlayer.getName() === 'Computer') {
            currentPlayer = player1;
            message.textContent = `${player1.getName()}'s turn`;
        }
        
        else {
            currentPlayer = player1;
            message.textContent = `${player1.getName()}'s turn`;
        }
    };

    return {
        checkWin,
        switchPlayer,
    };
})();
