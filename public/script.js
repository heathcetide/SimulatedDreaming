const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000; // 画布的宽度为1000，显示角色的部分
canvas.height = 600;

// 角色属性
let character = {
  x: 100,
  y: 450,
  width: 50,
  height: 50,
  speed: 2,
  dx: 0,
  dy: 0,
  jumping: false,
  doubleJumping: false,
  rolling: false, // 用于翻滚状态
  rollAngle: 0, // 用于旋转角度
  health: 100,
  mana: 100,
  experience: 0,
  level: 1,
  experienceToNextLevel: 100,
  critRate: 5,
  healthRegen: 1,
  manaRegen: 1,
  luck: 5,
  inventoryOpen: false,
  invincible: false,
  direction: "right",
  frameIndex: 0,
  frameTimer: 0,
  frameSpeed: 16,
  damageCooldown: false, // 用于判断是否在冷却时间内
};

// 加载角色的动画帧
const characterImages = {
  right: [new Image(), new Image(), new Image(), new Image()],
  left: [new Image(), new Image(), new Image(), new Image()],
};
characterImages.right[0].src = "./image/hero_right_1.png";
characterImages.right[1].src = "./image/hero_right_2.png";
characterImages.right[2].src = "./image/hero_right_3.png";
characterImages.right[3].src = "./image/hero_right_4.png";
characterImages.left[0].src = "./image/hero_left_1.png";
characterImages.left[1].src = "./image/hero_left_2.png";
characterImages.left[2].src = "./image/hero_left_3.png";
characterImages.left[3].src = "./image/hero_left_4.png";

let gameOverFlag = false;
let currentSection = 0;
// 光圈位置
let goal = { x: 4900, y: 450, width: 50, height: 50, active: false }; // 初始时光圈是隐藏的

let cameraOffsetX = 0; // 用于实现画布移动

// 按键事件
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
// 修改后的 canMoveRight 函数，确保角色不会超过地图宽度
function canMoveRight() {
  return character.x + character.width < 5000;
}

/**
 * 绘制背景
 */
const backgroundImage = new Image();
backgroundImage.src = "./image/background.png"; // 替换为你的背景图片路径

function drawBackground() {
  // 等待背景图片加载完成后绘制
  if (!backgroundImage.complete) {
    return;
  }

  // 获取画布的宽度和高度
  const canvasWidth = canvas.width;
  const canvasHeight = 500; // 背景图片的绘制高度，与角色脚下对齐

  // 获取背景图片的原始宽度和高度
  const bgWidth = backgroundImage.width;
  const bgHeight = backgroundImage.height;

  // 计算缩放比例，保持图片的宽高比
  const scaleX = canvasWidth / bgWidth;
  const scaleY = canvasHeight / bgHeight;
  const scale = Math.max(scaleX, scaleY); // 选择较大的比例，确保图片宽度或高度能覆盖画布

  // 计算绘制的宽度和高度
  const drawWidth = bgWidth * scale;
  const drawHeight = bgHeight * scale;

  // 计算偏移量以居中绘制
  const offsetX = (canvasWidth - drawWidth) / 2;
  const offsetY = 0; // 背景从顶部开始绘制，不需要垂直方向的偏移

  // 绘制背景图片，保持宽高比并覆盖画布的上半部分
  ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
}

/**
 * 绘制地面
 */
const groundTile = new Image();
groundTile.src = "./image/brick.png"; // 替换为你的地砖图片路径

function drawGround() {
  const groundY = 500; // 地面 y 坐标位置，角色的脚下
  const tileWidth = 50; // 将地砖宽度设置为 50 像素
  const tileHeight = 50; // 将地砖高度设置为 50 像素
  const tileCount = Math.ceil(canvas.width / tileWidth) + 1; // 计算需要多少个地砖才能铺满整个画布宽度，多加一个确保足够

  // 等待地砖图片加载完成后绘制
  if (!groundTile.complete) {
    return;
  }

  // 绘制地砖铺设
  for (let i = -1; i < tileCount; i++) {
    // 根据摄像机偏移量调整地砖的 x 坐标，使得地砖相对画布平滑移动
    let tileX = i * tileWidth - (cameraOffsetX % tileWidth);

    // 绘制地面砖的第一层，使用指定的宽度和高度
    ctx.drawImage(groundTile, tileX, groundY, tileWidth, tileHeight);

    // 绘制地面砖的第二层（为了确保垂直方向的覆盖），使用指定的宽度和高度
    ctx.drawImage(
      groundTile,
      tileX,
      groundY + tileHeight,
      tileWidth,
      tileHeight
    );
  }
}

let lastKeyPress = null; // 记录上一次按下的键
let lastKeyPressTime = 0; // 记录上一次按键的时间
const doublePressInterval = 600; // 设置双击间隔时间，单位为毫秒
const normalSpeed = character.speed; // 保存角色的正常速度
const runSpeed = character.speed * 1.25; // 奔跑速度是正常速度的两倍
let isRunning = false; // 判断是否处于奔跑状态

