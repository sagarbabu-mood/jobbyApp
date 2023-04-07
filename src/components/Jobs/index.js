import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const apiConstants = {
  initial: 'INITIAl',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Jobs extends Component {
  state = {
    isLoadingProfileAPI: apiConstants.initial,
    isJobsViewLoading: apiConstants.initial,
    profileDetails: {},
    jobsArray: [],
    employmentType: [],
    minPackage: '',
    searchQuery: '',
  }

  componentDidMount() {
    this.getProfileAPIMethod()
    this.getJobsAPIMethod()
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

  getJobsAPIMethod = async () => {
    this.setState({isJobsViewLoading: apiConstants.inProgress})
    const {searchQuery, employmentType, minPackage} = this.state
    const typeOfEmployment = employmentType.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${typeOfEmployment}&minimum_package=${minPackage}&search=${searchQuery}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()

      const formattedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsArray: formattedData,
        isJobsViewLoading: apiConstants.success,
      })
    } else {
      this.setState({isJobsViewLoading: apiConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobsAPIMethod}>
        Retry
      </button>
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

  renderProfileFailureView = () => (
    <div>
      <button type="button" onClick={this.getProfileAPIMethod}>
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {isLoadingProfileAPI} = this.state
    switch (isLoadingProfileAPI) {
      case apiConstants.inProgress:
        return this.renderLoaderView()
      case apiConstants.success:
        return this.renderProfileSuccessView()
      case apiConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  onUpdateTypeofEmployment = event => {
    this.setState(
      prevState => ({
        employmentType: [...prevState.employmentType, event.target.value],
      }),
      this.getJobsAPIMethod,
    )
  }

  renderTypeOfEmployment = () => (
    <ul>
      <h1 className="employment-type-heading">Type of Employment</h1>
      <div className="checkbox-and-label-container">
        <input
          type="checkbox"
          id="fullTime"
          value="FULLTIME"
          className="checkbox"
          onClick={this.onUpdateTypeofEmployment}
        />
        <label className="label-element-type" htmlFor="fullTime">
          Full Time
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input
          type="checkbox"
          value="PARTTIME"
          className="checkbox"
          onClick={this.onUpdateTypeofEmployment}
          id="partTime"
        />
        <label className="label-element-type" htmlFor="partTime">
          Part Time
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input
          className="checkbox"
          value="FREELANCE"
          type="checkbox"
          onClick={this.onUpdateTypeofEmployment}
          id="freelance"
        />
        <label className="label-element-type" htmlFor="freelance">
          Freelance
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input
          className="checkbox"
          value="INTERNSHIP"
          onClick={this.onUpdateTypeofEmployment}
          type="checkbox"
          id="internship"
        />
        <label className="label-element-type" htmlFor="internship">
          Internship
        </label>
      </div>
    </ul>
  )

  onUpdateSalaryRange = event => {
    this.setState({minPackage: event.target.value}, this.getJobsAPIMethod)
  }

  renderSalaryRange = () => (
    <ul>
      <h1 className="employment-type-heading">Salary Range</h1>
      <div className="checkbox-and-label-container">
        <input
          onClick={this.onUpdateSalaryRange}
          type="radio"
          name="salary"
          value="1000000"
          id="10LPA"
          className="checkbox"
        />
        <label className="label-element-type" htmlFor="10LPA">
          10 LPA and above
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input
          onClick={this.onUpdateSalaryRange}
          type="radio"
          name="salary"
          value="2000000"
          className="checkbox"
          id="20LPA"
        />
        <label className="label-element-type" htmlFor="20LPA">
          20 LPA and above
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input
          onClick={this.onUpdateSalaryRange}
          className="checkbox"
          value="3000000"
          name="salary"
          type="radio"
          id="30LPA"
        />
        <label className="label-element-type" htmlFor="30LPA">
          30 LPA and above
        </label>
      </div>
      <div className="checkbox-and-label-container">
        <input
          onClick={this.onUpdateSalaryRange}
          className="checkbox"
          value="4000000"
          name="salary"
          type="radio"
          id="40LPA"
        />
        <label className="label-element-type" htmlFor="40LPA">
          40 LPA and above
        </label>
      </div>
    </ul>
  )

  renderJobsSuccessView = () => {
    const {jobsArray} = this.state

    const DisplayJob = props => {
      const {jobDetails} = props
      const {
        companyLogoUrl,
        employmentType,
        jobDescription,
        location,
        packagePerAnnum,
        rating,
        title,
        id,
      } = jobDetails

      return (
        <Link to={`jobs/${id}`}>
          <div className="job-details-container">
            <div>
              <img src={companyLogoUrl} alt="company logo" />
              <h1>{title}</h1>
              <p>{rating}</p>
            </div>
            <div>
              <div>
                <p>{location}</p>
                <p>{employmentType}</p>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
            <hr className="hr-line" />
            <h1>Description</h1>
            <p>{jobDescription}</p>
          </div>
        </Link>
      )
    }

    return (
      <div>
        {jobsArray.length === 0 ? (
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters.</p>
          </div>
        ) : (
          <ul>
            {jobsArray.map(eachJob => (
              <DisplayJob jobDetails={eachJob} key={eachJob.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  renderJobsView = () => {
    const {isJobsViewLoading} = this.state
    switch (isJobsViewLoading) {
      case apiConstants.inProgress:
        return this.renderLoaderView()
      case apiConstants.failure:
        return this.renderJobsFailureView()
      case apiConstants.success:
        return this.renderJobsSuccessView()
      default:
        return null
    }
  }

  onChangeSearchElement = event => {
    this.setState({searchQuery: event.target.value})
  }

  onClickSearchButton = () => {
    this.getJobsAPIMethod()
  }

  render() {
    const {searchQuery} = this.state
    return (
      <>
        <div className="jobs-bg-container">
          <Header />
          <div className="jobs-route-content-container">
            <div className="job-route-profile-and-type-containers">
              <div className="search-input-container">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={this.onChangeSearchElement}
                  className="search-input"
                />
                <button
                  onClick={this.onClickSearchButton}
                  type="button"
                  data-testid="searchButton"
                  className="search-icon"
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              {this.renderProfileView()}
              <hr className="hr-line" />
              {this.renderTypeOfEmployment()}
              <hr className="hr-line" />
              {this.renderSalaryRange()}
            </div>
            <div>{this.renderJobsView()}</div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
