// Header.jsx
// The navy bar at the top of every dashboard page, plus the yellow "evidence tape" stripe.
// The student and instructor pages give it different menu links and text.

import Icon from './Icon.jsx'
import { comingSoon } from '../data/links.js'

function Header({ homeLink, searchPlaceholder, menuLinks, userName, roleLabel }) {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          {/* 1. Logo (links back to the home page) */}
          <a className="brand" href={homeLink}>
            <span className="brand__mark">
              <Icon name="shield" size={22} />
            </span>
            <span className="brand__text">
              <span className="brand__name">Case Readiness</span>
              <span className="brand__tag">Digital Forensics Case Preparation</span>
            </span>
          </a>

          {/* 2. Search box (does not search yet) */}
          <div className="search" role="search">
            <label className="visually-hidden" htmlFor="site-search">Search</label>
            <span className="search__icon">
              <Icon name="search" size={18} />
            </span>
            <input id="site-search" className="search__input" type="search" placeholder={searchPlaceholder} />
          </div>

          {/* 3. Main menu */}
          <nav className="nav" aria-label="Main menu">
            {menuLinks.map((link) => (
              <a
                key={link.label}
                className="nav__link"
                href={link.href}
                aria-current={link.isCurrent ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* 4. Who is logged in, and the Log out button */}
          <div className="user">
            <span className="user__who">
              <span className="user__avatar">
                <Icon name="person" size={18} />
              </span>
              <span className="user__text">
                <span className="user__name">{userName}</span>
                <span className="user__role">{roleLabel}</span>
              </span>
            </span>
            {/* Placeholder for now. The real log out belongs to the login feature. */}
            <a className="btn-logout" href={comingSoon('Log out')}>Log out</a>
          </div>
        </div>
      </header>

      {/* Decorative stripe, so screen readers skip it */}
      <div className="tape" aria-hidden="true"></div>
    </>
  )
}

export default Header
