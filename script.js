const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    }, 
    imageSrc: './assets/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    }, 
    scale: 2.75,
    imageSrc: './assets/shop.png',
    framesMax: 6
})

const player  = new Fighter({
    position: { x : 0,y : 0 }, 
    velocity: { x: 0, y: 0},
    imageSrc: './assets/samuraiMack/Idle.png',
    framesMax: 8, 
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/Take hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter({
    position: { x : 400,y :100 }, 
    velocity: { x: 0, y: 0}, 
    color: 'blue',
    imageSrc: './assets/kenji/Idle.png',
    framesMax: 4, 
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

const keys = {
    a : {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;


    if(keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -5;
        player.switchSprites('run');
    }
    else if(keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = 5;
        player.switchSprites('run');
    }
    else {
        player.switchSprites('idle');
    }

    //Jumping
    if( player.velocity.y < 0 ) {
        player.switchSprites('jump');
    }
    else if( player.velocity.y > 0 ) {
        player.switchSprites('fall');
    }


    //Enemy Movement
    if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprites('run');

    }
    else if(keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprites('run');
    }
    else {
        enemy.switchSprites('idle');
    }

    if( enemy.velocity.y < 0 ) {
        enemy.switchSprites('jump');
    }
    else if( enemy.velocity.y > 0 ) {
        enemy.switchSprites('fall');
    }


    // detect collision
    if(  rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.frameCurr == 4) {
        enemy.takeHit();
        player.isAttacking = false;
        document.querySelector(".enemyhealth").style.width = enemy.health + '%';
    }

    if( player.isAttacking && player.frameCurr === 4 ) player.isAttacking = false;

    if(  rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.frameCurr == 2) {
        player.takeHit()
        enemy.isAttacking = false;
        document.querySelector(".playerhealth").style.width = player.health + '%';
    }

    if( enemy.isAttacking && enemy.frameCurr === 2 ) enemy.isAttacking = false;

    // end game
    if( player.health <= 0 || enemy.health <= 0 ) {
        endGame({player, enemy, timerId})
    }
}

animate();

window.addEventListener("keydown", (event) => {
    if( !player.dead ) {
        switch(event.key){
            case 'd' :
            keys.d.pressed = true;
            player.lastkey = 'd';
            break;
        case 'a' :
            keys.a.pressed = true;
            player.lastkey = 'a';
            break;
        case 'w' :
            player.velocity.y = -10;
            break;
            case 's':
                player.attack();
                break;
            }
    }

    if( !enemy.dead ) {
        switch(event.key){
            case 'ArrowRight' :
                keys.ArrowRight.pressed = true;
                enemy.lastkey = 'ArrowRight';
                break;
                case 'ArrowLeft' :
                    keys.ArrowLeft.pressed = true;
            enemy.lastkey = 'ArrowLeft';
            break;
        case 'ArrowUp' :
            enemy.velocity.y = -10;
            break;
        case 'ArrowDown' :
            enemy.attack();
            break;
        }
    }
});

window.addEventListener("keyup", (event) => {
    switch(event.key){
        case 'd' :
            keys.d.pressed = false;
            break;
        case 'a' :
            keys.a.pressed = false;
            break;

        case 'ArrowRight' :
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false;
            break;
    }
});