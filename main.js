/**
 * @description javascript Shooting Game
 * @version 1.0.0
 * @author Royi
 */

/**
 * @description 총알 클래스
 * @author Royi
 */
class Bullet {
    constructor() {
        this.x = SootingGame.getSpaceShipX();
        this.y = SootingGame.getSpaceShipY();
        this.alive = true // true면 살아있는 총알 false이면 죽은 총알
        SootingGame.addBullet(this);
    }

    update = () => {
        this.y -= 7;
    };

    checkHit = () => {
        let enemyList = SootingGame.getEnemys();
        for (let i = 0; i < enemyList.length; i++) {
            // 총알.y <= 적군.y AND
            // 총알.x >= 적군.x AND 총알.x <= 적군.x + 적군의 넓이
            if (this.y <= enemyList[i].y && this.x >= enemyList[i].x - 30 && this.x <= enemyList[i].x + 10) {
                //총알이 죽게됨 적군의 우주선이 없어짐, 점수 획득
                SootingGame.updateScore();
                this.alive = false; // 죽은 총알
                SootingGame.deleteEnemy(i);
            }
        }
    };

    checkAlive = () => {
        if (0 > this.y) {
            this.alive = false; // 죽은 총알
        }
    };
}

/**
 * @description 랜덤한 숫자 생성 0 ~ (캔버스가로길이 - 적군가로길이)
 * @param {number} min - 최소 숫자
 * @param {number} max - 최대 숫자
 * @returns {number}
 * @author Royi
 */
function generateRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @description 적군 클래스
 * @author Royi
 */
class Enemy {
    constructor() {
        this.enemyImageWidth = SootingGame.getEnemyImage().width;
        this.enemyImageHeight = SootingGame.getEnemyImage().height;
        this.y = 0;
        this.x = generateRandomValue(this.enemyImageWidth, SootingGame.getCanvas().width - this.enemyImageWidth);
        SootingGame.addEnemy(this);
    }

    update = () => {
        this.y += 2; // 적군의 속도 조절

        if (this.y >= SootingGame.getCanvas().height - this.enemyImageHeight) {
            SootingGame.setGameOver();
        }
    }
}

