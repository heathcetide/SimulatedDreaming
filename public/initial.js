// 获取页面元素
const initialPage = document.getElementById('initialPage');
const characterSelectPage = document.getElementById('characterSelectPage');
const gameCanvas = document.getElementById('gameCanvas');
const newGameBtn = document.getElementById('newGameBtn');
const loadGameBtn = document.getElementById('loadGameBtn');
const characters = document.querySelectorAll('.character');

// 点击“新的开始”按钮，进入角色选择页面
newGameBtn.addEventListener('click', () => {
    initialPage.classList.add('hidden');
    characterSelectPage.classList.remove('hidden');
});

// 点击“读取存档”按钮，检查服务器上是否有存档
loadGameBtn.addEventListener('click', () => {
    // 从服务器读取存档信息
    fetch('/load-game')
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                alert('发现存档，准备加载...');
                // 隐藏初始页面，显示游戏画布
                initialPage.classList.add('hidden');
                gameCanvas.classList.remove('hidden');
                document.querySelector('script.hidden').classList.remove('hidden'); // 加载游戏逻辑脚本
                startGameWithSavedData(data);
            } else {
                alert('没有找到存档。请开始新的游戏。');
            }
        })
        .catch(err => console.error('读取存档时出错:', err));
});

// 选择角色
characters.forEach(character => {
    character.addEventListener('click', () => {
        const characterId = character.dataset.id;

        // 将选择的角色发送到服务器以创建存档
        fetch('/new-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ characterId: characterId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('角色创建成功！准备开始游戏...');
                    // 隐藏角色选择页面，显示游戏画布
                    characterSelectPage.classList.add('hidden');
                    gameCanvas.classList.remove('hidden');
                    document.querySelector('script.hidden').classList.remove('hidden'); // 加载游戏逻辑脚本
                    startGameWithCharacter(characterId);
                }
            })
            .catch(err => console.error('创建新游戏时出错:', err));
    });
});

// 处理开始游戏逻辑
function startGameWithCharacter(characterId) {
    // 初始化游戏数据
    console.log(`启动角色 ID: ${characterId}`);
    // 可以在这里传递角色 ID 给主游戏逻辑
    gameLoop();
}

function startGameWithSavedData(savedData) {
    // 使用保存的数据初始化游戏
    console.log(`加载存档: ${JSON.stringify(savedData)}`);
    // 可以在这里初始化游戏状态
    gameLoop();
}