function keyDown(e) {
  const currentTime = Date.now(); // 获取当前时间

  if (e.key === "a") {
    if (
      lastKeyPress === "a" &&
      currentTime - lastKeyPressTime < doublePressInterval
    ) {
      isRunning = true; // 触发奔跑
      character.speed = runSpeed; // 增加角色速度
    } else {
      isRunning = false; // 恢复正常速度
      character.speed = normalSpeed;
    }
    lastKeyPress = "a";
    lastKeyPressTime = currentTime;
    character.dx = -character.speed;
    character.direction = "left";
  } else if (e.key === "d") {
    if (
      lastKeyPress === "d" &&
      currentTime - lastKeyPressTime < doublePressInterval
    ) {
      isRunning = true; // 触发奔跑
      character.speed = runSpeed; // 增加角色速度
    } else {
      isRunning = false; // 恢复正常速度
      character.speed = normalSpeed;
    }
    lastKeyPress = "d";
    lastKeyPressTime = currentTime;
    if (canMoveRight()) {
      character.dx = character.speed;
      character.direction = "right";
    } else {
      character.dx = 0;
    }
  } else if (e.key === "k") {
    if (!character.jumping) {
      character.dy = -15; // 跳跃的力量
      character.jumping = true;
    } else if (!character.doubleJumping) {
      character.dy = -15; // 二段跳跃的力量
      character.doubleJumping = true;
      character.rolling = true; // 激活翻滚状态
      character.rollAngle = 0; // 初始化翻滚角度
    }
  } else if (e.key === "j") {
    attack();
  } else if (e.key === "y") {
    dash();
  } else if (e.key === "l") {
    parabolicAttack();
  } else if (e.key === "w") {
    console.log("按下了W键");
    if (
      character.x >= goal.x &&
      character.x <= goal.x + goal.width &&
      goal.active
    ) {
      console.log("进入光圈范围，退出关卡");
      exitLevel(); // 退出关卡
    }
  }else if (e.key === "c") {
    toggleInventory();
  } else if (e.key === "u") {
    useUSkill(); // 按下U键时使用技能
  } else if (e.key === "i") {
    console.log("进入光圈范围，退出关卡");
    exitLevel(); // 退出关卡
  }
}

// 修改后的 dash 函数，防止角色冲出边界
function dash() {
  if (character.mana >= 20) {
    // 消耗部分蓝量
    character.mana -= 20;
    character.invincible = true; // 无敌状态

    // 根据角色当前方向决定目标位置
    const directionMultiplier = character.direction === "right" ? 1 : -1;
    let targetX = character.x + 300 * directionMultiplier; // 目标位置，依据角色的方向

    // 防止角色冲出地图边界
    if (targetX < 0) targetX = 0;
    if (targetX + character.width > 5000) targetX = 5000 - character.width;

    let moveStep = 15 * directionMultiplier; // 每次移动的步长，依据角色的方向

    let moveInterval = setInterval(() => {
      // 判断角色是否达到了目标位置
      if (
        (directionMultiplier === 1 && character.x < targetX) ||
        (directionMultiplier === -1 && character.x > targetX)
      ) {
        character.x += moveStep;
      } else {
        clearInterval(moveInterval);
        character.invincible = false; // 无敌状态持续时间结束
      }
    }, 20); // 每20毫秒移动一次，产生移动痕迹的效果
  }
}

// 加载落点特效的图片
const impactEffectImages = [];
for (let i = 0; i < 10; i++) {
  const img = new Image();
  img.src = `./image/impact_effect_${i}.png`; // 替换为你的落点特效帧图片路径
  impactEffectImages.push(img);
}
class ImpactEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100; // 特效的宽度
    this.height = 100; // 特效的高度
    this.frameIndex = 0; // 当前帧索引
    this.frameSpeed = 15; // 每隔多少帧切换一次图片，将其设为15以减缓动画速度
    this.frameTimer = 0; // 控制图片切换的计时器
    this.done = false; // 特效是否播放完成
  }

  // 更新特效
  update() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex++; // 切换到下一帧
      if (this.frameIndex >= impactEffectImages.length) {
        this.done = true; // 如果已经播放完所有帧，则标记为完成
      }
    }
  }

  // 绘制特效
  draw(ctx, cameraOffsetX) {
    if (!this.done) {
      ctx.drawImage(
        impactEffectImages[this.frameIndex],
        this.x - cameraOffsetX - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }
  }
}

let impactEffects = []; // 用于存储所有正在播放的落点特效

// 旋转攻击技能（改为自然落下的抛物线并增加飞行距离）
function parabolicAttack() {
  if (character.mana >= 40) {
    // 消耗一定量的蓝
    character.mana -= 40;
    character.invincible = true; // 在飞行期间角色无敌

    const startX = character.x; // 攻击的起始位置（水平）
    const startY = character.y; // 攻击的起始位置（高度）
    const direction = character.direction === "right" ? 1 : -1; // 根据角色面朝的方向
    const maxFlightDistance = 500; // 增加角色可以飞出的最大水平距离
    let velocityX = 8 * direction; // 增加水平方向初速度，使得飞行距离更远
    let velocityY = -18; // 初始竖直方向速度，向上抛，稍微增加抛出高度
    const gravity = 0.7; // 重力加速度，决定下落速度

    function performParabolicMove() {
      // 更新角色的位置
      character.x += velocityX;
      character.y += velocityY;

      // 重力影响，让角色下落
      velocityY += gravity;

      // 检测是否击中地面
      if (character.y >= 453) {
        character.y = 453; // 落到地面
        character.invincible = false; // 取消无敌状态
        character.dy = 0; // 停止竖直方向运动

        // 在落点处创建一个落点特效
        impactEffects.push(new ImpactEffect(character.x, character.y));

        return; // 结束攻击技能
      }

      // 检测攻击范围，击中敌人
      enemies.forEach((enemy) => {
        if (enemy.alive) {
          const distance = Math.sqrt(
            Math.pow(character.x - enemy.x, 2) +
              Math.pow(character.y - enemy.y, 2)
          );
          if (distance < character.width) {
            enemy.health -= 70; // 抛物线攻击造成伤害
            enemy.showHealthBar = true;
            if (enemy.health <= 0) {
              enemy.alive = false;
              gainExperience(50);
            }
          }
        }
      });

      // 绘制抛物线攻击的动画效果
      clear(); // 清除画布
      drawBackground();
      drawGround();
      drawCharacter();
      drawEnemies();
      drawGoal();
      drawSkills();
      drawEffects(); // 绘制其他特效（包括落点特效）
      if (character.inventoryOpen) drawFullInventory();

      // 如果角色还未落地，继续动画
      requestAnimationFrame(performParabolicMove);
    }

    // 启动抛物线动画
    requestAnimationFrame(performParabolicMove);
  }
}

