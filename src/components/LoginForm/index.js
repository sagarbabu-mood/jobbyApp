import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderUsername = () => {
    const {username} = this.state
    return (
      <div className="input-container">
        <label className="label-element" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          id="username"
          value={username}
          onChange={this.onChangeUsername}
        />
      </div>
    )
  }

  renderPassword = () => {
    const {password} = this.state
    return (
      <div className="input-container">
        <label className="label-element" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          id="password"
          value={password}
          onChange={this.onChangePassword}
        />
      </div>
    )
  }

  onSubmitSuccess = jwtToken => {
    this.setState({errorMsg: ''})
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {password, username}

    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <form className="form-container" onSubmit={this.onSubmitLoginForm}>
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          {this.renderUsername()}
          {this.renderPassword()}
          <button type="submit" className="login-button">
            Login
          </button>
          {errorMsg && <p className="error-msg">{`*${errorMsg}`}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