const SootingGame = (() => {

    const images = {
        background: "images/background.jpg",
        spaceship: "images/spaceship.png",
        bullet: "images/bullet.png",
        enemy: "images/enemy.png",
        gameOver: "images/gameover.jpg"
    }

    let canvas,
        ctx,
        backgroundImage,
        spaceshipImage,
        bulletImage,
        enemyImage,
        gameOverImage,
        spaceshipX,
        spaceshipY,
        keysDown = {},
        score = 0,
        gameOver = false, // true이면 게임이 끝남, false이면 게임이 안끝남
        bulletList = [], // 총알들을 저장하는 리스트
        enemyList = [];

    /**
     * @description 초기화 함수
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let init = () => {
        _setupCanvas();
        _loadImage();
        _setupSpaceShipLocaion();
        _setupKeyboardListener();
        _createEnemy();
        _play();
    }

    /**
     * @description 캔버스 설정
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let _setupCanvas = () => {
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        canvas.width = 400;
        canvas.height = 700;
        document.body.appendChild(canvas);
    }

    /**
     * @description 이미지를 로드 한다.
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let _loadImage = () => {
        backgroundImage = new Image();
        backgroundImage.src = images.background;

        spaceshipImage = new Image();
        spaceshipImage.src = images.spaceship;

        bulletImage = new Image();
        bulletImage.src = images.bullet;

        enemyImage = new Image();
        enemyImage.src = images.enemy;

        gameOverImage = new Image();
        gameOverImage.src = images.gameOver;
    }

    /**
     * @description 우주선 위치 설정
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let _setupSpaceShipLocaion = () => {
        if (spaceshipImage.width) {
            spaceshipX = canvas.width / 2 - spaceshipImage.width / 2;
            spaceshipY = canvas.height - spaceshipImage.height;
        } else {
            spaceshipX = canvas.width / 2 - 64;
            spaceshipY = canvas.height - 64;
        }
    }

    /**
     * @description 키보드 이벤트 설정
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let _setupKeyboardListener = () => {
        document.addEventListener("keydown", (event) => {
            keysDown[event.key] = true;
        });
        document.addEventListener("keyup", (event) => {
            delete keysDown[event.key];

            if (event.key === ' ') {
                _createBullet();
            }
        });
    }

    /**
     * @description 총알 하나 생성
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let _createBullet = () => {
        let b = new Bullet();
    }

    /**
     * @description 적군 1초마다 생성
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let _createEnemy = () => {
        setInterval(function () {
            let e = new Enemy();
        }, 1000);
    }

    /**
     * @description 렌더링 시작 (애니메이션 효과)
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let _play = () => {
        if (!gameOver) {
            _updateSpaceShipLocation();
            _updateBulletAndEnemyYLocation();
            _renderScreen();
            requestAnimationFrame(_play);
        } else {
            ctx.drawImage(gameOverImage, 10, 100, 380, 280);
        }
    }

    /**
     * @description 우주선 좌표값 업데이트
     * @type {funtion}
     * @returns {void}
     * @author Royi
     */
    let _updateSpaceShipLocation = () => {
        if ('ArrowRight' in keysDown) {
            spaceshipX += 5; // 우주선의 속도
        }

        if ('ArrowLeft' in keysDown) {
            spaceshipX -= 5;
        }

        if (spaceshipX <= 0) {
            spaceshipX = 0;
        }

        if (spaceshipX >= canvas.width - spaceshipImage.width) {
            spaceshipX = canvas.width - spaceshipImage.width;
        }
        // 우주선의 좌표값이 무한대로 업데이트가 되는게 아닌! 경기장 안에서만 있게 하려면?
    }

    /**
     * @description 총알과 적군 Y좌표 업데이트
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let _updateBulletAndEnemyYLocation = () => {
        bulletList.forEach((bullet) => {
            if (bullet.alive) {
                bullet.update();
                bullet.checkHit();
                bullet.checkAlive();
            } else {
                _deleteBullet();
            }
        });

        enemyList.forEach((enemy) => {
            enemy.update();
        });
    }

    /**
     * @description 화면 그려주기
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let _renderScreen = () => {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
        ctx.fillText(`Score:${score}`, 20, 20);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";

        bulletList.forEach((bullet) => {
            if (bullet.alive) {
                ctx.drawImage(bulletImage, bullet.x, bullet.y);
            }
        });

        enemyList.forEach((enemy) => {
            ctx.drawImage(enemyImage, enemy.x, enemy.y);
        });
    }

    /**
     * @description 점수(스코어) 업데이트
     * @type {function}
     * @returns {void}
     * @author Royi
     */
    let _updateScore = () => {
        score++;
    }

    /**
     * @description 우주선 X 좌표값 조회
     * @type {function}
     * @returns {string} - 우주선 X 좌표값
     * @author Royi
     */
    let _getSpaceShipX = () => {
        return spaceshipX;
    }

    /**
     * @description 우주선 Y 좌표값 조회
     * @type {function}
     * @returns {string} - 우주선 Y 좌표값
     * @author Royi
     */
    let _getSpaceShipY = () => {
        return spaceshipY;
    }

    /**
     * @description 총알 리스트 추가
     * @type {function}
     * @param {object} obj - Bullet Class Object
     * @returns {void}
     * @author Royi
     */
    let _addBullet = (obj) => {
        bulletList.push(obj);
    }

    /**
     * @description 적군 리스트에 해당 인덱스값 제거 
     * @type {function}
     * @param {number} index - 적군 배열 인덱스 값
     * @returns {void}
     * @author Royi
     */
    let _deleteEnemy = (index) => {
        enemyList.splice(index, 1);
    }

    /**
     * @description 적군 리스트 추가
     * @type {function}
     * @param {object} obj - Enemy Class Object
     * @returns {void}
     * @author Royi
     */
    let _addEnemy = (obj) => {
        enemyList.push(obj);
    }

    /**
     * @description 적군 배열 반환
     * @type {function}
     * @returns {Array}
     * @author Royi 
     */
    let _getEnemys = () => {
        return enemyList;
    }

    /**
     * @description 죽은 총알 배열에서 제거
     * @type {function} 
     * @returns {void}
     * @author Royi
     */
    let _deleteBullet = () => {
        bulletList = bulletList.filter(item => item.alive);
    }

    /**
     * @description 적군 이미지 값 조회
     * @type {function}
     * @returns {object} - 적군이미지 가로, 높이 값 조회
     * @author Royi
     */
    let _getEnemyImage = () => {
        return {
            width: enemyImage.width,
            height: enemyImage.height
        }
    }

    /**
     * @description 캔버스 반환
     * @type {function}
     * @returns {object}
     * @author Royi 
     */
    let _getCanvas = () => {
        return canvas;
    }

    /**
     * @description 게임 종료 
     * @type {function}
     * @returns {void}
     * @author Royi 
     */
    let _setGameOver = () => {
        gameOver = true;
    }

    return {
        init: init,
        getSpaceShipX: _getSpaceShipX,
        getSpaceShipY: _getSpaceShipY,
        updateScore: _updateScore,
        addBullet: _addBullet,
        deleteEnemy: _deleteEnemy,
        addEnemy: _addEnemy,
        getEnemys: _getEnemys,
        getCanvas: _getCanvas,
        setGameOver: _setGameOver,
        getEnemyImage: _getEnemyImage
    }
})();

SootingGame.init();