function keyUp(e) {
  if (e.key === "a" || e.key === "d") {
    character.dx = 0;
    isRunning = false;
    character.speed = normalSpeed; // 松开按键后恢复正常速度
  }
}

// 切换背包
function toggleInventory() {
  character.inventoryOpen = !character.inventoryOpen;
  if (character.inventoryOpen) {
    character.dx = 0;
    drawFullInventory();
  }
}

// 最高高度限制
const maxHeight = 200; // 角色的最高位置（y 越小，表示角色越高）

function update() {
  if (character.inventoryOpen) return; // 如果背包开启，游戏暂停

  character.x += character.dx;
  character.y += character.dy;

  // 更新摄像机位置
  cameraOffsetX = character.x - canvas.width / 2;
  cameraOffsetX = Math.max(cameraOffsetX, 0); // 不让摄像机左移到画布外
  cameraOffsetX = Math.min(cameraOffsetX, 4000); // 不让摄像机右移到画布外

  // 如果角色跳得太高，则会开始坠落
  if (character.y < maxHeight) {
    character.dy += 2; // 增加坠落速度，加速向下（可以调节这个值以控制坠落速度）
  }

  // 重力效果
  if (character.jumping) {
    character.dy += 0.8; // 正常的重力加速度
  }

  // 地面检测
  if (character.y >= 453) {
    character.y = 453;
    character.dy = 0;
    character.jumping = false;
    character.doubleJumping = false;
  }

  // 边界限制
  if (character.x < 0) {
    character.x = 0;
  } else if (character.x + character.width > 5000) {
    // 5000为整个游戏地图的宽度
    character.x = 5000 - character.width;
  }

  // 更新角色的动画帧
  if (character.dx !== 0) {
    character.frameTimer++;
    if (character.frameTimer >= character.frameSpeed) {
      character.frameTimer = 0;
      character.frameIndex =
        (character.frameIndex + 1) %
        characterImages[character.direction].length;
    }
  } else {
    character.frameIndex = 0;
  }

  // 敌人移动逻辑
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      // 敌人随机移动
      if (Math.random() < 0.01) {
        enemy.direction *= -1;
      }
      enemy.x += enemy.speed * enemy.direction;

      // 保持敌人之间的间隙
      enemy.x = Math.max(enemy.x, Math.floor(enemy.x / 1000) * 1000);
      enemy.x = Math.min(
        enemy.x,
        Math.floor(enemy.x / 1000) * 1000 + 1000 - enemy.width
      );

      // 敌人追踪角色
      const distanceToCharacter = Math.abs(character.x - enemy.x);
      if (distanceToCharacter < 200) {
        // 敌人追踪范围
        if (character.x < enemy.x) {
          enemy.x -= enemy.speed;
        } else {
          enemy.x += enemy.speed;
        }
      }
    }

    // 角色与敌人碰撞检测并触发反弹效果
if (
    enemy.alive &&
    !character.invincible && // 如果角色处于无敌状态，则不会受到伤害
    !character.damageCooldown && // 如果角色在冷却时间内，也不会受到伤害
    character.x < enemy.x + enemy.width &&
    character.x + character.width > enemy.x &&
    character.y < enemy.y + enemy.height &&
    character.y + character.height > enemy.y
  ) {
    // 角色受到伤害
    character.health -= enemy.damage;
    character.damageCooldown = true; // 开启伤害冷却时间
  
    // 设置最大水平偏移量
    const maxHorizontalOffset = 3; // 每次被撞击时，水平方向上最多偏移 6
  
    // 碰撞反弹效果，减小反弹力度
    let bounceBackForce = maxHorizontalOffset; // 将反弹力度设为最大偏移量
    const bounceUpForce = 0; // 设置垂直反弹力为 0
  
    if (character.x < enemy.x) {
      character.dx = -bounceBackForce; // 向左反弹，但限制偏移不超过 30px
    } else {
      character.dx = bounceBackForce; // 向右反弹，但限制偏移不超过 30px
    }
  
    character.dy = bounceUpForce; // 垂直方向上的反弹力
  
    // 确保不会因为反弹飞出边界
    if (character.x < 0) character.x = 0;
    if (character.x + character.width > 5000)
      character.x = 5000 - character.width;
  
    // 如果角色血量耗尽，触发游戏结束逻辑
    if (character.health <= 0 && !gameOverFlag) {
      character.health = 0;
      gameOverFlag = true;
      gameOver();
    }
  
    // 设置冷却时间为 0.5 秒（500 毫秒）
    setTimeout(() => {
      character.damageCooldown = false; // 解除冷却状态
    }, 500); // 500毫秒的冷却时间
  }
  
  });

  // 检测是否所有敌人都被击败
  if (!goal.active) {
    const allEnemiesDefeated = enemies.every((enemy) => !enemy.alive);
    if (allEnemiesDefeated) {
      goal.active = true; // 激活光圈
    }
  }

  // 回血和回蓝
  if (character.health < 100) {
    character.health = Math.min(
      character.health + character.healthRegen / 60,
      100
    );
  }
  if (character.mana < 100) {
    character.mana = Math.min(character.mana + character.manaRegen / 60, 100);
  }
  // 更新所有的漩涡动画
  vortexEffects.forEach((vortex) => {
    vortex.update();
    vortex.checkDamage(enemies); // 检测是否有敌人在伤害范围内
  });

  // 更新所有的小伤害圈动画
  damageCircles.forEach((circle) => {
    circle.update();
    circle.checkDamage(enemies); // 检测是否有敌人在伤害范围内
  });

  // 移除播放完成的漩涡和伤害圈
  vortexEffects = vortexEffects.filter((vortex) => !vortex.done);
  damageCircles = damageCircles.filter((circle) => !circle.done);
}

