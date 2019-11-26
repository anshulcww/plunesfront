import React from 'react';
import './Landing.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import RegistrationContainer from '../RegistrationComponent/RegistrationComponent'
import axios from 'axios';
import { Redirect } from 'react-router'


class LandingContainer extends React.Component {
    constructor(props) {
        super(props);

        this.root = props.root;
        this.state = {
            mobileNo: '',
            countryCode: '',
            filter: '',
            emailid: '',
            password: '',
            proceduresList: [],
            selectedData: [],
            docList: [],
            showDropdown: false,
            showDiv: false,
            showSelectedProcedures: false,
            showSignup: false
            // redirect: true
        };
        this.baseUrl = 'https://plunes.co/v3/'
        this.data = [];
        this.selectedProcedures = [];
        this.showForm = false;
        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onSearchQuery = this.onSearchQuery.bind(this);
        this.settingBid = this.settingBid.bind(this);
        this.viewAllBid = this.viewAllBid.bind(this);
        this.sendToSignUpPage = this.sendToSignUpPage.bind(this);
        this.sendAppLink = this.sendAppLink.bind(this)

    }
    async sendAppLink(e) {
        e.preventDefault()
        let response = await axios.get("http://13.233.151.26:8000/notification/applink/" + this.state.mobileNo)
            .then(({ data }) => {
                // console.log(data);
                if (data.err) {
                    //message.error(data.msg);
                    console.log(data.err)
                }
                else {
                    console.log(data)
                    // console.log('anshul')
                    // console.log(data)
                    this.setState({
                        mobileNo: '',
                        countryCode: ''
                    })

                }
            })
    }

    sendToSignUpPage() {
        this.setState({
            showSignup: true
        })
    }


    async viewAllBid(id) {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZGI5MmYyZDVlYTYzYTIzMjMwMWFjMTgiLCJpYXQiOjE1NzI1MjE2OTJ9.vracwZa90DFsPC0tPWrwn_Z8uElqUYnfpy8HKD79le8'
        let response = await axios.get(this.baseUrl + 'bidding/view_bids/' + id, { headers: { "Authorization": `Bearer ${token}` } })
            .then(({ data }) => {
                // console.log(data);
                if (data.err) {
                    console.log(data.err)
                } else {
                    console.log(data)
                    return data
                }
            })
        // console.log(response)
        return response;

    }

    async  viewBidsProcedures(bidId) {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZGI5MmYyZDVlYTYzYTIzMjMwMWFjMTgiLCJpYXQiOjE1NzI1MjE2OTJ9.vracwZa90DFsPC0tPWrwn_Z8uElqUYnfpy8HKD79le8'
        let response = await axios.get(this.baseUrl + 'bidding/view_bids_of_procedure/' + bidId, { headers: { "Authorization": `Bearer ${token}` } })
            .then(({ data }) => {
                // console.log(data);
                if (data.err) {
                    console.log(data.err)
                } else {
                    // console.log(data)
                    return data
                }
            })
        // console.log(response)
        return response;
    }

    async settingBid(proceduresArray) {
        console.log(proceduresArray);
        let proceduresString = proceduresArray.join();
        console.log(proceduresString);
        let body = {
            "Userid": '5db92f2d5ea63a232301ac18',
            "Username": "Demo user",
            "Location": "90b, Delhi - Jaipur Expy, Sector 18, Gurugram, Haryana 122008, India",
            "Diagnostics": 'Amalgam Fillings,Composite Fillings',
            "Long": "77.0749492",
            "Lat": "28.4851501",
            "Concern": "",
            "Images": "",
            "Quantity": "1,1"
        }
        let response = await axios.post(this.baseUrl + 'bidding/setting_bid', body)
            .then(({ data }) => {
                // console.log(data);
                if (data.err) {
                    //message.error(data.msg);
                    console.log(data.err)
                }
                else {
                    // console.log('anshul')
                    // console.log(data)
                    return data
                }
            })
        return response;
    }


