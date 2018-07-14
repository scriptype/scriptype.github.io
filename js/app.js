const worksContainer = document.getElementById('works-container')
const workContainers = document.querySelectorAll('[data-work-container]')

function fixWorksContainerHeight(container) {
  requestAnimationFrame(() => {
    const minHeight = container.scrollHeight
    worksContainer.style.cssText += `; height: ${minHeight}px;`
  })
}

fixWorksContainerHeight(workContainers[0])

let windowWidth = window.innerWidth
window.addEventListener('resize', event => {
  if (windowWidth !== window.innerWidth) {
    requestAnimationFrame(() => {
      windowWidth = window.innerWidth
      const container = document.querySelector('.work-container--active')
      fixWorksContainerHeight(container)
    })
  }
})


const worksButtons = document.querySelectorAll('[data-works-button]')
worksButtons.forEach(button => {
  const container = Array.from(workContainers).find(container => {
    return container.dataset.workContainer === button.dataset.worksButton
  })
  button.addEventListener('click', e => {
    worksButtons.forEach(btn => {
      btn.classList.remove('works-button--active')
      btn.removeAttribute('aria-expanded')
    })
    workContainers.forEach(con => con.classList.remove('work-container--active'))
    button.classList.add('works-button--active')
    button.setAttribute('aria-expanded', true)
    container.classList.add('work-container--active')
    fixWorksContainerHeight(container)
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


function fetchPostsFromTumblr({ type, limit = 3, tag }) {
  const baseUrl = 'https://api.tumblr.com/v2/blog/x0r.tumblr.com/posts'
  const params = [
    `limit=${limit}`,
    `api_key=rPSt5BHEMqYFbAR6UVccYzEiLXWw6CSE92RTWbz9QOUim6W7TQ`
  ]
  if (type) params.push(`type=${type}`)
  if (tag) params.push(`tag=${tag}`)
  const requestUrl = [ baseUrl, params.join('&') ].join('?')
  return fetch(requestUrl)
}

function PostModel(post) {
  return Object.assign({}, {
    type: post.type,
    href: post.post_url,
    title: post.type === 'photo'
      ? toDOM(post.caption).innerText
      : post.title,
    content: post.type === 'photo'
      ? post.photos[0].original_size.url
      : post.summary
  }, post.type === 'photo' ? {
    alt_sizes: post.photos[0].alt_sizes,
    image_permalink: post.image_permalink
  } : {})
}

function toDOM(html) {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.firstElementChild
}

function photographyWorkTemplate(post) {
  return `
    <figure class="photography-item">
      <img src="${post.content}" alt="${post.title}" />
      <figcaption class="photography-item__title">
        <a href="${post.image_permalink || post.href}">${post.title}</a>
      </figcaption>
    </figure>
  `
}

function photographyWorksTemplate(posts) {
  return `
    <div class="photography-items">
      ${ posts.reduce((html, post) => html + photographyWorkTemplate(post), '') }
    </div>
  `
}

function renderPhotographyWorks() {
  if (isLoadedPhotography) {
    return
  }
  const el = document.getElementById('photography-container')
  fetchPostsFromTumblr({ type: 'photo', tag: 'photography', limit: 9 })
    .then(res => res.json())
    .then(data => {
      isLoadedPhotography = true
      el.innerHTML = photographyWorksTemplate(data.response.posts.map(post => PostModel(post)))
      const photoWorkContainer = Array.from(workContainers).find(con =>
        con.dataset.workContainer === 'photography'
      )
      // Firefox doesn't render empty auto grid rows as tall as not empty ones,
      // causing container to collapse. It's needed to fix container height while
      // items are being loaded.
      let counter = 20
      const fixContainerHeight = setInterval(() => {
        if (counter--) {
          fixWorksContainerHeight(photoWorkContainer)
        } else {
          clearInterval(fixContainerHeight)
        }
      }, 200)
    })
}

let isLoadedPhotography = false
const photographyButton = document.getElementById('photography-works-button')
photographyButton.addEventListener('click', renderPhotographyWorks)

function blogPostTemplate(post) {
  return `
    <section class="blog-post-container">
      <div class="blog-post blog-post--${post.type}">
        <h3  class="blog-post__title">
          <a href="${post.href}">${post.title}</a>
        </h3>
        <div class="blog-post__content">
          ${
            post.type === 'photo'
              ? `<a href="${post.href}"><img src="${post.content}" /></a>`
              : post.content
          }
        </div>
      </div>
    </section>
  `
}

function blogPostsTemplate(posts) {
  return posts.reduce((html, post) => html + blogPostTemplate(post), '')
}

function renderBlogPosts() {
  const el = document.getElementById('blog-posts-container')
  fetchPostsFromTumblr({ tag: 'show_on_homepage' })
    .then(res => res.json())
    .then(data => {
      el.innerHTML = blogPostsTemplate(data.response.posts.map(post => PostModel(post)))
    })
}

renderBlogPosts()

let shownEmail = false
const showEmail = setInterval(() => {
  if (shownEmail) {
    clearInterval(showEmail)
  } else if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
    document.getElementById('email').innerText = 'scriptyper'
    shownEmail = true
  }
}, 1234 + Math.random() * 2345)