// 绘制角色
function drawCharacter() {
  ctx.save(); // 保存画布的当前状态

  // 计算角色的中心点
  const centerX = character.x - cameraOffsetX + character.width / 2;
  const centerY = character.y + character.height / 2;

  // 如果角色正在翻滚，应用旋转
  if (character.rolling) {
    // 根据角色方向调整旋转方向
    if (character.direction === "right") {
      character.rollAngle += 0.03; // 右方向顺时针翻转，每帧增加的角度（从 0.2 改为 0.05，减缓翻滚速度）
    } else {
      character.rollAngle -= 0.03; // 左方向逆时针翻转，每帧减少的角度（从 0.2 改为 0.05，减缓翻滚速度）
    }

    // 将画布的原点移动到角色的中心点
    ctx.translate(centerX, centerY);
    // 旋转画布
    ctx.rotate(character.rollAngle);
    // 将画布的原点移回去
    ctx.translate(-centerX, -centerY);
  }

  // 绘制角色图像
  const characterImage =
    characterImages[character.direction][character.frameIndex];
  ctx.drawImage(
    characterImage,
    character.x - cameraOffsetX,
    character.y,
    character.width,
    character.height
  );

  // 恢复画布状态
  ctx.restore();

  // 绘制角色信息
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`Health: ${character.health}`, 10, 20);
  ctx.fillText(`Mana: ${character.mana}`, 10, 40);
  ctx.fillText(
    `Experience: ${character.experience}/${character.experienceToNextLevel}`,
    10,
    60
  );
  ctx.fillText(`Level: ${character.level}`, 10, 80);
  ctx.fillText(`Crit Rate: ${character.critRate}%`, 10, 100);
  ctx.fillText(`Health Regen: ${character.healthRegen}`, 10, 120);
  ctx.fillText(`Mana Regen: ${character.manaRegen}`, 10, 140);
  ctx.fillText(`Luck: ${character.luck}`, 10, 160);

  // 停止翻滚状态
  if (character.y >= 453) {
    character.rolling = false; // 停止翻滚状态
    character.doubleJumping = false; // 重置二段跳状态
  }
}

// 绘制敌人
function drawEnemies() {
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      // 更新敌人的动画帧
      enemy.frameTimer++;
      if (enemy.frameTimer >= enemy.frameSpeed) {
        enemy.frameTimer = 0;
        enemy.frameIndex = (enemy.frameIndex + 1) % 3; // 共有3帧动画
      }

      // 选择敌人当前的动画帧
      const enemyImage =
        enemy.direction === 1
          ? enemy.images.right[enemy.frameIndex]
          : enemy.images.left[enemy.frameIndex];

      // 绘制敌人
      ctx.drawImage(
        enemyImage,
        enemy.x - cameraOffsetX,
        enemy.y,
        enemy.width,
        enemy.height
      );

      // 绘制敌人血条（只有在受到攻击后显示）
      if (enemy.showHealthBar) {
        ctx.fillStyle = "black";
        ctx.fillRect(enemy.x - cameraOffsetX, enemy.y - 10, enemy.width, 5);
        ctx.fillStyle = "red";
        ctx.fillRect(
          enemy.x - cameraOffsetX,
          enemy.y - 10,
          enemy.width * (enemy.health / 100),
          5
        );
      }
    }
  });
}

// 绘制背包（全屏模式）
function drawFullInventory() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Inventory", 50, 50);
  ctx.fillText(`Health: ${character.health}`, 50, 100);
  ctx.fillText(`Mana: ${character.mana}`, 50, 140);
  ctx.fillText(`Crit Rate: ${character.critRate}%`, 50, 180);
  ctx.fillText(`Health Regen: ${character.healthRegen}`, 50, 220);
  ctx.fillText(`Mana Regen: ${character.manaRegen}`, 50, 260);
  ctx.fillText(`Luck: ${character.luck}`, 50, 300);
  // 可以扩展显示更多的装备、物品等
}

// 绘制技能信息
function drawSkills() {
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Skills:", 10, canvas.height - 60);
  ctx.fillText("Y: Dash (20 Mana)", 10, canvas.height - 40);
  ctx.fillText("L: Parabolic (40 Mana)", 10, canvas.height - 20);
  ctx.fillText("U: PiercingEye (50 Mana)", 10, canvas.height);
}

