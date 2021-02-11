var localStorage = window.localStorage;
localStorage.clear();
var player = localStorage.getItem('player');
if (player === null) {
    localStorage.setItem('player',JSON.stringify({
        'id': Date.now(),
        'score': 0,
        'lives': 10000,
    }));
}

var winNumber = 500;
var g, w, h, numtree;
var frame_player = 1;
var cnt_frame_player = 0;
var counterImage = 0;
var loadingImages = false;
var once = true;
var winText;
var start = false;

function imageLoaded(image) {
    counterImage++;
    if (counterImage == 9)
        loadingImage = true;
}
function setup() {
	numtree = 6;
	w = min(1000, windowWidth);
	h = windowHeight * 0.7;
	let c = createCanvas(w, h);
	g = new game();

    ground_left = loadImage('./sprites/ground_left.png', imageLoaded);
    ground_right = loadImage('./sprites/ground_right.png', imageLoaded);
    bg_trees = loadImage('./sprites/bg_trees.png', imageLoaded);
    trunk = loadImage('./sprites/trunk.png', imageLoaded);
    branch = loadImage('./sprites/branch_right.png', imageLoaded);
    body = loadImage('./sprites/lumber_body.png', imageLoaded);
    hand_up = loadImage('./sprites/hand_up.png', imageLoaded);
    hand_down = loadImage('./sprites/hand_down.png', imageLoaded);
    lumber_died = loadImage('./sprites/lumber_died.png', imageLoaded);
    bar = loadImage('./sprites/timeline.png', imageLoaded);
    stones = loadImage('./sprites/stones.png', imageLoaded);
    stumb = loadImage('./sprites/stumb.png', imageLoaded);

    play = createA('#', "<img src='./sprites/play.png'/>");
    play.id('play');
    play.class('button');
    play.mousePressed(function() {
        left.style('display: block;');
        right.style('display: block;');
        play.style('display: none;');
        start = true;
    });

    restart = createA('#', "<img src='./sprites/refresh.png'/>");
    restart.id('restart');
    restart.class('button');
    restart.style('display: none;');
    restart.mousePressed(function() {
        left.style('display: none;');
        right.style('display: none;');
        play.style('display: block;');
        restart.style('display: none;');
        g = new game();
        once = true;
    });

    left = createA('#', "<img src='./sprites/left.png'/>");
	  left.id('left');
    left.class('button');
    left.style('display: none;');
    left.mousePressed(function() {
		g.pos = false;
        frame_player = 0;
        cnt_frame_player = 0;
		g.update();
	});

	right = createA('#', "<img src='./sprites/right.png'/>");
  right.id('right');
  right.class('button');
  right.style('display: none;');
	right.mousePressed(function() {
		g.pos = true;
        frame_player = 0;
        cnt_frame_player = 0;
		g.update();
	});

    let container = createDiv();
    container.id('container');
    container.child(left);
    container.child(right);
    container.child(play);
    container.child(restart);

    winText = createA('https://docs.google.com/forms/d/e/1FAIpQLSd_G1wpMzelKm4X61aqZvLa3J1GXTaGwkwg5klx-GiJwLMe1A/viewform?usp=sf_link', 'Получить приз!');
	winText.id("winText");
	winText.style('bottom: -100vh;');
	noStroke();
    frameRate(30);
}

