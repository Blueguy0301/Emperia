export function options() {
  let main = document.getElementById('main')
  let holder = document.getElementById('options')
  let option = document.getElementsByClassName('option')
  let sort = Array.from(option).filter(el => el.hasAttribute('sort'))
  sort = Array.from(sort).sort(
    (a, b) => a.getAttribute('sort') - b.getAttribute('sort')
  )
  if (window.innerWidth <= 768) {
    for (let i = 0; i < sort.length; i++) holder.appendChild(sort[i])
  } else {
    for (let i = 0; i < sort.length; i++) main.appendChild(sort[i])
  }
}
