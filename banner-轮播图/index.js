;(function (w) {
  let ulDom = document.getElementsByClassName('banner-lists')[0]
  let imgNameList = ['01', '02', '03', '04', '01']

  // 图片自动滚动
  function toAutoTransFn(transTime, gapTime) {
    let index = 0
    setInterval(function () {
      ulDom.style.transition = transTime
      ulDom.style.left = `${-300 * index}px`
      if (index == imgNameList.length) {
        index = 0
        ulDom.style.left = '0px'
        ulDom.style.transition = '0s'
      }
      index += 1
    }, gapTime)
  }

  toAutoTransFn('1.5s', 1500)
  toAppendElementFn(ulDom, imgNameList)
  // 根据数据去生成banner子节点
  function toAppendElementFn(fatherDom, imgNames) {
    for (let i = 0; i < imgNames.length; i++) {
      let item = imgNames[i]
      let liDom = document.createElement('li')
      let imgDom = document.createElement('img')
      imgDom.src = `./images/${item}.png`
      fatherDom.appendChild(liDom)
      liDom.appendChild(imgDom)
    }
  }
})(window)