function draw() {
    if (loadingImages) return;
    // Background
    background('#d3f7ff');
    let k = w / 2094, t = w / 2625;
    let ground = h - 414*k;
    let x = ground;
    while (x > 0) {
        x -= 875 * t; 
        image(bg_trees, 0, x, 2625 * t, 875 * t);
    }
    image(ground_left, 0, h - 594*k, 875 * k, 594 * k);
	image(ground_right, 875 * k, h - 594*k, 1219 * k, 594 * k);

    // Branches
    let ch = ground - 2344*k, blk = 2344*k / numtree;
    k = blk/500;


    // Tree
    k = w / 2094;
    let r = 313*k / 100;
    if (start) {
        for (let i=numtree-1; i>=0; i--) {
            if (g.left[i]) flip(branch, w/2-781*k - 9, ch-(500*k/2), 781*k, 500*k);
            if (g.right[i]) image(branch, w/2 + 9, ch-(500*k/2), 781*k, 500*k);
            ch += blk;
        }
        image(trunk, (w - 313*k)/2, ground - 2344*k, 313*k, 2344*k);
    } else
        image(stumb, (w - 100*r)/2, ground - 120*r, 100*r, 120*r);
    image(stones, (w - 150*r)/2, ground - 50*r, 150*r, 72*r);

    k = blk/500;
    var newplayer = JSON.parse(localStorage.getItem('player'));
    if (g.gameOver || newplayer.lives == 0) {
        start = false;

        if (newplayer.lives == 0) once = false;
        if (once) {
            newplayer.lives--;
			try{
				console.log(db.collection('drovosek').doc().set({
					score: g.score,
					time: new Date() - 0
				}))
			}catch(er){
				console.log(er)
			}

            newplayer.score = max(newplayer.score, g.score);
            localStorage.setItem('player', JSON.stringify(newplayer));
            once = false;
        }

        let alg = 7;
        textAlign(CENTER);
        textSize(20);
        fill('#4d4d4d');
        text(`Вы набрали`, w/2 - alg, 40);
        if (newplayer.score <= g.score)
            text(`Новый рекорд!`, w/2 - alg, 120);
        else
            text(`Ваш рекорд`, w/2 - alg, 120);
        textSize(32);
        text(`${g.score}`, w/2 - alg, 80);
        text(`${newplayer.score}`, w/2 - alg, 160);

        // image(lumber_died, (w - 441*k)/2, ground - 531*k + 15, 441*k, 531*k);
        if (!g.pos)
            flip(lumber_died, (w - 441*t)/2 - 18 - 313*t, ground - 531*k + 15, 441*k, 531*k);
        else
            image(lumber_died, (w - 441*t)/2 + 18 + 313*t, ground - 531*k + 15, 441*k, 531*k);
        left.style('display: none;');
        right.style('display: none;');
        play.style('display: none;');
        if (newplayer.lives > 0) {
            restart.style('display: block;');
        }
        if (newplayer.score >= winNumber) {
            textSize(20);
            text(`Вы выйграли игрушку! чтобы получить ее перейдите по ссылке ниже`, w/2-140, 170, 280, 100);
            winText.style('bottom: 0vh;');
        } else if (newplayer.lives == 0) {
            textSize(20);
            text(`Ваши попытки закончились\nчтобы начать играть купите новую игрушку`, w/2-140, 170, 280, 100);
        }
        return;   
    }
	// Player
    k = blk/500;
    if (!g.pos) {
        flip(body, (w - 313*t)/2 - 10 - 313*t, ground - 669*k + 15, 313*k, 669*k);
        if (frame_player == 1)
            flip(hand_up, (w - 313*t)/2 - 10 - 313*t - 20, ground - 669*k + 15, 294*k, 325*k);
        else {
            flip(hand_down, (w - 313*t)/2 - 10 - 313*t + 20, ground - 669*k + 50, 369*k, 56*k);
            cnt_frame_player++;
            cnt_frame_player %= 4;
            if (cnt_frame_player == 0)
                frame_player = 1;
        }
    } else {
        image(body, (w - 313*t)/2 + 10 + 313*t, ground - 669*k + 15, 313*k, 669*k);

        if (frame_player == 1)
            image(hand_up, (w - 313*t)/2 + 10 + 313*t + 20, ground - 669*k + 15, 294*k, 325*k);
        else {
            image(hand_down, (w - 313*t)/2 + 313*t - 20, ground - 669*k + 50, 369*k, 56*k);
            cnt_frame_player++;
            cnt_frame_player %= 4;
            if (cnt_frame_player == 0)
                frame_player = 1;
        }
    }

    k = 0.5;
    
    if (start) {
        fill('white');
        rect((w-200*k)/2, 20, (200*k), 42*k, 10);
        fill('#7ead4f');
        rect((w-200*k)/2 + 5, 25, (180*k) * (g.time/100), 30*k);
        image(bar, (w-200*k)/2, 20, 200*k, 42*k);

        fill('white');
        textAlign(CENTER);
        textSize(20);
        text(`${g.score}`, w/2, 40 + 42*k);
    }

    if (start == false) {
        textAlign(CENTER);
        textSize(48);
        fill('#4d4d4d');
        text('Дровосек', w/2, 70);
        textSize(33);
        text('500 очков = приз\n*сохраните чек', w/2, 130);
    }

    g.time = max(0, g.time - g.level*0.05);
    if (g.time <= 0) g.gameOver = true;
}

function flip(img, x, y, w, h) {
    push();
    scale(-1, 1);
    image(img, -(x + w), y, w, h);
    pop(); 
}


function game() {
    this.time = 100;
	this.score = 0;
    this.level = 0;
	this.gameOver = false;
	this.pos = false; // false - left; true - right;
	this.left = [];
	this.right = [];
	for (let i=0; i<numtree; i++) {
		this.left.push(false);
		this.right.push(false);
	}

	this.update = function() {
        this.check();

        if (!this.left[numtree-1] && !this.right[numtree-1]) {
            if (this.left[numtree-2]) {
                this.left.push(false);
                this.right.push(true);
            } else {
                this.left.push(true);
                this.right.push(false);
            }
        } else {
            if (random(100) >= 30 + this.level * 2) {
                this.left.push(this.left[numtree-1]);
                this.right.push(this.right[numtree-1]);
            } else {
                this.left.push(false);
                this.right.push(false);
            }
        }

		this.left.shift();
		this.right.shift();

        this.check(true);
	}

    this.check = function(no = false) {
    	if (this.left[0] && (!this.pos)) this.gameOver = true;
		if (this.right[0] && this.pos) this.gameOver = true;
	
		if (!this.gameOver) {
            if (no) return;
            this.score++;
            this.time = min(100, this.time + 10);
        } else {
            return;
        }
        this.level = this.score / 30;
    }
}