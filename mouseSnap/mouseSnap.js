// 根据标签名称获取dom元素
function getElementFn(param) {
  return document.getElementsByTagName(param)
}
// 返回指定属性名的属性值 (valD:默认值)
// 通过元素节点的属性名称获取属性的值
function getElementAttrFn(dom, key, valD) {
  if (key == 'color') {
    return valD
  }
  return dom.getAttribute(key) || valD
}

function getOptionsFn() {
  var domData = getElementFn('script')
  var dataLength = domData.length
  var scriptDom = domData[dataLength - 1]
  return {
    tagLength: dataLength,
    zIndex: getElementAttrFn(scriptDom, 'zIndex', -1), //层级
    opacity: getElementAttrFn(scriptDom, 'opacity', 1), //透明度
    color: getElementAttrFn(scriptDom, 'color', `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`), //颜色///没有感觉管用
    count: getElementAttrFn(scriptDom, 'count', 100) //线条数量
  }
}

// 获取canvas的宽高同时为canvas设置宽高
function getWidthOrHeight() {
  ;(canvasWidth = canvas.width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth),
    (canvasHeight = canvas.height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight)
}

//  获取requestAnimationFrame方法
// 浏览器可以优化并行的动画动作，更合理的重新排列动作序列，并把能够合并的动作放在一个渲染周期内完成，从而呈现出更流畅的动画效果
function getRequestAnimationFrameFn() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    ((callBack) => {
      window.setTimeout(callBack, 1000 / 45)
    })
  )
}

function drawLineFn() {
  clearCanvas()
  randomPointList.forEach((item, index) => {
    item.typeAX += item.typeBX
    item.typeAY += item.typeBY
    item.typeBX *= item.typeAX > canvasWidth || item.typeAX < 0 ? -1 : 1
    item.typeBY *= item.typeAY > canvasHeight || item.typeAY < 0 ? -1 : 1
    // 线段连接点
    // contextObj.fillRect(item.typeAX - 2.5, item.typeAY - 2.5, 5, 5)
    // 线段圆形连接点绘制
    contextObj.fillStyle = styleOptions.color
    contextObj.beginPath()
    contextObj.arc(item.typeAX - 0.5, item.typeAY - 0.5, 2.5, 0, Math.PI * 2, true);
    contextObj.closePath();
    contextObj.fill();
    for (let e = index + 1; e < randomOptions.length; e++) {
      let randomOpItem = randomOptions[e]
      if (randomOpItem.typeAX !== null && randomOpItem.typeAY !== null) {
        // 两点横坐标差值
        let diffX = item.typeAX - randomOpItem.typeAX
        // 两点纵坐标差值
        let diffY = item.typeAY - randomOpItem.typeAY
        // 计算两点间线段的距离
        let pointDis = diffX * diffX + diffY * diffY
        if (pointDis < randomOpItem.max) {
          if (randomOpItem == curMouseXY && pointDis >= randomOpItem.max / 2) {
            item.typeAX -= 0.03 * diffX
            item.typeAY -= 0.03 * diffY
          }
          let lineW = ((randomOpItem.max - pointDis) / randomOpItem.max)*1.5
          contextObj.beginPath()
          // 线宽
          contextObj.lineWidth = lineW
          contextObj.strokeStyle = styleOptions.color
          contextObj.moveTo(item.typeAX, item.typeAY)
          contextObj.lineTo(randomOpItem.typeAX, randomOpItem.typeAY)
          contextObj.stroke()
        }
      }
    }
  })
  var animationFn = getRequestAnimationFrameFn()
  animationFn(drawLineFn)
}

// 清空画布
function clearCanvas() {
  contextObj.clearRect(0, 0, canvasWidth, canvasHeight)
}

// 通过随机取值得到的参数位置
var randomOptions = []
// 当前鼠标位置
var curMouseXY = { typeAX: null, typeAY: null, max: 20000 }
// 获取线条的配置参数
var styleOptions = getOptionsFn()
console.log(styleOptions)
// canvas宽度
var canvasWidth = ''
// canvas高度
var canvasHeight = ''
// 创建canvas标签
var canvas = document.createElement('canvas')
// 获取context对象
var contextObj = canvas.getContext('2d')
// 为canvas设置id
canvas.id = `canvas${styleOptions.tagLength}`
// 为canvas设置style
canvas.style.cssText = `position:fixed;top:0;left:0;z-index:${styleOptions.zIndex};opacity:${styleOptions.opacity}`
// 将canvas插入body
var bodyDom = getElementFn('body')[0]
bodyDom.appendChild(canvas)
// 获取canvas的宽高同时为canvas设置宽高
getWidthOrHeight()


// 窗户变化重新获取宽高
window.onresize = getWidthOrHeight()
// 鼠标移动事件
window.onmousemove = function (event) {
  event = event ? event : window.event
  curMouseXY.typeAX = event.clientX
  curMouseXY.typeAY = event.clientY
}
// 鼠标移出事件
window.onmouseout = function () {
  curMouseXY.typeAX = null
  curMouseXY.typeAY = null
}

// 随机组合点坐标
var randomPointList = []
for (f = 0; f < styleOptions.count; f++) {
  randomPointList.push({
    typeAX: Math.random() * canvasWidth,
    typeAY: Math.random() * canvasHeight,
    typeBX: 2 * Math.random() - 1,
    typeBY: 2 * Math.random() - 1,
    max: 40000 // 用来控制线段的长度
  })
}

randomOptions = randomPointList.concat([curMouseXY])
setTimeout(function () {
  drawLineFn()
}, 100)
