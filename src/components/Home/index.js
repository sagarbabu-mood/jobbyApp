import {Link} from 'react-router-dom'

import Header from '../Header'
import './index.css'

const Home = props => {
  const {history} = props
  console.log(history)
  return (
    <div className="home-container">
      <Header />
      <div className="home-content-container">
        <h1 className="home-main-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential
        </p>
        <Link to="/jobs" className="nav-link">
          <button className="find-jobs-button" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
