import info from '/info.mjs';

const domain = info.domain;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', () => {
    handleInfo();
    handleFullScreen();
    handleGameItemMore();
    setRecommendGames();
    checkAndShowRatingModal();
});

function handleInfo() {
    const gamePlayBox = document.getElementById('game-play-box');
    const guide = document.getElementById('guide');
    const loading = document.getElementById('loading');
    document.title = chrome.i18n.getMessage('extensionGameTitle');
    document.getElementById('game-left-title').textContent = chrome.i18n.getMessage('extensionGameTitle');
    const gameFrame = document.getElementById('gameFrame');
    setTimeout(() => {
        window.addEventListener('message', async (event) => {
            if (event.data.type === 'game-loaded') {
                loading.remove();
            }
        })
        gameFrame.src = `${info.iframeSrc}?id=${chrome.runtime.id}&n=${info.packageName}`;
    }, 0);
    document.getElementById('game-title').textContent = chrome.i18n.getMessage('extensionName');
    document.getElementById('guide-item-text').textContent = chrome.i18n.getMessage('pinGuideText');
    document.getElementById('guide-item-done-button').textContent = chrome.i18n.getMessage('pinGuideDone');


    const installTime = localStorage.getItem('installTime');
    if (!installTime) {
        localStorage.setItem('installTime', Date.now());
    }

    const hasShownGuide = localStorage.getItem('hasShownGuide');
    if (!hasShownGuide) {
        guide.style.display = 'block';
        localStorage.setItem('hasShownGuide', 'true');
    }

    document.addEventListener('click', (event) => {
        if (!guide.contains(event.target)) {
            guide.remove();
        }
    });

    document.getElementById('guide-item-done-button').addEventListener('click', () => {
        guide.remove();
    });
}

function handleGameItemMore() {
    const gameItemMore = document.getElementById('game-item-more');
    const gameItemMoreContent = document.getElementById('game-item-more-content');
    const gameItemMoreIcon = document.querySelector('.game-item-more-icon');
    gameItemMoreContent.textContent = chrome.i18n.getMessage('playMoreGames');
    gameItemMore.addEventListener('click', () => {
        chrome.tabs.create({ url: `${domain}/more-games?i=${chrome.runtime.id}&n=${chrome.i18n.getMessage('extensionGameTitle')}&s=${info.symbolStr}&c=${info.category}` });
    });
    let iconIndex = 0;
    const iconArr = ['0.png', '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png'];
    setInterval(() => {
        gameItemMoreIcon.src = '/images/game-icon/' + iconArr[iconIndex];
        gameItemMoreIcon.classList.add('hithere');
        setTimeout(() => {
            gameItemMoreIcon.classList.remove('hithere');
        }, 1000);
        iconIndex++;
        if (iconIndex >= iconArr.length) {
            iconIndex = 0;
        }
    }, 4000);
}


async function setRecommendGames() {
    await sleep(10);

    const installTime = parseInt(localStorage.getItem('installTime'));
    if (installTime && Date.now() - installTime < 1000 * 60 * 60 * 24 * 1) {
        return;
    }
    try {
        const response = await fetch('https://game-extension-api.offlinegames.fun/recommend/');
        const data = await response.json();

        if (!data.enable) {
            return;
        }

        const recommendBox1 = document.querySelector('.recommend-box-1');
        const recommendBox2 = document.querySelector('.recommend-box-2');

        if (data['recommend-1']) {
            recommendBox1.innerHTML = `<iframe src="${data['recommend-1']}" width="100%" height="100%"></iframe>`;
            recommendBox1.style.display = 'block';
        }
        if (data['recommend-2']) {
            recommendBox2.innerHTML = `<iframe src="${data['recommend-2']}" width="100%" height="100%"></iframe>`;
            recommendBox2.style.display = 'block';
        }
    } catch (err) {

    }
}

// function handleGames() {
//     const gameContain = document.querySelector('.game-contain');
//     const gamePlayBox = document.getElementById('game-play-box');
//     for (let i = 0; i < 2; i++) {
//         const game = document.createElement('div');
//         game.className = `game-item game-item-small`;
//         game.innerHTML = `
//             <a href="" title="">
//                 <img alt="" loading="lazy">
//                 <div class="game-item-title">
//                     <span class="game-item-title-text"></span>
//                 </div>
//             </a>
//         `;
//         gameContain.insertBefore(game, gamePlayBox);
//     }
//     for (let i = 0; i < 80; i++) {
//         const game = document.createElement('div');
//         game.className = `game-item game-item-small`;
//         game.innerHTML = `
//             <a href="" title="">
//                 <img src="" alt="" loading="lazy">
//                 <div class="game-item-title">
//                     <span class="game-item-title-text"></span>
//                 </div>
//             </a>
//         `;
//         gameContain.appendChild(game);
//     }
//     gamePlayBox.style.opacity = '1';
// }

// function getMoreGames() {
//     const games = JSON.parse(localStorage.getItem('games'));
//     if (games && games.length > 0) {
//         setGames(games);
//     }
//     const symbolStr = info.symbolStr;
//     const url = `${domain}/api/recommend/${symbolStr}`;
//     fetch(url).then(res => res.json()).then(data => {
//         //console.log(data);
//         if (data.code === 0) {
//             const games = data.data;
//             setGames(games);
//             localStorage.setItem('games', JSON.stringify(games));
//         }
//     });
// }

// function transformGameIcon(game) {
//     if (game.size === 'small') {
//         return game.icon + '-128.png';
//     } else if (game.size === 'medium') {
//         return game.icon + '-300.png';
//     } else if (game.size === 'large') {
//         return game.icon + '-512.png';
//     } else if (game.size === 'wide') {
//         return game.thumbnail + '-300.png';
//     } else if (game.size === 'wide-large') {
//         return game.thumbnail + '-512.png';
//     } else if (game.size === 'narrow') {
//         return game.thumbnail + '-128.png';
//     }
// }

