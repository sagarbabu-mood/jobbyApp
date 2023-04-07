import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const apiConstants = {
  initial: 'INITIAl',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class JobItemDetails extends Component {
  state = {isLoading: apiConstants.initial, specificJobDetails: {}}

  componentDidMount() {
    this.getJobItemDetailsAPI()
  }

  getJobItemDetailsAPI = async () => {
    this.setState({isLoading: apiConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()

      const lifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }

      const skills = data.job_details.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))

      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        skills,
        lifeAtCompany,
      }
      const similarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      const formattedData = {
        jobDetails,
        similarJobs,
      }
      this.setState({
        specificJobDetails: formattedData,
        isLoading: apiConstants.success,
      })
    } else {
      this.setState({isLoading: apiConstants.failure})
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
      <button type="button" onClick={this.getJobItemDetailsAPI}>
        Retry
      </button>
    </div>
  )

  renderJobsSuccessView = () => {
    const {specificJobDetails} = this.state

    const {jobDetails, similarJobs} = specificJobDetails

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetails
    console.log(similarJobs)
    return (
      <>
        <div>
          <div>
            <div>
              <img src={companyLogoUrl} alt="job details company logo" />
              <div>
                <h1>{title}</h1>
                <p>{rating}</p>
              </div>
            </div>
            <div>
              <div>
                <p>{location}</p>
                <p>{employmentType}</p>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
            <hr className="hr-line" />
            <div>
              <h1>Description</h1>
              <a href={companyWebsiteUrl}>Visit</a>
              <p>{jobDescription}</p>
            </div>
          </div>
          <div>
            <h1>Skills</h1>
            <ul>
              {skills.map(eachSkill => (
                <div key={eachSkill.name}>
                  <img src={eachSkill.imageUrl} alt={eachSkill.name} />
                  <p>{eachSkill.name}</p>
                </div>
              ))}
            </ul>
          </div>
          <div>
            <h1>life at company</h1>
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <div>
          <h1>similar jobs</h1>
          <ul>
            {similarJobs.map(eachSimilarJob => (
              <div key={eachSimilarJob.id}>
                <div>
                  <img
                    src={eachSimilarJob.companyLogoUrl}
                    alt="similar job company logo"
                  />
                  <div>
                    <h1>{eachSimilarJob.title}</h1>
                    <p>{eachSimilarJob.rating}</p>
                  </div>
                </div>
                <h1>Description</h1>
                <p>{eachSimilarJob.jobDescription}</p>
                <div>
                  <p>{eachSimilarJob.location}</p>
                  <p>{eachSimilarJob.employmentType}</p>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderJobItemDetailsView = () => {
    const {isLoading} = this.state
    switch (isLoading) {
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

  render() {
    return (
      <div className="job-item-details-container">
        <Header />
        {this.renderJobItemDetailsView()}
      </div>
    )
  }
}

export default JobItemDetails
