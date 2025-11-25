import { config, library, dom } from '@fortawesome/fontawesome-svg-core'
import { faRss } from '@fortawesome/free-solid-svg-icons/faRss'
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet'
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons/faAddressCard'
import { faBluesky } from '@fortawesome/free-brands-svg-icons/faBluesky'
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { closest } from 'fastest-levenshtein'

import { Collapse, Tooltip } from 'bootstrap'

import * as AnchorJS from 'anchor-js'
import * as Turbo from '@hotwired/turbo'

window.Turbo = Turbo
window.Collapse = Collapse
window.Tooltip = Tooltip
const anchors = new AnchorJS()

document.addEventListener('turbo:load', () => {
  anchors.add()

  const els = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  Array.from(els).forEach((el) => {
    new Tooltip(el) // eslint-disable-line no-new
  })

  const div = document.getElementById('four-oh-four-suggestion')
  if (div != null) {
    const xhr = new XMLHttpRequest()

    xhr.onload = () => {
      if (xhr.status === 200) {
        const xml = xhr.responseXML
        const urls = Array.from(xml.querySelectorAll('urlset > url > loc')).map((el) => el.textContent)
        const url = new URL(closest(window.location.href, urls))
        div.innerHTML = `<a href="${url.href}">${url.pathname}</a>`
      } else {
        div.innerHTML = '<a href="/">/</a>'
      }
    }

    xhr.open('GET', `${window.location.protocol}//${window.location.host}/sitemap.xml`)
    xhr.send()
  }
})

config.mutateApproach = 'sync'
library.add(
  faRss,
  faTwitter,
  faLinkedin,
  faGithub,
  faEnvelope,
  faAddressCard,
  faRetweet,
  faHeart,
  faClock,
  faBluesky
)
dom.watch()
