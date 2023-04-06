import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import Header from '../Header'

import './index.css'

const apiConstants = {
  initial: 'INITIAl',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Jobs extends Component {
  state = {isLoadingProfileAPI: apiConstants.initial, profileDetails: {}}

  componentDidMount() {
    this.getProfileAPIMethod()
  }

  getProfileAPIMethod = async () => {
    this.setState({isLoadingProfileAPI: apiConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        isLoadingProfileAPI: apiConstants.success,
        profileDetails: formattedData,
      })
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-bg-container">
        <img
          alt="profile"
          src={profileImageUrl}
          className="profile-image-url"
        />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-short-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileView = () => {
    const {isLoadingProfileAPI} = this.state
    switch (isLoadingProfileAPI) {
      case apiConstants.inProgress:
        return this.renderLoaderView()
      case apiConstants.success:
        return this.renderProfileSuccessView()
      default:
        return null
    }
  }

  renderTypeOfEmployment = () => (
    <div>
      <h1 className="employment-type-heading">Type of Employment</h1>
      <div className="checkbox-and-label-container">
        <input type="checkbox" id="fullTime" className="checkbox" />
        <label className="label-element-type" htmlFor="fullTime">
          Full Time
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input type="checkbox" className="checkbox" id="partTime" />
        <label className="label-element-type" htmlFor="partTime">
          Part Time
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input className="checkbox" type="checkbox" id="freelance" />
        <label className="label-element-type" htmlFor="freelance">
          Freelance
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input className="checkbox" type="checkbox" id="internship" />
        <label className="label-element-type" htmlFor="internship">
          Internship
        </label>
      </div>
    </div>
  )

  renderSalaryRange = () => (
    <div>
      <h1 className="employment-type-heading">Salary Range</h1>
      <div className="checkbox-and-label-container">
        <input type="radio" id="10LPA" className="checkbox" />
        <label className="label-element-type" htmlFor="10LPA">
          10 LPA and above
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input type="radio" className="checkbox" id="20LPA" />
        <label className="label-element-type" htmlFor="20LPA">
          20 LPA and above
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input className="checkbox" type="radio" id="30LPA" />
        <label className="label-element-type" htmlFor="30LPA">
          30 LPA and above
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input className="checkbox" type="radio" id="40LPA" />
        <label className="label-element-type" htmlFor="40LPA">
          40 LPA and above
        </label>
      </div>
    </div>
  )

  render() {
    return (
      <>
        <div className="jobs-bg-container">
          <Header />
          <div className="jobs-route-content-container">
            <div className="job-route-profile-and-type-containers">
              <div>
                <input type="search" />
                <button type="button" data-testid="searchButton">
                  <BsSearch className="search-icon" />
                </button>
              </div>
              {this.renderProfileView()}
              <hr className="hr-line" />
              {this.renderTypeOfEmployment()}
              <hr className="hr-line" />
              {this.renderSalaryRange()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
