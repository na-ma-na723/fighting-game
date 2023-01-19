function rectangularCollision({rectangle1, rectangle2}) {

    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.attackBox.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.attackBox.width && 
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.attackBox.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.attackBox.height )
}

function endGame({player, enemy, timerId}) {
    clearTimeout(timerId);
    if( player.health === enemy.health ) {
        document.querySelector(".result").innerHTML = "TIE";
    }
    else if( player.health > enemy.health ) {
        document.querySelector(".result").innerHTML = "PLAYER ONE WINS";
    }
    else if( player.health < enemy.health ) {
        document.querySelector(".result").innerHTML = "PLAYER TWO WINS";
    }
    document.querySelector(".result").style.display = "flex";
}

let timer = 10;
let timerId;
function decTimer() {
    if(timer > 0) {
        timerId = setTimeout( decTimer, 1000);
        timer--;
        document.querySelector(".timer").innerHTML = timer;
    }

    if( timer === 0 ) {
        document.querySelector(".result").style.display = "flex";
        endGame({player, enemy, timerId})
    }
}