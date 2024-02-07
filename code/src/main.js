const map = document.getElementById('map') //MAPA

class Game {
    constructor() {
        this.player = new Player(0, 0, map)
        this.enemy = new Enemy(600, 600, map, this.player)
        this.treasure = new Treasure(Math.floor(Math.random() * (1110 - 300) + 300), Math.floor(Math.random() * (700 -300) + 300), map)
        this.clue = new Clue(Math.floor(Math.random() * 1110), Math.floor(Math.random() * 700), map)
        this.cheat = new Cheat(Math.floor(Math.random() * 1110), Math.floor(Math.random() * 700), map)
        this.gameTimer = null
        this.countDown
        this.life = new Lives(this.player.lives, document.getElementById('lives-wrapper'))
        this.compass = new Compass(this.player, this.treasure)
    }

    // GAME SETUP
    bindKeys() {
        //AL PULSAR TECLAS
        window.addEventListener('keydown', (e) => { //cuando pulsamos teclas
            switch (e.key) {
                case 'a':
                case 'A':
                case 'ArrowLeft':
                    this.player.directionX = -1
                    this.player.sprite.style.backgroundImage = "url('./assets/playeLeft.png')"
                    break
                case 'd':
                case 'D':
                case 'ArrowRight':
                    this.player.directionX = 1
                    this.player.sprite.style.backgroundImage = "url('./assets/player.png')"
                    break
                case 'w':
                case 'W':
                case 'ArrowUp':
                    this.player.directionY = -1
                    break   
                case 's':
                case 'S':
                case 'ArrowDown':
                    this.player.directionY = 1
                    break
            }
        })

        window.addEventListener('keyup', (e) => { //CUANDO DEJAMOS DE PULSAR
            if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft' || e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
                this.player.directionX = 0
            }
            if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp' || e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
                this.player.directionY = 0
            }
        })
    }

    initialize () {
        this.countDown = new Timer(1)
        this.bindKeys()
        this.player.insertPlayer()
        this.enemy.insertEnemy()
        this.treasure.insertTreasure()
        this.clue.insertClue()
        this.cheat.insertCheat()
        this.countDown.start()
        this.life.insertLives()
    }

    // COLLISIONS
    checkCollisionPlayerTreasure() {
        return (this.treasure.x < this.player.x + this.player.width &&
            this.treasure.y < this.player.y + this.player.height &&
            this.treasure.x + this.treasure.width > this.player.x &&
            this.treasure.y + this.treasure.height > this.player.y)
    }

    checkCollisionPlayerEnemy() {
        return (this.enemy.x < (this.player.x + this.player.width) &&
            (this.enemy.x + this.enemy.width) > this.player.x &&
            this.enemy.y < (this.player.y + this.player.height) &&
            (this.enemy.y + this.enemy.height) > this.player.y)
    }
    checkCollisionPlayerClue() {
        return (this.clue.x < (this.player.x + this.player.width) &&
            (this.clue.x + this.clue.width) > this.player.x &&
            this.clue.y < (this.player.y + this.player.height) &&
            (this.clue.y + this.clue.height) > this.player.y)
    }
    checkCollisionPlayerCheat() {
        return (this.cheat.x < (this.player.x + this.player.width) &&
            (this.cheat.x + this.cheat.width) > this.player.x &&
            this.cheat.y < (this.player.y + this.player.height) &&
            (this.cheat.y + this.cheat.height) > this.player.y)
    }

    // GAME START
    win() {
        console.log('gane')
        const winScreen = document.getElementById('winScreen')
        clearInterval(this.gameTimer)
        this.stopGame()
        this.countDown.stop()
        winScreen.removeAttribute('class','hidden')
    }

    lose() {
        const gameOverScreen = document.getElementById('gameOverScreen')
        clearInterval(this.gameTimer)
        this.stopGame()
        this.countDown.stop()
        gameOverScreen.classList.remove('hidden')
    }

    reset(){
        this.player = new Player(0, 0, map)
        this.player.lives = 3
        this.life.numsLifes = 3

        console.log(this.player.lives)

        console.log(this.life.numsLifes)

        this.life = new Lives(this.player.lives, document.getElementById('lives-wrapper'))
        this.enemy = new Enemy(600, 600, map, this.player)
        this.treasure = new Treasure(Math.floor(Math.random() * 1110), Math.floor(Math.random() * 700), map)
        this.clue = new Clue(Math.floor(Math.random() * 1110), Math.floor(Math.random() * 700), map)
        this.cheat = new Cheat(Math.floor(Math.random() * 1110), Math.floor(Math.random() * 700), map)
        this.countDown = new Timer(1)
        this.compass = new Compass(this.player, this.treasure)
        this.player.insertPlayer()
        this.enemy.insertEnemy()
        this.treasure.insertTreasure()
        this.clue.insertClue()
        this.cheat.insertCheat()
        this.life.insertLives()
        this.countDown.start()
        this.start() 

    }

    start() {
        this.gameTimer = setInterval(() => {
            this.player.movePlayer()
            this.compass.changeColor()
            if (!this.enemy.pause) this.enemy.followPlayer()
            if(!this.enemy.pause && this.checkCollisionPlayerEnemy()) {
                this.player.removeLife()
                this.life.removeLives()
                if (this.player.lives === 0) {
                    this.lose()
                } else {
                    this.enemy.pause = true
                    setTimeout(() => {
                        this.enemy.pause = false
                    }, 1000)
                }
            }
            if (this.checkCollisionPlayerTreasure()) this.win()
            if (this.checkCollisionPlayerClue()) {
                this.treasure.setAttribute('class', 'hidden')
            }
            if (this.checkCollisionPlayerCheat()) this.player.removeLife()
            
        }, 20)
    }
    stopGame(){
        let player = document.getElementById('player')
        let enemies = document.getElementsByClassName('enemy')
        let treasure = document.getElementsByClassName('treasure')
        let clueCheat = document.getElementsByClassName('clue-cheat')
        let lives = document.getElementsByClassName('heart')
        let wrapper = document.getElementById('lives-wrapper')
        this.player.lives = 0
        this.life.numsLifes = 0
        console.log(this.player.lives)
        enemies = [...enemies]
        clueCheat = [...clueCheat]
        treasure = [...treasure]
        lives = [...lives]
        enemies.forEach(enemy => map.removeChild(enemy))
        clueCheat.forEach(element => map.removeChild(element))
        treasure.forEach(element => map.removeChild(element))
        lives.forEach(element => wrapper.removeChild(element))
        map.removeChild(player)
    }
}

const game = new Game()