    async handleSubmit(e) {
        e.preventDefault();
        let settingBid = await this.settingBid(this.state.selectedData);
        let userId = '5db92f2d5ea63a232301ac18';
        let viewBids = await this.viewAllBid(userId)
        let bidId = viewBids.user[0]._id
        let viewBidsOfProcedures = await this.viewBidsProcedures(bidId);
        let listOfDoc = viewBidsOfProcedures.user.data;
        //    console.log(listOfDoc);
        this.root.doctorList = listOfDoc
        this.setState({
            docList: listOfDoc
        })
        this.setState({
            searchInput: true
        })
    }



    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    async componentDidMount() {


        return await axios.get(this.baseUrl + 'bidding/list_of_procedures')
            .then(({ data }) => {
                // console.log(data)
                if (data.err) {
                    console.log(data.err)
                }
                else {
                    this.setState({ proceduresList: data.user })
                }
            })
    }

    handleClick(e) {
        let selectedValue = e.currentTarget.dataset.value;
        // console.log(selectedValue);
        this.selectedProcedures.push(selectedValue);
        // console.log(this.selectedProcedures);
        this.setState({
            selectedData: this.selectedProcedures,
            showDropdown: false,
            showDiv: false,
            showSelectedProcedures: true
        })
        this.showForm = true;

        // console.log(this.context);
    }
    onSearchQuery(e) {
        // console.log('anshul')
        // console.log(e.target.value);
        this.setState({ filter: e.target.value });

        if (this.state.filter.length > 0) {
            const { filter, proceduresList } = this.state;
            const lowercasedFilter = filter.toLowerCase();
            const filteredData = proceduresList.filter(item => {
                let result = false;
                Object.keys(item).forEach(key => {
                    if (key == 'procedure' || key == 'tag') {
                        let smallData = item[key].toString().toLowerCase();
                        if (smallData.includes(lowercasedFilter)) {
                            result = true;
                        }
                    }
                });
                return result;
            });
            this.data = filteredData
            this.setState({
                showDropdown: true,
                showDiv: true
            })
        }

    }

