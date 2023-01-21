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
const levelContainer = document.querySelector('#levels');
const backButton = document.querySelector('#back');
const easy = document.querySelector('#easy');
const medium = document.querySelector('#medium');
const hard = document.querySelector('#hard');


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
let clicks = 0;
// hide play screen and show start screen on page load
playScreen.style.display = 'none';
levelContainer.style.display = 'none';
backButton.style.display = 'none';


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
    levelContainer.style.display = 'block';
    backButton.style.display = 'block';
});

vsPlayer.addEventListener('click', () => {
    startGame();
    backButton.style.display = 'block';
});

// display player name input on click
vsPlayer.addEventListener('click', () => {
    pvp.forEach((player) => {
        player.style.display = 'block';
    });
});


//Back button
backButton.addEventListener('click', () => {

    // if clicks is more than 1, ask the user to refresh the page
    if (clicks > 0) {
        alert('Please refresh the page to go to home page');
    }

    // if clicks is 0, go back to home page
    else {
        startScreen.style.display = 'block';
        playScreen.style.display = 'none';
        levelContainer.style.display = 'none';
        backButton.style.display = 'none';
        pvp.forEach((player) => {
            player.style.display = 'none';
        });
    }
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
        clicks = 0;

        if (oppcomputer) {
            player1 = player('Player 1', 'X');
            player2 = player('Computer', 'O');
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

        // if level is easy, computer will choose a random box
        // if level is hard, computer will choose the best move from ai module
        if (level.value === 'easy') {
            
        let board = gameBoard.getBoard();
        let random = Math.floor(Math.random() * 9);
        while (board[random] !== '') {
            random = Math.floor(Math.random() * 9);
        }
        gameBoard.setBoard(random, player2.getSymbol());
        render();
        }
        else if (level.value === 'hard') {
            let bestMove = ai.getBestMove(gameBoard.getBoard());
            gameBoard.setBoard(bestMove, player2.getSymbol());
            render();
        }


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
                boxes[condition[1]].style.color = 'red';
                boxes[condition[2]].style.color = 'blue';
                win = true;
            }
        });
        return win;
    };

    const checkDraw = (board) => {
        let draw = true;
        board.forEach((box) => {
            if (box === '' ) {
                draw = false;
            }
        }
        );
        return draw;
    }

    const checkResult =(board) => {
        if(checkWin(board)) {
            return 'win';
        }
        else if (checkDraw(board)) {
            return 'draw';
        }
        else {
            return 'ongoing';
        }
    }

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
        checkResult,
        checkWin,
        switchPlayer,
    };
})();

// add AI Module
// use minimax algorithm

const ai = (() => {
    const minimax = (board, depth, isMaximizing) => {
        let result = gameFlow.checkResult(board);
        if (result === 'win') {
            return isMaximizing ? -1 : 1;
        }
        else if (result === 'draw') {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = player2.getSymbol();
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = player1.getSymbol();
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const getBestMove = (board) => {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = player2.getSymbol();
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    };

    return {
        getBestMove,
    };
})();