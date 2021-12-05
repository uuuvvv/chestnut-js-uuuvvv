((w) => {
  // canvas代码提示
  /** @type {HTMLCanvasElement} */
  let mapCan = document.getElementById("mapCanId");
  let cxt = mapCan.getContext("2d");
  // 获取canvas的宽高
  let width = mapCan.width;
  let height = mapCan.height;
  // 获取等分点，以及单位宽高；
  let { point, intXUnit, intYUnit } = getPoint(width, height);

  // 画线，cross代表横线上的点，纵线
  drawLine("cross", cxt, point.pointWBagin, 50, 750);
  drawLine("", cxt, point.pointYBegin, 50, 750);
  drawStar(intXUnit, intYUnit, cxt);
  getMousePoint(intXUnit, intYUnit);
})(window);

/**
 * @method getMousePoint 获取鼠标的点击点
 */
function getMousePoint(intX, intY) {
  let mapCan = document.getElementById("mapCanId");
  let index = 0;
  let pointList = [];
  // 将整个棋盘看成一个矩阵，使用二维数组对每一个焦点进行代替
  let list = new Array(15);
  for (var i = 0; i < 15; i++) {
    list[i] = new Array(15);
    for (var j = 0; j < 15; j++) {
      list[i][j] = 0;
    }
  }
  mapCan.addEventListener("mousedown", (e) => {
    let { pointX, pointY } = getPosition(e.offsetX, e.offsetY, intX, intY);
    let flag = true;
    let obj = {
      pointX,
      pointY,
    };
    if (pointX <= 0 || pointX >= 800 || pointY <= 0 || pointY >= 800) return;
    for (let i = 0; i < pointList.length; i++) {
      let item = pointList[i];
      if (item.pointX == pointX && item.pointY == pointY) {
        flag = false;
        alert("此处已经有子");
      }
    }
    if (flag) {
      let color = "black";
      if (index % 2 == 0) {
        color = "black";
      } else {
        color = "white";
      }
      drawBall(pointX, pointY, intX, color);
      pointList.push(obj);
      let item = [
        parseInt((obj.pointX - 50) / intX),
        parseInt((obj.pointY - 50) / intX),
      ];
      index++;
      console.log(list);
      // 根据黑棋为1，白棋为2，进行分类
      let num = color == "black" ? 1 : 2;
      color == "black"
        ? (list[item[0]][item[1]] = 1)
        : (list[item[0]][item[1]] = 2);
      // 根据当前位置，在数组判断成功与否；
      checkWin(list, num, item[0], item[1]);
    }
  });
}

// 画棋子方法 根据坐标点，大小，颜色绘出对应的棋子
function drawBall(pointX, pointY, intX, color) {
  let mapCan = document.getElementById("mapCanId");
  var ctx = mapCan.getContext("2d");
  ctx.beginPath();
  ctx.arc(pointX, pointY, intX / 2 - 2, 0, 2 * Math.PI);

  ctx.fillStyle = color; //填充颜色,默认是黑色
  ctx.fill(); //画实心圆
}

// 获取棋子圆心坐标点
function getPosition(x, y, intX, intY) {
  let pointX = Math.round((x - 50) / intX) * intX + 50;
  let pointY = Math.round((y - 50) / intY) * intY + 50;
  return { pointX, pointY };
}

/**
 * @method getPoint 获取画布画网格的始/终坐标点
 * @param {*} w 画布宽度
 * @param {*} h 画布高度
 * @returns 返回所有边上的坐标点
 */
function getPoint(w, h) {
  let cop = 14;
  w = w - 100;
  h = h - 100;
  let point = {
    pointWBagin: [], //宽度17等分
    pointYBegin: [], //高度17等分
  };
  let intXUnit = w / cop; //单位宽度
  let intYUnit = h / cop; //单位高度
  for (let i = 0; i < cop + 1; i++) {
    point.pointWBagin.push((w / cop) * i + 50);
    point.pointYBegin.push((h / cop) * i + 50);
  }
  return { point, intXUnit, intYUnit };
}

// 绘出棋盘上的天元和星；（也就是小圆点）
function drawStar(intX, intY, ctx, color = "white") {
  let r = 10;
  let pointXArr = [intX * 3, intX * 11];
  let pointYArr = [intY * 3, intY * 11];
  pointYArr.map((itemY) => {
    pointXArr.map((itemX) => {
      ctx.beginPath();
      ctx.arc(itemX + 50, itemY + 50, r, 0, 2 * Math.PI);
      ctx.fillStyle = color; //填充颜色,默认是黑色
      ctx.fill(); //画实心圆
    });
  });
  ctx.beginPath();
  ctx.arc(intX * 7 + 50, intY * 7 + 50, r, 0, 2 * Math.PI);
  ctx.fillStyle = color; //填充颜色,默认是黑色
  ctx.fill(); //画实心圆
}

/**
 *
 * @param {String} type 线方向
 * @param {Object} cxt  画笔对象
 * @param {Array} list  17等分点
 * @param {*} y 初始坐标
 * @param {*} y2  宽度/高度坐标
 */
function drawLine(type, cxt, list, y, y2) {
  for (let i = 0; i < list.length; i++) {
    if (type == "cross") {
      cxt.moveTo(list[i], y);
      cxt.lineTo(list[i], y2);
    } else {
      cxt.moveTo(y, list[i]);
      cxt.lineTo(y2, list[i]);
    }
    cxt.strokeStyle = "white";
    cxt.stroke();
  }
}
// 判断当前是否已经产生了winner
function checkWin(list, num, curX, curY) {
  // 上下
  let n1 = 0;
  // 左右
  let n2 = 0;
  // 左上右下
  let n3 = 0;
  // 右上左下
  let n4 = 0;

  // 判断上下是否练成五子
  for (let i = curY; i >= 0; i--) {
    if (list[curX][i] != num) {
      break;
    }
    n1++;
  }
  for (let i = curY + 1; i < 15; i++) {
    if (list[curX][i] != num) {
      break;
    }
    n1++;
  }

  // 判断左右是否练成五子
  for (let i = curX; i >= 0; i--) {
    if (list[i][curY] != num) {
      break;
    }
    n2++;
  }
  for (let i = curX + 1; i < 15; i++) {
    if (list[i][curY] != num) {
      break;
    }
    n2++;
  }
  // 判断左上右下是否练成五子
  for (let i = curX, j = curY; i >= 0, j >= 0; i--, j--) {
    if (i < 0 || j < 0 || list[i][j] != num) {
      break;
    }
    n3++;
  }
  for (let i = curX + 1, j = curY + 1; i < 15, j < 15; i++, j++) {
    if (i < 0 || j < 0 || list[i][j] != num) {
      break;
    }
    n3++;
  }
  // 判断右上左下是否练成五子
  for (let i = curX, j = curY; i >= 0, j < 15; i--, j++) {
    if (i < 0 || j >= 15 || list[i][j] != num) {
      break;
    }
    n4++;
  }
  for (let i = curX + 1, j = curY - 1; i < 15, j >= 0; i++, j--) {
    if (i >= 15 || j < 0 || list[i][j] != num) {
      break;
    }
    n4++;
  }
  let text =
    n1 >= 5 || n2 >= 5 || n3 >= 5 || n4 >= 5
      ? num == 1
        ? "黑棋赢了"
        : "白棋赢了"
      : "";
  if (!text) return;
  alert(text);
}