const attackEffectImages = [];
for (let i = 0; i < 8; i++) {
  const img = new Image();
  img.src = `./image/attack_effect_${i}.png`; // 替换为你的特效帧图片路径
  attackEffectImages.push(img);
}
class AttackEffect {
  constructor(direction, x, y) {
    this.x = direction === "right" ? x + character.width : x - 50;
    this.y = y - 20;
    this.width = 100; // 特效的宽度
    this.height = 100; // 特效的高度
    this.direction = direction;
    this.frameIndex = 0; // 当前帧索引
    this.frameSpeed = 15; // 每隔多少帧切换一次图片
    this.frameTimer = 0; // 控制图片切换的计时器
    this.done = false; // 特效是否播放完成
    this.angle = (45 * Math.PI) / 180; // 将角度转换为弧度，顺时针旋转 45 度
  }

  // 更新特效
  update() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex++; // 切换到下一帧
      if (this.frameIndex >= attackEffectImages.length) {
        this.done = true; // 如果已经播放完所有帧，则标记为完成
      }
    }
  }

  // 绘制特效
  draw(ctx, cameraOffsetX) {
    if (!this.done) {
      ctx.save(); // 保存当前画布状态

      // 计算图片的中心点
      const centerX = this.x - cameraOffsetX + this.width / 2;
      const centerY = this.y + this.height / 2;

      // 移动画布到特效的中心点
      ctx.translate(centerX, centerY);

      // 顺时针旋转 45 度
      ctx.rotate(this.angle);

      // 因为旋转后坐标系改变，绘制时要回退图片中心点
      ctx.drawImage(
        attackEffectImages[this.frameIndex],
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );

      ctx.restore(); // 恢复画布状态，确保不影响后续绘制
    }
  }
}

let effects = []; // 用于存储所有正在播放的特效

// 普通攻击（J键）
function attack() {
  const attackRange = 80; // 定义攻击范围

  // 根据角色方向创建攻击特效
  effects.push(new AttackEffect(character.direction, character.x, character.y));

  // 检测敌人是否在攻击范围内
  enemies.forEach((enemy) => {
    if (
      enemy.alive &&
      character.x + character.width >= enemy.x - attackRange &&
      character.x <= enemy.x + enemy.width + attackRange
    ) {
      enemy.health -= 20;
      enemy.showHealthBar = true;
      if (enemy.health <= 0) {
        enemy.alive = false;
        gainExperience(50); // 击杀敌人增加经验值
      }
    }
  });
}

// 增加经验值
function gainExperience(amount) {
  character.experience += amount;
  if (character.experience >= character.experienceToNextLevel) {
    character.experience -= character.experienceToNextLevel;
    character.level++;
    character.health += 20; // 升级增加生命值
    character.mana += 20; // 升级增加蓝量
    character.experienceToNextLevel += 50; // 每次升级需要更多经验
  }
}

// 敌人图片库
const enemyImages = [
  {
    left: [
      "./image/enemy_left1.png",
      "./image/enemy_left2.png",
      "./image/enemy_left3.png",
    ],
    right: [
      "./image/enemy_right1.png",
      "./image/enemy_right2.png",
      "./image/enemy_right3.png",
    ],
  },
  {
    left: [
      "./image/enemy_left_1.png",
      "./image/enemy_left_2.png",
      "./image/enemy_left_3.png",
    ],
    right: [
      "./image/enemy_right_1.png",
      "./image/enemy_right_2.png",
      "./image/enemy_right_3.png",
    ],
  },
];

// 预加载敌人动画帧
let enemyImageObjects = enemyImages.map((enemy) => {
  return {
    right: enemy.right.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    }),
    left: enemy.left.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    }),
  };
});

// 敌人属性
let enemies = [];
for (let i = 0; i < 5; i++) {
  // 将敌人分为5个部分，每个部分5个敌人
  for (let j = 0; j < 5; j++) {
    const enemyImages =
      enemyImageObjects[Math.floor(Math.random() * enemyImageObjects.length)]; // 随机选择一种敌人动画
    enemies.push({
      x: 1000 * i + 700 + j * 200, // 每个部分之间相距较远，确保部分之间间隔很大
      y: 450,
      width: 50,
      height: 65,
      health: 100,
      alive: false,
      showHealthBar: false,
      damage: 10,
      speed: 1,
      direction: Math.random() < 0.5 ? -1 : 1, // 初始随机移动方向
      images: enemyImages, // 保存敌人的动画图片对象
      frameIndex: 0, // 动画帧的索引
      frameTimer: 0,
      frameSpeed: 20, // 控制动画速度
    });
  }
}

// 游戏结束
function gameOver() {
  setTimeout(() => {
    if (confirm("角色死亡。是否重来？")) {
      resetGame();
    } else {
      window.close();
    }
  }, 100);
}

function exitLevel() {
    // 更新玩家状态
    character.health = 100 + character.level * 20; // 每次升级，增加20点血量上限
    character.mana = 100 + character.level * 20;   // 同理增加蓝量
    character.experience = 0;                      // 清空当前经验
    character.experienceToNextLevel += 50;         // 升级后增加到下一级所需经验
  
    // 发送请求更新数据库
    updatePlayerData({
      level: character.level,
      experience: character.experience,
      health: character.health,
      mana: character.mana,
    });
  
    // 显示退出关卡的提示
    setTimeout(() => {
      alert("恭喜你完成了关卡！");
      showMapSelection(); // 显示地图选择界面
    }, 100);
  }
  
  // 更新玩家数据到后端
  async function updatePlayerData(playerData) {
    try {
      const response = await fetch("/update-player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
      });
  
      if (response.ok) {
        console.log("玩家数据更新成功！");
      } else {
        console.error("更新玩家数据失败！");
      }
    } catch (error) {
      console.error("发送请求时出错：", error);
    }
  }
  
