import React, { Component } from 'react';
import './LoginComponent.css'
import axios from 'axios'

class LoginContainer extends Component {
  constructor(props){
    super(props);
    this.state ={
            emailId: '',
            password: '',
            phone_number: '',
    }
    this.baseUrl ='http://13.233.151.26:8000/';
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
}

handleSubmit(event) {
    event.preventDefault();
    // console.log("ANshul");
    let data;
    if (this.state.emailId.includes('@')) {
        data = {
            'email': this.state.emailId,
            'password': this.state.password,
            // "device_id": ""
        }
    } else {
        data = {
            'mobileNumber': this.state.emailId,
            'password': this.state.password,
            // "device_id": ""
        }
    }
    console.log(data, 'data');

    axios.post(this.baseUrl + 'user/login', data)
        .then(({ data }) => {
            if (data.err) {
                console.log(data.err)
            }
            else {
                console.log(data);
                // localStorage.setItem('token', data.user.token);
                // let token = localStorage.getItem('token');
                // this.root.access_token = data.token;
                this.setState({
                    redirect: true
                })
            }
        })
}


    render() {
        return (
            <div class="container">
            <div class="row">
                <div class="col-xl-6"><div>
                  <img className="loginImage" style={{marginTop: '80px'}} src="login.png" />
                    </div>
                </div>
                <div class="col-xl-6">
                  <div className = 'row'>
                    <div className = 'col-md-1'>

                    </div>
                    <div className = 'col-md-6'>
                    <h4 class="login-text">Login</h4>
                     <form action="" onSubmit ={this.handleSubmit}>
                      <div  class=" form-group">
                        <input class="form-control inputLogin"   name="emailId" placeholder="Email id or Phone Number" onChange={this.handleChange} id="myInput" />
                      </div>
                      <div  class="form-group">
                        <input class="form-control inputLogin" type='password' name="password" placeholder="Password" onChange = {this.handleChange} id="myInput" />
                          <button class="button-login" type='submit'>Login</button>
                      </div>
                    </form>
                    <a href="/forgot_password" ><h6 className="forgotPassword" >Forgot Password?</h6></a>
                    <h6 className="signupClass" >Don't have an account?<a href="#" >Signup</a> </h6>
                  </div>
                </div>
            </div>
        </div>
        </div>
        );
    }
}

export default LoginContainer;