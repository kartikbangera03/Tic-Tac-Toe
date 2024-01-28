//IIFE module - we use iife to create variables that are private
const displayController=(()=>{
    const renderMessage = (message) =>{
        document.querySelector("#message").innerHTML = message;
    }
    return{
        renderMessage
    }
})();

// Gameboard module responsible for keeping gameboard private and can be
// accessed only via functions 
const Gameboard = (()=>{
    let gameboard = ["","","","","","","","",""];

    const render = ()=>{
        let boardHTML = "";
        gameboard.forEach((square, index)=>{
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        });
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square)=>{
            // handleClick is part of logic hence its being put in the Game module
            square.addEventListener("click",Game.handleClick);
        });
    }

    const update = (index, value)=>{
        gameboard[index] = value;
        render();

    }

    const getGameboard = ()=>{
        return gameboard;
    }

    return{
        render,
        update,
        getGameboard
    }
})();

//Player factory to create multiple players
const createPlayer = (name,mark)=>{
    //This returns an object containing name and mark
    return{
        name,
        mark
    }
}


//Game Module responsible for controlling the game
const Game = (()=>{
    let players = [];
    let currentPlayerIndex;
    let gameOver ;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value,"X"),
            createPlayer(document.querySelector("#player2").value,"O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
    }

    const handleClick = (event)=>{
        let index = parseInt(event.target.id.split("-")[1]);
        if(gameOver){
            return;
        }else if(Gameboard.getGameboard()[index]!==""){
                return;
                }else{
                    Gameboard.update(index,players[currentPlayerIndex].mark);
                    if(checkForWin(Gameboard.getGameboard(),players[currentPlayerIndex].mark)){
                        gameOver = true;
                        displayController.renderMessage(`${players[currentPlayerIndex].name} Wins`);
                    }else if(checkForTie(Gameboard.getGameboard())){
                        gameOver = true;
                        displayController.renderMessage(`Its a Tie`);
                    }
                    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
                }
        
    
    }

    const restart = ()=>{
        for(let i =0;i<9;i++){
            Gameboard.update(i,"");
        }
        Gameboard.render();
        document.querySelector("#message").innerHTML = "";
        gameOver = false;
    }
    return{
        start,
        handleClick,
        restart
    }
})();





function checkForTie(board){
    return board.every(cell=>cell!="")
}


function checkForWin(board){
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]
    for(let i=0; i<winningCombinations.length;i++){
        const [a,b,c] = winningCombinations[i];
        if(board[a]===board[b] && board[b]===board[c] && board[a]){
            return true;
        }
    }
    return false;
}

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click",()=>{
    Game.start();
});

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click",()=>{
    Game.restart();
});