const goalEffectImages = [];
for (let i = 0; i < 7; i++) {
  // 假设有 8 帧特效
  const img = new Image();
  img.src = `./image/goal_effect_${i}.png`; // 替换为你的出口特效帧图片路径
  goalEffectImages.push(img);
}
class GoalEffect {
  constructor(x, y) {
    this.x = x; // 出口特效的位置
    this.y = y;
    this.width = 100; // 特效的宽度
    this.height = 100; // 特效的高度
    this.frameIndex = 0; // 当前帧索引
    this.frameSpeed = 25; // 每隔多少帧切换一次图片, 设置为15以减慢动画速度
    this.frameTimer = 0; // 控制图片切换的计时器
    this.angle = 0; // 初始角度
    this.rotationSpeed = 0.05; // 旋转速度
  }

  update() {
    // 更新帧动画
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex++; // 切换到下一帧
      if (this.frameIndex >= goalEffectImages.length) {
        this.frameIndex = 0; // 回到第一帧，循环播放
      }
    }

    // 更新旋转角度
    this.angle += this.rotationSpeed;
  }

  draw(ctx, cameraOffsetX) {
    ctx.save(); // 保存当前画布状态

    // 计算图片的中心点
    const centerX = this.x - cameraOffsetX + this.width / 2;
    const centerY = this.y + this.height / 2;

    // 移动画布到特效的中心点
    ctx.translate(centerX, centerY);

    // 应用旋转效果
    ctx.rotate(this.angle);

    // 绘制当前帧的图片
    ctx.drawImage(
      goalEffectImages[this.frameIndex],
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    ctx.restore(); // 恢复画布状态，确保不影响后续绘制
  }
}

let goalEffect = null; // 用于存储出口特效

// 检测是否所有敌人都被击败，激活出口特效
if (!goal.active) {
    const allEnemiesDefeated = enemies.every((enemy) => !enemy.alive);
    if (allEnemiesDefeated) {
      goal.active = true;  // 激活光圈
      goalEffect = new GoalEffect(goal.x, goal.y); // 创建光圈的特效对象
    }
  }
  
// 在 `drawGoal()` 中绘制旋转特效
function drawGoal() {
    if (goal.active) {
        console.log("光圈已激活");
        goalEffect.update(); // 更新特效状态
        goalEffect.draw(ctx, cameraOffsetX); // 绘制特效
      }
      
  if (goal.active && goalEffect) {
    goalEffect.update(); // 更新特效状态
    goalEffect.draw(ctx, cameraOffsetX); // 绘制特效
  }
}

// 重置游戏
function resetGame() {
  character.x = 100;
  character.y = 450;
  character.health = 100;
  character.mana = 100;
  character.experience = 0;
  character.level = 1;
  character.experienceToNextLevel = 100;
  gameOverFlag = false;
  goal.active = false; // 重置光圈状态为不可见
  enemies.forEach((enemy, index) => {
    enemy.health = 100;
    enemy.alive = true;
    enemy.showHealthBar = false;
    enemy.x = 1000 * Math.floor(index / 5) + 700 + (index % 5) * 200; // 确保敌人分布在每部分区域并且保持间隔
  });
}

let mapImage = new Image();
mapImage.src = "./image/map.png"; // 替换为你的地图图片路径
let selectedMap = null; // 用于记录选择的关卡

// 显示地图界面
function showMapSelection() {
  clear(); // 清除画布
  ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height); // 绘制地图

  // 绘制关卡选择区域（例如森林、沙漠、山脉、城市）
  drawMapSection("Forest", 100, 100, 200, 200);
  drawMapSection("Desert", 300, 100, 200, 200);
  drawMapSection("Mountains", 500, 100, 200, 200);
  drawMapSection("City", 700, 100, 200, 200);

  // 如果用户选择了关卡，绘制选择的关卡提示
  if (selectedMap) {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`You selected: ${selectedMap}`, 50, canvas.height - 50);
  }

  // 如果用户点击了关卡，启动对应关卡
  if (selectedMap) {
    setTimeout(() => {
      startLevel(selectedMap); // 启动关卡
    }, 1000); // 延迟1秒后开始关卡
  } else {
    requestAnimationFrame(showMapSelection); // 持续绘制地图界面
  }
}

function startLevel(map) {
  if (map === "Forest") {
    resetGame(); // 初始化游戏状态
    character.x = 100; // 设置角色初始位置
    character.y = 450;
    // 设置森林关卡的具体内容，如敌人、地形等
    // ...
  } else if (map === "Desert") {
    resetGame();
    character.x = 100;
    character.y = 450;
    // 设置沙漠关卡的具体内容
    // ...
  } else if (map === "Mountains") {
    resetGame();
    character.x = 100;
    character.y = 450;
    // 设置山脉关卡的具体内容
    // ...
  } else if (map === "City") {
    resetGame();
    character.x = 100;
    character.y = 450;
    // 设置城市关卡的具体内容
    // ...
  }

  gameLoop(); // 重新启动游戏循环
}

// 漩涡动画的图片
const vortexImages = [];
for (let i = 0; i < 21; i++) {
  const img = new Image();
  img.src = `./image/vortex_${i}.png`; // 替换为你的漩涡动画帧路径
  vortexImages.push(img);
}

// 小伤害圈动画的图片
const damageCircleImages = [];
for (let i = 0; i < 15; i++) {
  const img = new Image();
  img.src = `./image/damage_circle_${i}.png`; // 替换为你的伤害圈动画帧路径
  damageCircleImages.push(img);
}

