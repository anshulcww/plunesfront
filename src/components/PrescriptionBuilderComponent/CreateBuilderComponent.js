import React, { Component } from 'react';
import '../PrescriptionBuilderComponent/PrescriptionBuilderComponent'
import Modal from 'react-modal';
import axios from 'axios'
import { Redirect } from 'react-router-dom';


const customStyles = {
    content: {
        top: '70%',
        left: '20%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
         border:'none'
    }
};

class CreateBuilderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docDetails: this.props.doctor,
            fileNameLogo: '',
            fileNameSignature: '',
            file: null,
            signatureFile: null,
            logoUrl: '',
            signatureUrl: '',
            prescriptionField: [
                'Diagnosis',
                'Medicine',
                'Test',
                'Remarks',
            ],
            logoText:'',
            showTextLogo : true,
            hospitalDetails: {},
            name: this.props.doctor.name,
            education: this.props.doctor.education,
            address: this.props.doctor.address,
            experience: this.props.doctor.experience,
            mobileNumber: this.props.doctor.mobileNumber,
            field: '',
            userType: '',
            showSavePrescription: false,
            hasLogoUrl : true,
            logoText : '',
            showStoreTextLogo : true,
            showElementForm : false
        }
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getHospitalDetails = this.getHospitalDetails.bind(this);
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTemplateSubmit = this.handleTemplateSubmit.bind(this);
        this.onFileChangeHandlerLogo = this.onFileChangeHandlerLogo.bind(this);
        this.onFileChangeHandlerSignature = this.onFileChangeHandlerSignature.bind(this);
        this.handleTextLogo = this.handleTextLogo.bind(this);
        this.handleLogoImage = this.handleLogoImage.bind(this);
        this.showElementModal = this.showElementModal.bind(this)
    }

    showElementModal(){
        console.log('anshul')
        this.setState({
            showElementForm :  true
        })
    }

    handleLogoImage(){
        this.setState({
            showTextLogo : true
        })
    }

    handleTextLogo(){
        this.setState({
            showTextLogo : false
        })
    }

    onFileChangeHandlerLogo = (e) => {
        e.preventDefault();
        this.setState({
            file: e.target.files[0],
            fileNameLogo: e.target.files[0].name
        }, () => {
            const data = new FormData();
            data.append('file', this.state.file)
            axios.post("https://plunes.co/v4/upload", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                if (res.status === 200) {
                    this.setState({
                        logoUrl: "https://plunes.co/v4/" + res.data.path
                    })
                }
            });
        });

    };

    onFileChangeHandlerSignature = (e) => {
        e.preventDefault();
        this.setState({
            signatureFile: e.target.files[0],
            fileNameSignature: e.target.files[0].name
        }, () => {
            const data = new FormData();
            data.append('file', this.state.signatureFile)
            axios.post("https://plunes.co/v4/upload", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                if (res.status === 200) {
                    this.setState({
                        signatureUrl: "https://plunes.co/v4/" + res.data.path,

                    })
                }
            });
        });

    };


    handleTemplateSubmit(e) {
        e.preventDefault();
        let data = {};
        if (this.state.userType === 'Hospital') {
            data = {
                prescription: {
                    doctorId: this.props.doctor._id,
                    logoUrl: this.state.logoUrl,
                    doctorName: this.state.name,
                    qualification: this.state.education,
                    experience: this.state.experience,
                    signatureUrl: this.state.signatureUrl,
                    address: this.state.address,
                    otherFields: this.state.prescriptionField,
                    mobileNumber:this.props.doctor.mobileNumber,
                    email:this.props.doctor.email,
                    logoText: this.state.logoText
                }
            } 
        } else {
            data = {
                prescription: {
                    logoUrl: this.state.logoUrl,
                    doctorName: this.state.name,
                    qualification: this.state.education,
                    experience: this.state.experience,
                    signatureUrl: this.state.signatureUrl,
                    address: this.state.address,
                    otherFields: this.state.prescriptionField,
                    mobileNumber: this.props.doctor.mobileNumber,
                    email: this.props.doctor.email,
                    logoText : this.state.logoText
                }
            }
        }
        let token = localStorage.getItem('auth')
        axios.put('https://plunes.co/v4/user', data, { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } })
            .then((res) => {
                if (res.status === 201 && res.data.success === true) {
                    this.setState({
                        showSavePrescription: true
                    })
                    this.props.handleSaveTemplate(false);
                }
            })
    }


    handleSubmit(e) {
        e.preventDefault();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleInputSubmit(e) {
        e.preventDefault();
        let field = this.state.field;
        this.setState({
            prescriptionField: [...this.state.prescriptionField, field],
            showElementForm: false
        });
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    // openModal = () => {
    //     const {show} = this.state;
    //     this.setState({show:!show})
    // }

    afterOpenModal() {

    }

    closeModal() {
        this.setState({ showElementForm: false });
    }


    getHospitalDetails() {
        let auth = localStorage.getItem('auth')
        return new Promise(async function (resolve, reject) {
            await axios.get('https://plunes.co/v4/user/whoami', { headers: {"Authorization" : `Bearer ${auth}`} })
                    .then((res) => {
                        resolve(res.data)
                    })
                    .catch((e) => {
                        reject(e)
                    })
        }) 
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.doctor.userType === 'Doctor'){
            this.setState({
                name : nextProps.doctor.name,
                education: nextProps.doctor.qualification,
                address: nextProps.doctor.address,
                experience: nextProps.doctor.experience,
            })
        }else{
            this.setState({
                name : nextProps.doctor.name,
                education: nextProps.doctor.education,
                address: nextProps.doctor.address,
                experience: nextProps.doctor.experience,
            })
        }
    }

    async componentDidMount() {
        let hospital = await this.getHospitalDetails();
        if (hospital.userType === 'Doctor') {
            this.setState({
                name: hospital.name,
                education: hospital.qualification,
                experience: hospital.experience,
            })
        }
        if(hospital.userType === 'Hospital' ){
            if(hospital.hasOwnProperty('logoUrl') && hospital.logoUrl.length > 0){
                this.setState({
                    hasLogoUrl : false,
                    logoUrl : hospital.logoUrl
                })
            }else if(hospital.hasOwnProperty('logoText') && hospital.logoText.length > 0) {
                this.setState({
                    hasLogoUrl : false,
                    showStoreTextLogo : false,
                    logoText : hospital.logoText
                })
            }
        }
        this.setState({
            address: hospital.address,
            userType: hospital.userType,
        });
    }

    render() {
        const { showSavePrescription } = this.state
        if (showSavePrescription) {
            return <Redirect to={{
                pathname: '/prescription-dashboard',
            }}
            />
        }
        return (
        <div>
            <div className='container-fluid createBuilder'>
                {/* <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                 >
                    <h2 >Please add element</h2>
                    <button onClick={this.closeModal}>close</button>
                    <form onSubmit={this.handleInputSubmit}>
                        <input name='field' onChange={this.handleChange} />
                        <button type='submit'>Submit</button>
                    </form>
                </Modal> */}
                <form onSubmit={this.handleTemplateSubmit}>
                    <div className='row'>
                        <div className='col'>
                            {
                                this.state.hasLogoUrl ?  
                                <div className="add-upload-logo">
                                    <span>
                                        <button type="button" className="btn btn-link textLogo" onClick={this.handleTextLogo}>Add Text Logo /</button>
                                        <button type="button" className="btn btn-link" onClick={this.handleLogoImage}>Upload Logo</button>
                                    </span>
                                {
                                    this.state.showTextLogo ?  <div className='uploadLogoDiv'>
                                    <label htmlFor="files" className="btn uploadBtn1">Upload Logo</label>
                                    <span>{this.state.fileNameLogo}</span>
                                    <input id="files" style={{ visibility: "hidden" }} className='inputLogo' type="file" name='file' onChange={this.onFileChangeHandlerLogo} />
                                    </div> : <div><input className="form-control noBorder doctorname" name='logoText' placeholder='Please Enter Text Logo' onChange={this.handleChange}/></div> 
                                } 
                                </div> 
                                : <div>
                                    {
                                        this.state.showStoreTextLogo ? <div>
                                        <img className='imageClass' src={this.state.logoUrl} alt='No Image'></img>
                                        </div> 
                                        : 
                                        <div className="create-builder-logo">
                                            <input className="noBorderLogoText" name='logoText' value={this.state.logoText || ''} onChange={this.handleChange} />
                                        </div>
                                    }
                                </div>
                           }
                            <div className='row age'>
                              <span className="create-builder-experience">  Experience:
                                    <input className="noBorder2" name='experience' value={this.state.experience || ''} onChange={this.handleChange} />
                                    <span>Years</span>
                                </span>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='row '>
                                <div className='col' >
                                    <input className="form-control noBorder doctorname" name='name' onChange={this.handleChange} value={this.state.name || ''} />
                                    <input className="form-control noBorder address" name='education' onChange={this.handleChange} value={this.state.education || ''} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className='new1'></hr>
                    <div className='row'>
                        <div className='col age'>
                            <div><p>Name </p></div>
                            <div>Gender</div>
                        </div>
                        <div className='col userAge'>
                            <div><p>Age </p></div>
                            <div><p>Date</p></div>
                        </div>
                    </div>
                    <ul className='prescriptionField age'>
                        {
                            this.state.prescriptionField.map((item, index) => (
                                <li className="name" key={index}>{item}<hr width="50%"/></li>
                            ))
                        }
                    </ul>
                    <div className='row' className='addField'>
                       <button className="add-field" type='button' onClick={this.showElementModal}><span><img className="add-png" src="/add.png"/>Add Field</span></button>
                        {
                            this.state.showElementForm ? <div>
                            {/* <form className="showElementModal-form" onSubmit={this.handleInputSubmit}> */}
                                <input className="showElementModal-input"  name='field' onChange={this.handleChange} placeholder='Advice :'/>
                                <button className="showElementModal-btn" onClick={this.closeModal}><img src="/Path18.svg"></img></button>
                                <button className="showElementModal-btn" type='submit' onClick={this.handleInputSubmit}><img src="/Path17.svg"></img></button>
                            {/* </form> */}
                            </div> : false
                        }
                       {/* <Modal className="addfield-modal"
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >
                          
                          <button onClick={this.closeModal}>close</button>
                          <form onSubmit={this.handleInputSubmit}>
                                <input name='field' onChange={this.handleChange} />
                                <button type='submit'>Submit</button>
                          </form>
                       </Modal>                   */}
                    </div>
                    
                    <div>
                       
                    </div>

                    <br></br>
                    <br></br>
                    <div className='row'>
                        <div className='col'>
                            
                        </div>
                        <div className='col '>
                            <div>
                                <input className="form-control noBorder doctorname" name='name' onChange={this.handleChange} value={this.state.name || ''} />
                            </div>
                        </div>
                    </div>
                    <hr width="80%"/>
                    <div className='row justify-content-center'>
                        <div className='col-md-2'></div>
                        <div className='col-md-8'>
                            <textarea className="form-control noBorder bottom-address" name='address' onChange={this.handleChange} value={this.state.address || ''}></textarea>
                        </div>
                        <div className='col-md-2'></div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-md-2'></div>
                        <div className='col-md-8 text-center'>
                            <button type='submit' className='saveButton'>Save</button>
                        </div>
                        <div className='col-md-2'></div>
                    </div>
                </form>
            </div>
            </div>
        );
    }
}
// class Box extends Component{
//     render(){
//         return(
//                <div><button onClick={this.closeModal}>close</button>
//                <form onSubmit={this.handleInputSubmit}>
//                    <input name='field' onChange={this.handleChange} />
//                    <button type='submit'>Submit</button>
//                </form></div>
//         )
//     }
// }
export default CreateBuilderComponent; 