    render() {
        // const { isAuth } = this.root;
        const { showSignup } = this.state
        if (showSignup) {
            return <Redirect to='/signup' />;
        }

        return <Router>
            <div className="container-fluid " >
                {/* <div class="text-center">
                    <h1 class="h11">Search for the best price solutions near you </h1>
                    <form action="">
                        <div class="autocomplete">
                            <input class="form-control" type="text" name="search" placeholder="Name the procedure or test here .." autoComplete="off" id="mytInput" onChange={this.onSearchQuery} />
                            {this.state.showDiv ? <div className='row' >
                                <ul style={{ listStyleType: 'none' }} className='searchDropdown'>
                                    {
                                        this.state.showDropdown ?
                                            this.data.map(item => (
                                                <li key='' data-value={item.procedure} className='row procedureListClass' onClick={this.handleClick} >
                                                    {item.procedure}
                                                </li>
                                            )) : null
                                    }
                                </ul>
                            </div> : null

                            }
                            {
                                this.state.showSelectedProcedures ? <div className='row selectedProceduresList'>
                                    <ul style={{ listStyleType: 'none' }} >
                                        {
                                            this.showForm ? <form onSubmit={this.handleSubmit}>
                                                {
                                                    this.state.selectedData.map(item =>
                                                        (
                                                            <li key='' className='row procedureListClass'>{item}</li>
                                                        ))
                                                }

                                            </form> : null
                                        }
                                    </ul>
                                </div> : null
                            }
                            {
                                this.showForm ?
                                    <button type='button' className='btn btn-success proceedButton' onClick={this.sendToSignUpPage}> Proceed </button>
                                    : null
                            }demo
                        </div>
                    </form>

                </div> */}
          
                <h3 className="h15">Welcome to India's First Utility Network</h3>
                <h3 className="header2">Experience our Unique AI & Avail upto 50% off on all your Medical Procedures, Diagnostics & Appointments</h3>
                <div class="owl-carousel owl-theme owl-nav owl-loaded" id="owl-demo">
                    
                    
                    <div class="item">
                        <a href="/dermatology">
                            <div class="card" >
                                <img className=" card-align" src="Dermat.png" alt="..." />
                                <div class="card-body ">
                                    <h5 class="card-title2 ">Dermatology Procedure</h5>
                                    <p class="card-text2">Dermatology Consultation <br></br> Laser Hair Reduction <br></br> Botox Treatment</p>

                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="item">
                        <a href="/Gynae">
                            <div class="card" >
                                <img className=" card-align" src="Gyneco.png" alt="..." />
                                <div class="card-body ">
                                    <h5 class="card-title2 ">Gynecology Procedures</h5>
                                    <p class="card-text2">Gynecologist Consultation<br></br>Cesarean / C-section <br></br>Ovarian Cyst Removal</p>

                                </div>
                            </div></a>
                    </div>
                    <div class="item">
                        <a href="/Radiology">
                            <div class="card" >
                                <img className="card-align" src="Radio.png" alt="..." />
                                <div class="card-body ">
                                    <h5 class="card-title2 ">Radiology Tests</h5>
                                    <p class="card-text2">MRI, CT Scan, X-ray<br></br> Ultrasound <br></br>Doppler Test</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="item">
                        <a href="/dentist">
                            <div class="card" >
                                <img className="card-align" src="/dent.png" alt="..." />
                                <div class="card-body ">
                                    <h5 class="card-title2 ">Dentistry Procedure</h5>
                                    <p class="card-text2">Tooth Removal, Tooth whitening<br></br>Root Canal Treatment<br></br>Dental Implant, Braces</p>

                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="item">
                        <a href="/Pathology">
                            <div class="card" >
                                <img className=" card-align" src="Pathology.png" alt="..." />
                                <div class="card-body ">
                                    <h5 class="card-title2 ">Pathology</h5>
                                    <p class="card-text2">Complete Blood Count Test<br></br>LIPID Profile<br></br>HIV Test</p>

                                </div>
                            </div>
                        </a>
                    </div>
                    <div className='item'>
                        <a href="/Orthopedics">
                            <div class="card" >
                                <img className=" card-align" src="Orthopedics.png" alt="..." />
                                <div class="card-body ">
                                    <h5 class="card-title2 ">Orthopedic</h5>
                                    <p class="card-text2">Joint Replacement<br></br>Fracture<br></br>Arthroplasty</p>
                                </div>
                            </div>
                        </a>
                    </div>

                </div>
                <hr width="70%" ></hr>
                
                <div className="container download-area">

                    <h3 className="h11">Book instantly from top doctors near you</h3>

                    <div className="row">
                        <div className="col-sm-6">
                            <img className="download-app-pic" src="Category.png" />
                            <img className="download-app-pic2" src="mobail.png" />

                        </div>
                        <div className="col-sm-6">
                            <p className="download-text"> Download Plunes App Now!  </p>
                            <p className="download-text2">Book Procedures, Medical Tests & Appointments</p>
                            <p className="download-text3">Get the link to download app</p>
                            <div className="download-link-app">
                                <form onSubmit={this.sendAppLink}>
                                    <span><input id="UserMobile" value={this.state.countryCode ? this.state.countryCode : '+91'} onChange={this.handleChange} name='countryCode' className="number-text2" maxLength="3" data-fv-numeric="true" data-fv-numeric-message="Please enter your numbers" data-fv-phone-country11="IN" required="required" data-fv-notempty-message="This field cannot be left blank." placeholder="+91 " data-fv-field="data[User][mobile]"></input></span>
                                    <span> <input id="UserMobile" value={this.state.mobileNo} className="number-text" maxLength="10" data-fv-numeric="true" data-fv-numeric-message="Please enter your numbers" data-fv-phone-country11="IN" required="required" data-fv-notempty-message="This field cannot be left blank." placeholder="Mobile No " name='mobileNo' onChange={this.handleChange}></input></span>
                                    <button type='submit' class="btn btn-primary button-view button-align">Get App Link</button>
                                </form>
                            </div>
                            <span> <a href="https://apps.apple.com/us/app/plunes/id1463747553"> <img className="download-logo" src="app-store.png" /></a></span>
                            <span><a href="https://play.google.com/store/apps/details?id=com.plunes&hl=en_IN"> <img className="download-logo2" src="Play-store.png" /></a></span>

                        </div>
                    </div>
                </div><br></br>
                    <hr width="70%" ></hr>
                <div className='container-fluid'>
                  
                    <h3 className="header"> Why Plunes?</h3>

                    <div className='row'>
                        <div className='col-sm-1 why-plunes'></div>
                        <div className='col-sm-4'>
                            <ul style={{listStyleType : 'none'}}>
                                <li className="pencil-align"><img src='/pencil.png' height='25px' width='25px'></img><span className="pencil">100% Payments Refundable.</span></li><br></br>
                                <li className="pencil-align"><img src='/pencil.png' height='25px' width='25px'></img><span className="pencil">Prefered timing as per your availability</span></li><br></br>
                                <li className="pencil-align" ><img src='/pencil.png' height='25px' width='25px'></img><span className="pencil">Free telephonic consultations</span></li><br></br>
                            </ul>

                        </div>
                        <div className="col-sm-2">

                        </div>
                        <div className='col-sm-4'>
                            <ul style={{listStyleType : 'none'}}>
                                <li className="pencil-align"><img src='/pencil.png' height='25px' width='25px'></img><span className="pencil">First Consultation Free</span></li><br></br>
                                <li className="pencil-align"><img src='/pencil.png' height='25px' width='25px'></img><span className="pencil">Make Partial Payments</span></li><br></br>
                            </ul>
                        </div>
                        <div className='col-sm-1'></div>

                    </div>
                    
                </div>

              <div>
               
              <hr width="70%"></hr>
                  </div>


                <div>

                    <div>

                        <h3 class="h12"> Best Doctors, No Waiting in the Queue, Hassle free payments
               </h3>
                        <p className="header2">Book Now!</p>

                    </div>
                    <div className="container-fluid download-area ">
                        <div className="container-fluid middle-container">
                            <div className="row" >
                                <div className=" col-sm-4">
                                    <div class="item">
                                        <div class="card" >
                                            <img className="card-item-top" src="Physiotherapy.png" alt="..." />
                                            <div class="card-body">
                                                <h5 class="card-title ">Physiotherapy</h5>
                                                <p class="card-text">Physiotherapy Consultation <br></br>Back Pain/knee Pain <br></br>Frozen Shoulder</p>
                                                <a href="Physiotherapy" class="btn btn-primary button-view">view more</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div class="item" >
                                        <div class="card ">
                                            <img className="card-item-top" src="PSYCHIATRISTS.png" alt="..." />
                                            <div class="card-body ">
                                                <h5 class="card-title ">Psychiatric</h5>
                                                <p class="card-text">Psychologist Consultation<br></br>Autism Assessment <br></br> Counseling</p>
                                                <a href="/Psychiatry" class="btn btn-primary button-view">view more</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-4">
                                    <div class="item">
                                        <div class="card ">
                                            <img className="card-item-top" src="OPHTHAMOLOGIST.png" alt="..." />
                                            <div class="card-body ">
                                                <h5 class="card-title ">Ophthalmology</h5>
                                                <p class="card-text">Ophthalmology Consultation<br></br>Cataract Surgery <br></br>Glaucoma Surgery</p>
                                                <a href="/ophthalmology" class="btn btn-primary button-view">view more</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="row" >
                                <div className=" col-sm-4">
                                    <div class="item">
                                        <div class="card" >
                                            <img className="card-item-top" src="Neurologist.png" alt="..." />
                                            <div class="card-body ">
                                                <h5 class="card-title ">Neurology</h5>
                                                <p class="card-text">Neurology Consultation <br></br>Chemotherapy <br></br>Brain Tumor Surgery</p>
                                                <a href="/neurology" class="btn btn-primary button-view">view more</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div class="item">
                                        <div class="card">
                                            <img className="card-item-top" src="PEDIATRICIAN.png" alt="..." />
                                            <div class="card-body ">
                                                <h5 class="card-title ">Pediatric</h5>
                                                <p class="card-text">Pediatric Consultation <br></br>Vaccination <br></br>Heart Murmur</p>
                                                <a href="/Pediatrics" class="btn btn-primary button-view">view more</a>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <h3 className="h13">Long gone are the days of waiting in the queue!</h3>


                            <div className="row">
                                <h3 className="header2">Save time, Save Money!</h3>

                            </div>

                        </div>



                    </div>

                </div>

            </div>



        </Router >
    }
}

export default LandingContainer