class VortexEffect {
  constructor(x, y) {
    this.x = x; // 漩涡中心 x 坐标
    this.y = y; // 漩涡中心 y 坐标
    this.width = 300; // 漩涡的宽度
    this.height = 150; // 漩涡的高度
    this.frameIndex = 0; // 当前帧索引
    this.frameSpeed = 5; // 每隔多少帧切换一次图片
    this.frameTimer = 0; // 控制图片切换的计时器
    this.done = false; // 动画是否播放完成
    this.damageRadius = 150; // 漩涡的伤害范围（半径）
  }

  update() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex++; // 切换到下一帧
      if (this.frameIndex >= vortexImages.length) {
        this.done = true; // 如果已经播放完所有帧，则标记为完成
      }
    }
  }

  draw(ctx, cameraOffsetX) {
    if (!this.done) {
      ctx.drawImage(
        vortexImages[this.frameIndex],
        this.x - cameraOffsetX - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }
  }

  // 检测敌人是否在漩涡范围内，并对敌人造成伤害
  checkDamage(enemies) {
    enemies.forEach((enemy) => {
      const distance = Math.sqrt(
        Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2)
      );
      if (distance < this.damageRadius && enemy.alive) {
        enemy.health -= 10; // 漩涡每次造成 10 点伤害
        enemy.showHealthBar = true;
        if (enemy.health <= 0) {
          enemy.alive = false;
          gainExperience(50);
        }
      }
    });
  }
}

class DamageCircle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100; // 小伤害圈的宽度
    this.height = 100; // 小伤害圈的高度
    this.frameIndex = 0; // 当前帧索引
    this.frameSpeed = 5; // 每隔多少帧切换一次图片
    this.frameTimer = 0; // 控制图片切换的计时器
    this.done = false; // 动画是否播放完成
    this.damageRadius = 50; // 小伤害圈的伤害范围（半径）
  }

  update() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex++;
      if (this.frameIndex >= damageCircleImages.length) {
        this.done = true; // 如果已经播放完所有帧，则标记为完成
      }
    }
  }

  draw(ctx, cameraOffsetX) {
    if (!this.done) {
      ctx.drawImage(
        damageCircleImages[this.frameIndex],
        this.x - cameraOffsetX - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }
  }

  // 检测敌人是否在伤害圈范围内，并对敌人造成伤害
  checkDamage(enemies) {
    enemies.forEach((enemy) => {
      const distance = Math.sqrt(
        Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2)
      );
      if (distance < this.damageRadius && enemy.alive) {
        enemy.health -= 20; // 小伤害圈每次造成 20 点伤害
        enemy.showHealthBar = true;
        if (enemy.health <= 0) {
          enemy.alive = false;
          gainExperience(50);
        }
      }
    });
  }
}

let vortexEffects = []; // 用于存储所有正在播放的漩涡动画
let damageCircles = []; // 用于存储所有正在播放的伤害圈动画

// 定义U技能，生成漩涡和伤害圈
function useUSkill() {
  if (character.mana >= 50) {
    // 消耗一定量的蓝
    character.mana -= 50;
    // 生成一个围绕角色的漩涡
    vortexEffects.push(new VortexEffect(character.x, character.y));

    // 生成多个围绕漩涡的小伤害圈
    for (let i = 0; i < 5; i++) {
      const angle = i * ((Math.PI * 2) / 5); // 分布在漩涡周围的不同角度
      const radius = 200; // 距离角色的半径
      const x = character.x + radius * Math.cos(angle);
      const y = character.y + radius * Math.sin(angle);
      damageCircles.push(new DamageCircle(x, y));
    }
  }
}

function drawEffects() {
  // 绘制所有的漩涡动画
  vortexEffects.forEach((vortex) => {
    vortex.draw(ctx, cameraOffsetX);
  });

  // 绘制所有的小伤害圈动画
  damageCircles.forEach((circle) => {
    circle.draw(ctx, cameraOffsetX);
  });

  // 绘制所有的落点特效
  impactEffects.forEach((effect) => {
    effect.update();
    effect.draw(ctx, cameraOffsetX);
  });

  // 更新并绘制每一个正在播放的特效
  effects.forEach((effect) => {
    effect.update(); // 更新特效状态（播放帧动画）
    effect.draw(ctx, cameraOffsetX); // 绘制特效
  });

  // 移除播放完成的特效
  effects = effects.filter((effect) => !effect.done);
  impactEffects = impactEffects.filter((effect) => !effect.done); // 移除已经播放完成的落点特效
}

// 绘制关卡区域
function drawMapSection(name, x, y, width, height) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  ctx.fillText(name, x + 20, y + 40);
}

// 检测用户点击的关卡
canvas.addEventListener("click", function (event) {
  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;

  // 检查点击的区域是否在某个关卡区域内
  if (mouseX >= 100 && mouseX <= 300 && mouseY >= 100 && mouseY <= 300) {
    selectedMap = "Forest";
  } else if (mouseX >= 300 && mouseX <= 500 && mouseY >= 100 && mouseY <= 300) {
    selectedMap = "Desert";
  } else if (mouseX >= 500 && mouseX <= 700 && mouseY >= 100 && mouseY <= 300) {
    selectedMap = "Mountains";
  } else if (mouseX >= 700 && mouseX <= 900 && mouseY >= 100 && mouseY <= 300) {
    selectedMap = "City";
  }
});
canvas.addEventListener("mousemove", function (event) {
  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;

  // 根据鼠标位置显示不同的效果，例如高亮某个关卡区域
  // ...
});

