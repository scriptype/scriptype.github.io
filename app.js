const last = array => array[array.length - 1]

const worksButtons = document.querySelectorAll('[data-works-button]')
const workContainers = document.querySelectorAll('[data-work-container]')
worksButtons.forEach(button => {
  const container = Array.from(workContainers).find(container => {
    return container.dataset.workContainer === button.dataset.worksButton
  })
  button.addEventListener('click', e => {
    worksButtons.forEach(btn => btn.classList.remove('works-button--active'))
    workContainers.forEach(con => con.classList.remove('work-container--active'))
    button.classList.add('works-button--active')
    container.classList.add('work-container--active')
  })
})

const changeWorkButtons = document.querySelectorAll('[data-change-work-button]')
const works = document.querySelectorAll('[data-work]')
const codePenContainer = document.querySelector('[data-work-container="codepen"]')
changeWorkButtons.forEach(button => {
  button.addEventListener('click', e => {
    const activeWork = document.querySelector('.work--active')
    works.forEach(work => {
      work.classList.remove('work--active')
    })
    const activeIndex = Array.from(works).indexOf(activeWork)
    const isNext = button.dataset.changeWorkButton === 'next'
    const newActiveWork = works[activeIndex + (isNext ? 1 : -1)]
    newActiveWork.classList.add('work--active')
    const newActiveIndex = Array.from(works).indexOf(newActiveWork)
    const hasPrev = works[newActiveIndex - 1]
    const hasNext = works[newActiveIndex + 1]
    codePenContainer.classList.toggle('has-prev', hasPrev)
    codePenContainer.classList.toggle('has-next', hasNext)
    changeWorkButtons.forEach(btn => {
      const isNextBtn = btn.dataset.changeWorkButton === 'next'
      btn.disabled = (isNextBtn && !hasNext) || (!isNextBtn && !hasPrev)
    })
  })
})
