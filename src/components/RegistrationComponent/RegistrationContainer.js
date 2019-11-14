import React from 'react';
import '../LandingComponent/Landing.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import UserRegistrationForm from "../RegistrationComponent/UserRegistrationForm";
import DoctorRegistrationForm from "../RegistrationComponent/DoctorRegistrationForm";
import HospitalRegistrationForm from '../RegistrationComponent/HospitalRegistrationForm'

import './RegistrationComponent.css'

class RegistrationComponent extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.root, "Registration")
        this.root = props.root
        this.state = {
            fullName: '',
            emailId: '',
            phoneNumber: '',
            password: '',
            gender: '',
            showLogin: false,
            showGeneralUserForm: true,
            showDoctorForm: false,
            showHospitalForm: false,
            // selectedValue: ''
        };

        // this.baseUrl = 'https://plunes.co/v3/';
        this.baseUrl = 'http://10.34.18.136:8000/'
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e){
        //console.log(e.target.value)
        // this.setState({
        //     selectedValue : e.target.value
        // })
        let selectedValue = e.target.value;
        // console.log(this.state.selectedValue, 'aaaaaaaa')
        switch(selectedValue){
            case 'userForm':
                this.setState({
                    showGeneralUserForm : true,
                    showDoctorForm : false,
                    showHospitalForm : false
                })
                break;
            case 'docForm':
                    this.setState({
                        showGeneralUserForm : false,
                        showDoctorForm : true,
                        showHospitalForm : false
                    })
                break;
            case 'hospitalForm':
                    this.setState({
                        showGeneralUserForm : false,
                        showDoctorForm : false,
                        showHospitalForm : true
                    })
                break;    
        }
    }

   
    handleSubmit(event) {
        console.log("Anshul")

        event.preventDefault();


        //Api for Registration
        let data = {
            'email': this.state.emailId,
            'mobileNumber': this.state.phoneNumber,
            'password': this.state.password,
            'name': this.state.fullName,
            'address': 'XXXXXXX',
            // 'userType': 'General User',
            // 'dateOfBirth' : Date.now(),
            // 'latitude': this.root.latitude,
            // 'longitude': this.root.longitude,
            // 'qualification': '',
            // 'imageUrl': '',
            // 'user_location': this.root.address,
            // 'experience': '',
            'gender': 'M',
            // 'specialist': '',
            // 'specialistbio': '',
            // 'commondisease': '',
            // 'specialistservices': '',
            // 'symptoms': '',
            // 'referral_code': ''

        }

        // this.props.history.push("/dashboard");
        // console.log(history, "Anshul")

        axios.post(this.baseUrl + 'user/register', data)
            .then(({ data }) => {
                console.log(data);
                if (data.err) {
                    //message.error(data.msg);
                    console.log(data.err)
                }
                else {
                    this.setState({ showLogin: true })
                }
            })
    }



    render() {
        const { showLogin } = this.state

        if (showLogin) {
            return <Redirect to='/login' />
        }

        return (
            <div className="container">
                <div className='row'>
                    <div className='col-md-6'>
                        <img className="signImage" style={{ marginTop: '80px' }} src="signup.png" />
                    </div>
                    <div className='col-md-6'>
                        <div className='col-md-1'>
                        </div>
                        <div className="col-md-6 signupContainer">
                            <div className='row'>
                                <h4 class="signUpText">Sign up</h4>
                            </div>
                            <div class="form-group">
                                <select class="form-control" onChange = {this.handleChange}>
                                    <option value= 'userForm'>General User</option>
                                    <option value= 'docForm'>Doctors</option>
                                    <option value= 'hospitalForm'>Hospitals</option>
                                </select>
                            </div>
                            {
                                this.state.showGeneralUserForm ?
                                <UserRegistrationForm /> : null
                            }
                            {
                                this.state.showDoctorForm ? 
                                <DoctorRegistrationForm /> : null
                            }
                            {
                                this.state.showHospitalForm ?
                                <HospitalRegistrationForm /> : null 
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default RegistrationComponent
