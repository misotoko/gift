window.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const bgMusic = document.getElementById('bg-music');
  const backToHomeBtn = document.getElementById('back-to-home-btn');

  const coinIcon = document.getElementById('coin-icon');
  const starIcon = document.getElementById('star-icon');
  const questionIcon = document.getElementById('question-icon');

  const choiceView = document.getElementById('choice-view');
  const coinView = document.getElementById('coin-view');
  const starView = document.getElementById('star-view');
  const questionView = document.getElementById('question-view');
  const giftFrame = document.getElementById('gift-frame');

  const songView = document.getElementById("song-view");
  const playSongBtn = document.getElementById("play-song-btn");
  const youtubeContainer = document.getElementById("youtube-player-container");

  const backButtonCoin = document.getElementById('back-button-coin');
  const backButtonStar = document.getElementById('back-button-star');
  const backButtonQuestion = document.getElementById('back-button-question');

  const popSound = new Audio("assets/pop.mp3");
  popSound.volume = 0.3;

  function unlockAudio() {
    popSound.play().then(() => {
      popSound.pause();
      popSound.currentTime = 0;
    }).catch(() => {});
    document.body.removeEventListener('click', unlockAudio);
  }
  document.body.addEventListener('click', unlockAudio);

  // Disable background music on gift.html
  if (window.location.pathname.includes("gift.html")) {
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgMusic.muted = true;
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      window.location.href = 'gift.html';
    });
  }

  const views = {
    "coin-icon": {
      view: coinView,
      url: "https://www.youtube.com/embed/mjwgdxxNt_U?autoplay=1",
      startEffect: startChocolateFall,
      stopEffect: stopChocolateFall,
    },
    "star-icon": {
      view: starView,
      url: "https://www.youtube.com/embed/a3_yIpi8YAw?autoplay=1",
      startEffect: startGlowingLasers,
      stopEffect: stopGlowingLasers,
    },
    "question-icon": {
      view: questionView,
      url: "https://www.youtube.com/embed/VTuJuok5QK4?autoplay=1",
      startEffect: startBalloonFloat,
      stopEffect: stopBalloonFloat,
    }
  };

  const volumeBtn = document.getElementById('volume-btn');

  if(volumeBtn && bgMusic) {
    volumeBtn.addEventListener('click', () => {
      const willUnmute = bgMusic.muted;

      bgMusic.muted = !bgMusic.muted;
      volumeBtn.textContent = bgMusic.muted ? '🔇' : '🔊';

      if (willUnmute) {
        bgMusic.play().catch(err => {
          console.warn("Playback failed after unmuting:", err);
        });
      } else {
        bgMusic.pause();
      }
    });
  }

  let currentEffectStop = null;
  let currentSongURL = "";

  const sfxMap = {
    "coin-icon": new Audio("assets/coin.mp3"),
    "star-icon": new Audio("assets/star2.mp3"),
    "question-icon": new Audio("assets/question.mp3")
  };

  Object.keys(views).forEach(id => {
    const icon = document.getElementById(id);
    if (!icon) return;

    // Play hover pop sound
    icon.addEventListener("mouseenter", () => {
      popSound.currentTime = 0;
      popSound.play().catch(err => console.warn("Hover sound blocked:", err));
    });

    sfxMap["coin-icon"].volume = 0.4;
    sfxMap["star-icon"].volume = 0.4;
    sfxMap["question-icon"].volume = 1.0;

    icon.addEventListener("click", () => {
      console.log("Clicked:", id);

      const sfx = sfxMap[id];
      if (sfx) {
        sfx.currentTime = 0;
        sfx.play().catch(err => console.warn("Click sfx blocked:", err));
      }

      const { view, url, startEffect } = views[id];

      choiceView.style.display = "none";

      if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      }

      coinView.style.display = "none";
      starView.style.display = "none";
      questionView.style.display = "none";

      view.style.display = "flex";
      songView.style.display = "block";
      currentSongURL = url;
      youtubeContainer.innerHTML = "";
      if (startEffect) startEffect();
      if (backToHomeBtn) backToHomeBtn.style.display = "none";
      currentEffectStop = views[id].stopEffect;
    });
  });

  playSongBtn.addEventListener("click", () => {
    youtubeContainer.style.display = "block";
    youtubeContainer.innerHTML = `
      <iframe width="360" height="215" src="${currentSongURL}" frameborder="0"
        allow="autoplay; encrypted-media" allowfullscreen>
      </iframe>`;
  });

  function goBack() {
    Object.values(sfxMap).forEach(sfx => {
      sfx.pause();
      sfx.currentTime = 0;
    });

    youtubeContainer.style.display = "none";
    youtubeContainer.innerHTML = "";
    coinView.style.display = "none";
    starView.style.display = "none";
    questionView.style.display = "none";
    songView.style.display = "none";
    choiceView.style.display = "flex";

    if (bgMusic) {
      bgMusic.play().catch(() => {
        console.warn("Autoplay blocked again");
      });
    }

    if (currentEffectStop) currentEffectStop();
    if (backToHomeBtn) backToHomeBtn.style.display = "inline-block";
  }

  backButtonCoin.addEventListener("click", goBack);
  backButtonStar.addEventListener("click", goBack);
  backButtonQuestion.addEventListener("click", goBack);

  // --- ANIMATIONS ---

  // Chocolate
  let chocolateInterval;
  function startChocolateFall() {
    stopChocolateFall();
    chocolateInterval = setInterval(() => createChocolate(), 400);
  }
  function stopChocolateFall() {
    clearInterval(chocolateInterval);
    document.querySelectorAll('.chocolate-bar').forEach(choc => choc.remove());
  }
  function createChocolate() {
    const choc = document.createElement('div');
    choc.classList.add('chocolate-bar');
    const maxX = giftFrame.clientWidth - 70;
    const startX = Math.random() * maxX;
    const rotation = (Math.random() * 90) - 45;

    choc.style.left = `${startX}px`;
    choc.style.top = `-60px`;
    choc.style.transform = `rotate(${rotation}deg)`;
    giftFrame.appendChild(choc);

    let posY = -60;
    const fallSpeed = 0.8 + Math.random();
    const rotateSpeed = (Math.random() * 2 - 1);

    function fall() {
      posY += fallSpeed;
      let currentRotation = rotation + (posY * rotateSpeed * 0.1);
      choc.style.top = posY + 'px';
      choc.style.transform = `rotate(${currentRotation}deg)`;

      if (posY < giftFrame.clientHeight) {
        requestAnimationFrame(fall);
      } else {
        choc.remove();
      }
    }

    requestAnimationFrame(fall);
  }

  // Lasers
  let laserInterval;
  function startGlowingLasers() {
    stopGlowingLasers();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createGlowingLaser(), i * 200);
    }
    laserInterval = setInterval(createGlowingLaser, 800);
  }
  function stopGlowingLasers() {
    clearInterval(laserInterval);
    document.querySelectorAll('.glowing-laser').forEach(l => l.remove());
  }
  function createGlowingLaser() {
    const laserTypes = ['horizontal', 'vertical', 'diagonal'];
    const laserType = laserTypes[Math.floor(Math.random() * laserTypes.length)];
    const colors = ['#5ECC85', '#2A547E', '#2F879F', '#94DE7B'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const laser = document.createElement('div');
    laser.classList.add('glowing-laser');
    laser.style.position = 'absolute';
    laser.style.pointerEvents = 'none';
    laser.style.zIndex = '15';
    laser.style.background = `linear-gradient(90deg, ${color}, white, ${color})`;
    laser.style.boxShadow = `0 0 15px ${color}, 0 0 25px ${color}`;
    laser.style.borderRadius = '2px';

    let top, left, angle;
    switch (laserType) {
      case 'horizontal':
        laser.style.height = '6px';
        laser.style.width = '0';
        top = `${Math.random() * 60 + 20}%`;
        left = `${Math.random() * 30 + 35}%`;
        angle = (Math.random() * 30) - 15;
        break;
      case 'vertical':
        laser.style.width = '6px';
        laser.style.height = '0';
        top = `${Math.random() * 30 + 35}%`;
        left = `${Math.random() * 60 + 20}%`;
        angle = 90 + (Math.random() * 30 - 15);
        break;
      case 'diagonal':
        laser.style.height = '6px';
        laser.style.width = '0';
        top = `${Math.random() * 60 + 20}%`;
        left = `${Math.random() * 60 + 20}%`;
        angle = Math.random() * 360;
        break;
    }

    laser.style.top = top;
    laser.style.left = left;
    laser.style.transform = `rotate(${angle}deg)`;
    laser.style.transformOrigin = 'left center';

    const keyframes = (laserType === 'vertical')
      ? [{ height: '0', opacity: 1 }, { height: '200px', opacity: 1 }, { height: '250px', opacity: 0 }]
      : [{ width: '0', opacity: 1 }, { width: '180px', opacity: 1 }, { width: '230px', opacity: 0 }];

    laser.animate(keyframes, {
      duration: 1600,
      easing: 'ease-out'
    });

    starView.appendChild(laser);
    setTimeout(() => laser.remove(), 2000);
  }

  // Balloons
  let balloonInterval;
  function startBalloonFloat() {
    stopBalloonFloat();
    balloonInterval = setInterval(createBalloon, 800);
  }
  function stopBalloonFloat() {
    clearInterval(balloonInterval);
    document.querySelectorAll('.balloon').forEach(b => b.remove());
  }
  function createBalloon() {
    const balloonContainer = document.querySelector('.balloon-container');
    const balloon = document.createElement('img');
    balloon.src = 'assets/balloons.png';
    balloon.classList.add('balloon');
    const startLeft = Math.random() * 90 + 5;
    balloon.style.left = `${startLeft}%`;
    balloon.style.animationDuration = `${8 + Math.random() * 6}s`;
    balloon.style.width = `${50 + Math.random() * 20}px`;
    balloonContainer.appendChild(balloon);
    setTimeout(() => balloon.remove(), 15000);
  }
});