// function setGames(games) {
//     const gameItems = document.querySelectorAll('.game-item');
//     // 更新现有的 game-item 元素
//     gameItems.forEach((item, index) => {
//         if (index < games.length) {
//             const game = games[index];
//             const link = item.querySelector('a');
//             const img = item.querySelector('img');
//             const titleText = item.querySelector('.game-item-title-text');

//             if (index < 50) {
//                 item.className = `game-item game-item-small`;
//             } else {
//                 item.className = `game-item game-item-small`;
//             }

//             link.href = `${domain}/game/${game.slug}`;
//             link.target = '_blank';
//             link.title = game.title;
//             if (game.size === 'small') {
//                 img.src = game.icon + '-128.png';
//             } else if (game.size === 'medium') {
//                 img.src = game.icon + '-256.png';
//             } else if (game.size === 'large') {
//                 img.src = game.icon + '-512.png';
//             }


//             img.alt = game.title;
//             titleText.textContent = game.title;
//         } else {
//             // 移除多余的 game-item
//             item.remove();
//         }
//     });

//     // 如果数据比现有元素多,需要添加新的元素
//     const gameContain = document.querySelector('.game-contain');
//     //const gamePlayBox = document.getElementById('game-play-box');

//     for (let i = gameItems.length; i < games.length; i++) {
//         const game = games[i];
//         const gameElement = document.createElement('div');
//         gameElement.className = `game-item game-item-${game.size}`;
//         gameElement.innerHTML = `
//         <a href="${domain}/game/${game.slug}" target="_blank" title="${game.title}">
//             <img src="${game.icon + '-128.png'}" alt="${game.title}" loading="lazy">
//             <div class="game-item-title">
//                 <span class="game-item-title-text">${game.title}</span>
//             </div>
//         </a>
//         `;
//         gameContain.appendChild(gameElement);
//     }
// }

function handleFullScreen() {
    const webFullIcon = document.getElementById('game-play-icon-web-full');
    const fullScreenIcon = document.getElementById('game-play-icon-full-screen');
    const content = document.querySelector('.game-play-box');
    const gameItemMore = document.getElementById('game-item-more');
    const gameFrame = document.getElementById('gameFrame');

    fullScreenIcon.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            webFullIcon.style.display = 'block';
        } else {
            content.requestFullscreen();
            exitWebFull();
            webFullIcon.style.display = 'none';
        }
    });
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullScreenIcon.style.backgroundImage = 'url("/images/unfull.png")';
            gameItemMore.style.display = 'none';
            document.body.classList.add('full-screen');
        } else {
            fullScreenIcon.style.backgroundImage = 'url("/images/full.png")';
            webFullIcon.style.display = 'block';
            gameItemMore.style.display = 'flex';
            document.body.classList.remove('full-screen');
        }
        gameFrame.focus();
    });


    function webFull() {
        const content = document.querySelector('.game-play-box');
        content.classList.add('game-play-box-web-full');
        content.dataset.isWebFull = 'true';
        webFullIcon.style.backgroundImage = 'url("/images/unwebfull.png")';
        document.body.style.overflow = 'hidden';
        gameItemMore.style.display = 'none';
        document.body.classList.add('web-full');
    }
    function exitWebFull() {
        const content = document.querySelector('.game-play-box');
        content.classList.remove('game-play-box-web-full');
        content.dataset.isWebFull = 'false';
        webFullIcon.style.backgroundImage = 'url("/images/webfull.png")';
        document.body.style.overflow = 'auto';
        gameItemMore.style.display = 'flex';
        document.body.classList.remove('web-full');
    }

    webFullIcon.addEventListener('click', () => {
        const content = document.querySelector('.game-play-box');
        if (content.dataset.isWebFull === 'true') {
            exitWebFull();
        } else {
            webFull();
        }
        gameFrame.focus();
    });
}

function checkAndShowRatingModal() {
    // 获取打开次数
    let openCount = localStorage.getItem('openCount') || 0;
    openCount = parseInt(openCount) + 1;
    localStorage.setItem('openCount', openCount);

    // 检查是否已经评分
    const hasRated = localStorage.getItem('hasRated');

    // 如果是第5次打开且未评分，显示弹窗
    if (openCount === 5 && !hasRated) {
        showRatingModal();
    }
}

function showRatingModal() {
    const modal = document.getElementById('rating-modal');
    const ratingTitle = document.getElementById('rating-title');
    const cancelBtn = document.getElementById('rating-btn-cancel');
    const submitBtn = document.getElementById('rating-btn-submit');
    const stars = document.querySelectorAll('.rating-star');

    // 设置文本
    ratingTitle.textContent = chrome.i18n.getMessage('commentRemind');
    cancelBtn.textContent = chrome.i18n.getMessage('noThanks');
    submitBtn.textContent = chrome.i18n.getMessage('rateNow');

    // 显示弹窗
    modal.style.display = 'flex';

    // 直接将所有星星设置为激活状态（黄色）
    stars.forEach(star => {
        star.classList.add('active');
    });

    // 取消按钮
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        // 记录用户已经看过评分弹窗，避免再次显示
        localStorage.setItem('hasRated', 'dismissed');
    });

    // 提交按钮 - 直接跳转到商店页面，不需要检查评分
    submitBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        // 记录用户已评分
        localStorage.setItem('hasRated', 'true');

        // 直接打开评分页面
        window.open(`https://chrome.google.com/webstore/detail/${chrome.runtime.id}/reviews`, '_blank');
    });
}