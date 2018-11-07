import React from 'react'
import get from 'lodash/get'
import { Link } from 'gatsby'
import Menu from '../Menu'
import Links from '../Links'
import profilePic from '../../pages/NewPixelMe.png'
import './style.scss'

class Sidebar extends React.Component {
  render() {
    const { location } = this.props
    const {
      author,
      subtitle,
      copyright,
      menu,
    } = this.props.data.site.siteMetadata
    const isHomePage = get(location, 'pathname', '/') === '/'

    /* eslint-disable jsx-a11y/img-redundant-alt */
    const authorBlock = (
      <div>
        <Link to="/">
          <div className="showbox">
            <div className="loader">
              <img src={profilePic} alt={author.name} className="sidebar__author-photo"/>
              <div className="cloud"></div>
              <div className="cloud"></div>
              <div className="cloud"></div>
              <div className="cloud"></div>
              <div className="cloud"></div>
            </div>
          </div>
        </Link>
        {isHomePage ? (
          <h1 className="sidebar__author-title">
            <Link className="sidebar__author-title-link" to="/">
              {author.name}
              <div className="sidebar__author-title-job">SR. FRONT END ENGINEER</div>
            </Link>
          </h1>
        ) : (
          <h2 className="sidebar__author-title">
            <Link className="sidebar__author-title-link" to="/">
              {/* {author.name} */}
              <div className="sidebar__author-title-first-name">CHAD</div>
              <div className="sidebar__author-title-last-name">LUMLEY</div>
            </Link>
          </h2>
        )}
        <p className="sidebar__author-subtitle">{subtitle}</p>
      </div>
    )
    /* eslint-enable jsx-a11y/img-redundant-alt */

    return (
      <div className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__author">{authorBlock}</div>
          <div>
            <Menu data={menu} />
            <Links data={author} />
            <p className="sidebar__copyright">{copyright}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Sidebar
