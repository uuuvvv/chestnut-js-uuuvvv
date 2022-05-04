((window) => {

  /** @type {HTMLCanvasElement} */
  let canDom = document.getElementById('myCanvas')
  let canW = canDom.width;
  let canH = canDom.height;
  let arr = [];
  init();
  function init() {
    arr = randomP(canW, canH, 100)
    drawP(arr);
    let timer = setInterval(function () {
       arr = computedR(arr);
      drawP(arr);
    },60)
  }
 

// 计算半径，替换坐标
  function computedR(arr) {
    let jb = 0.2 * Math.random();
    let ac = 2.5;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if ((item.r - jb > 0 || item.r + jb > ac) && !item.a) {
       item.r = item.r - jb
      } else {
        item.r = item.r + jb
        item.a = true
        if (item.r + jb > ac) {
          item.a = false
        }
      }
    }
    return arr;
  }
  // 画点
  function drawP(arr) {
     let canDom = document.getElementById('myCanvas')
    let ctx = canDom.getContext('2d')
    ctx.clearRect(0, 0, canW, canH);
    for (let i = 0; i < arr.length; i++){
      let p = arr[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = p.c;
      ctx.fill();
    }
   
  }

  // 随机生成坐标信息
  function randomP(w, y, count) {
    let arr = [];
    for (let i = 0; i < count; i++) {
      let obj = {
        x: Math.random() * w,
        y: Math.random() * y,
        r: Math.random() * 2.5,
        a: false,
        c: `rgba(${Math.random() *255},${Math.random() *255},${Math.random() *255}, ${Math.random() *1})`
      }
      arr.push(obj);
    }
    return arr
  }

})(window)