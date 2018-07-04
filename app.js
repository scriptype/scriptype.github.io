const last = array => array[array.length - 1]

const activeClass = 'masthead__video--active'

const nextBtn = document.getElementById('masthead-next-video-button')
nextBtn.addEventListener('click', e => {
  const activeVideo = document.querySelector('.masthead__video--active')
  let nextVideo = activeVideo.nextElementSibling
  if (nextVideo.nodeName !== 'VIDEO') {
    nextVideo = activeVideo.parentNode.querySelector('.masthead__video')
  }
  nextVideo.classList.add(activeClass)
  activeVideo.classList.remove(activeClass)
})

const prevBtn = document.getElementById('masthead-prev-video-button')
prevBtn.addEventListener('click', e => {
  const activeVideo = document.querySelector('.masthead__video--active')
  let prevVideo = activeVideo.previousElementSibling
  if (!prevVideo || prevVideo.nodeName !== 'VIDEO') {
    prevVideo = last(activeVideo.parentNode.querySelectorAll('.masthead__video'))
  }
  prevVideo.classList.add(activeClass)
  activeVideo.classList.remove(activeClass)
})
