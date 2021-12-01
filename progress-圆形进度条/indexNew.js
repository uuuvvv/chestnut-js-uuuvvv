((w) => {



  // /** @type {HTMLCanvasElement} */
  // 获取canvas标签元素
  let canvasDom = document.getElementById('canvas')
  // 创建 context 对象
  let context = canvasDom.getContext('2d')

  let closeProgressFlag = false
  let closeBtnDom = document.getElementById('closeBtn');
  let timer = "";
  console.log('closeBtnDom', closeBtnDom)

  closeBtnDom.onclick = () => {
    if (closeProgressFlag) {
      clearInterval(timer)
      closeProgressFlag = false;
      closeBtnDom.innerHTML = '播放'
      console.log('关闭');
    } else {
      closeProgressFlag = true;
      console.log('播放');
      closeBtnDom.innerHTML = '关闭'
      toChangeDrawFn()
    }
  }



  // 基础圆形的配置
  let circleBasicOption = initCircleOptionFn('basic', 10, '#000', '#ccc', canvasDom.width, canvasDom.height, 0, 1, false)
  // 圆形进度条的配置
  let circleProgressOption = initCircleOptionFn('change', 10, 'red', '', canvasDom.width, canvasDom.height, 100, 1, false)

  init()

  function init() {
    console.log(circleBasicOption, )
    // 清空画布
    clearAllCanvasFn();
    // 绘制不变的基础
    toDrawCircleLineFn(circleBasicOption, circleProgressOption);
    toChangeDrawFn();
  }

  function toChangeDrawFn() {
    timer = setInterval(() => {
      circleProgressOption.speed += 1;
      if (circleProgressOption.speed > 90) {
        clearInterval(timer)
        return false;
      }
      closeProgressFlag = true;
      toDrawCircleLineFn(circleProgressOption)
    }, 1000)
  }
  /**
   * @function initCircleOptionFn
   * @description 用来初始化圆形进度条关键配置参数
   * @param type:string 当前基础还是进度条本身
   * @param lineWidth:number 线宽
   * @param lineColor:string 线的颜色
   * @param fillColor:string 圆形填充颜色
   * @param elementW: number 元素宽度 - 用来判断画线中心点横坐标 
   * @param elementH: number 元素高度 - 用来判断画线中心点纵坐标
   * @param copies:number 份数-将整个圆进行等分份数
   * @param speed:number 绘画速度
   * @param clockwise:boolean 顺逆时针-false 顺时针;true 逆时针
   */
  function initCircleOptionFn(type, lineWidth, lineColor, fillColor, elementW, elementH, copies, speed, clockwise) {
    let optionsObj = {
      type,
      lineWidth,
      lineColor,
      fillColor,
      centerX: elementW / 2,
      centerY: elementH / 2,
      speed,
      clockwise
    }
    // 非变化部分需要画整个圆无需计算等分角度
    if (type == "change") {
      optionsObj.arcDeg = Math.PI * 2 / copies
    }
    return optionsObj;
  }


  /**
   * @function toDrawCircleLineFn
   * @description 绘图方法
   * @param {Object} options 配置选项
   */
  function toDrawCircleLineFn(options) {
    // 绘画半径
    let radiusCircle = (canvasDom.width / 2) - (2 * options.lineWidth);
    // 起始弧度
    let arcBegin = options.type == "change" ? options.clockwise ? -2 * Math.PI : 0 : 0;
    // 结束弧度
    let arcOver = options.type == "change" ? (options.clockwise ? -2 * Math.PI - options.speed * options.arcDeg : options.speed * options.arcDeg) : 2 * Math.PI
    context.save();
    // 配置画笔
    // 填充颜色
    context.fillStyle = options.fillColor
    context.lineWidth = options.lineWidth
    context.strokeStyle = options.lineColor
    // 开始绘画
    context.beginPath();
    // arc 用于圆弧的绘制
    context.arc(options.centerX, options.centerY, radiusCircle, arcBegin, arcOver, options.clockwise)
    if (options.type == 'basic') {
      context.fill()
    }
    context.stroke()
    if (options.type == 'change') {
      context.closePath()
    }
    context.restore()
  }

  // 清除画布
  function clearAllCanvasFn() {
    context.clearRect(0, 0, canvasDom.width, canvasDom.height)
  }
})(window)