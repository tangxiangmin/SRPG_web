
// 展示伤害动画
export function showDamage(x, y, num) {
  const dom = document.querySelector(`.row:nth-child(${x + 1}) .cell:nth-child(${y + 1})`)

  let div = document.createElement('div')
  div.innerHTML = `- ${num}`
  div.classList.add('damage')
  // @ts-ignore
  const {offsetTop, offsetLeft} = dom
  div.style.top = offsetTop + 'px'
  div.style.left = offsetLeft + 'px'
  div.addEventListener('animationend', () => {
    div.parentNode.removeChild(div)
  })

  document.body.appendChild(div)
}