// 清除画布
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 游戏主循环
function gameLoop() {
  clear(); // 清除画布
  drawBackground(); // 先绘制背景
  drawGround(); // 绘制地面
  update(); // 更新游戏状态（包括角色、敌人、技能等）
  drawCharacter(); // 绘制角色
  drawEnemies(); // 绘制敌人
  drawGoal(); // 绘制光圈（目标）
  drawSkills(); // 绘制技能信息
  drawEffects(); // 绘制正在显示的特效

  if (character.inventoryOpen) drawFullInventory(); // 如果打开背包，绘制背包

  requestAnimationFrame(gameLoop); // 循环调用
}

// 3秒后生成敌人
setTimeout(() => {
  enemies.forEach((enemy) => {
    enemy.alive = true;
  });
}, 3000);

// 启动游戏
gameLoop();

document.getElementById("new-game-btn").addEventListener("click", () => {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("character-selection").style.display = "block";
});

document.getElementById("load-game-btn").addEventListener("click", () => {
  loadGame();
});

async function loadGame() {
  try {
    const response = await fetch("/load-game");
    const data = await response.json();

    if (data.exists) {
      // 显示存档选择菜单
      const saveSlotsDiv = document.getElementById("save-slots");
      saveSlotsDiv.innerHTML = ""; // 清空之前的内容

      data.saveData.forEach((save, index) => {
        const saveButton = document.createElement("button");
        saveButton.textContent = `存档 ${index + 1}: 角色 ID ${
          save.characterId
        }, 等级 ${save.level}`;
        saveButton.addEventListener("click", () => {
          startGameWithSave(save);
        });
        saveSlotsDiv.appendChild(saveButton);
      });

      document.getElementById("main-menu").style.display = "none";
      document.getElementById("load-game-menu").style.display = "block";
    } else {
      alert("没有找到存档");
    }
  } catch (error) {
    console.error("读取存档时出错:", error);
    alert("读取存档时发生错误，请稍后再试");
  }
}

function selectCharacter(characterId) {
  fetch("/new-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ characterId }),
  }).then((response) => {
    if (response.ok) {
      // 新建存档成功，跳转到地图界面
      showMapSelection();
    } else {
      alert("创建新游戏时出错");
    }
  });
}

function startGameWithSave(saveData) {
  // 使用存档数据进入地图选择界面，而不是直接进入关卡
  character = { ...character, ...saveData }; // 将存档数据应用到角色属性中
  showMapSelection();
}

function showMapSelection() {
  // 显示地图选择界面，隐藏其他界面
  document.getElementById("character-selection").style.display = "none";
  document.getElementById("load-game-menu").style.display = "none";
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("map-selection").style.display = "block";
  document.getElementById("gameCanvas").style.display = "none";
}

// 地图选择逻辑
function selectMap(map) {
  // 根据用户选择的地图进行相应设置
  console.log(`选择了地图：${map}`);
  // 在这里可以根据不同地图来设置不同的场景和敌人
  // 例如设置背景图片、敌人类型等

  startGame(map);
}

function startGame(map) {
  // 显示游戏画布，隐藏地图选择界面
  document.getElementById("map-selection").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";

  // 初始化游戏状态
  initializeGameForMap(map);

  // 启动游戏循环
  gameLoop();
}

function initializeGameForMap(map) {
  // 根据选择的地图初始化游戏环境
  switch (map) {
    case "Forest":
      // 设置森林的背景、敌人和其他相关数据
      console.log("初始化森林场景");
      backgroundImage.src = "./image/forest_background.png"; // 假设有一个森林背景
      // 在这里设置森林的敌人等其他属性
      break;
    case "Desert":
      console.log("初始化沙漠场景");
      backgroundImage.src = "./image/desert_background.png"; // 沙漠背景
      groundTile.src = "./image/desert_brick.png"; // 设置沙漠的地砖
      // 设置沙漠的敌人等其他属性
      break;
    case "Mountains":
      console.log("初始化山脉场景");
      backgroundImage.src = "./image/mountain_background.png"; // 山脉背景
      groundTile.src = "./image/mountain_brick.png"; // 设置山脉的地砖
      // 设置山脉的敌人等其他属性
      break;
    case "City":
      console.log("初始化城市场景");
      backgroundImage.src = "./image/city_background.png"; // 城市背景
      groundTile.src = "./image/city_brick.png"; // 设置城市的地砖
      // 设置城市的敌人等其他属性
      break;
    default:
      console.error("未知地图");
  }

  // 重新初始化角色和敌人等属性
  resetGame();
}
function previewMap(map) {
    const mapSelectionDiv = document.getElementById('map-selection');
    
    switch (map) {
      case 'Forest':
        mapSelectionDiv.style.backgroundImage = "url('./image/forest_background.png')";
        break;
      case 'Desert':
        mapSelectionDiv.style.backgroundImage = "url('./image/desert_background.png')";
        break;
      case 'Mountains':
        mapSelectionDiv.style.backgroundImage = "url('./image/mountain_background.png')";
        break;
      case 'City':
        mapSelectionDiv.style.backgroundImage = "url('./image/city_background.png')";
        break;
    }
  
    // 设置背景覆盖整个容器并居中
    mapSelectionDiv.style.backgroundSize = 'cover';
    mapSelectionDiv.style.backgroundPosition = 'center';
  }
  
  function resetPreview() {
    const mapSelectionDiv = document.getElementById('map-selection');
    mapSelectionDiv.style.backgroundImage = "url('./image/background.png')";
    mapSelectionDiv.style.backgroundSize = 'cover';
    mapSelectionDiv.style.backgroundPosition = 'center';
  }
  