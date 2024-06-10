import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setLotNumber } from '../redux/actions/lotActions';

const Details = () => {
    const [clientName, setClientName] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [lotNumberValue, setLotNumberValue] = useState("");
    const [quantityNumber, setQuantityNumber] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async() => {
        if (clientName && vehicleNumber && lotNumberValue && quantityNumber) {
            dispatch(setLotNumber(lotNumberValue))
            const docRef = doc(database, "Data", "lot number: "+ lotNumberValue);
            await setDoc(docRef, {
                clientName,
                lotNumberValue,
                vehicleNumber,
                quantityNumber
            })
            console.log("Document Added: ", docRef.id)
            navigate("/measurement-type")        
        } else {
            alert("Please fill in all fields before starting measuring.");
        }
    };

    return (
        <div style={
            {
              height:"100vh",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              fontFamily:"initial"
            }
          }>
          {/* background */}
          <div className="ls-bg">
            <img className="ls-bg-inner" src="assets/images/bg.png" alt="" />
          </div>
          <main className="overflow-hidden" style={{width:"90%"}}>
            <div className="wrapper">
              <div className="main-inner">
                {/* logo */}
           
                <div className="row h-100 align-content-center">
      
                  <div className="col-md-6 tab-100">
                    {/* form */}
                    <div className="form">
                      <h2 className="login-form form-title" style={{fontFamily:"emoji"}}>Raghu Marbles</h2>
                      <form id="step1" className="login-form" method="post" style={{marginTop:"-0.6rem"}}>
                        <label>Client Name</label>
                      <input class="form-control form-control" type="text" placeholder=""
                                          value={clientName} 
                                          onChange={(e) => setClientName(e.target.value)} 
                      />
                      <label className='mt-3'>Vechile Number</label>
      
                      <input class="form-control form-control" type="text" placeholder=""
                                          value={vehicleNumber} 
                                          onChange={(e) => setVehicleNumber(e.target.value)} 
                      />
                      <label className='mt-3'>Lot Number</label>
      
                      <input class="form-control form-control" type="text" placeholder=""
                                          value={lotNumberValue} 
                                          onChange={(e) => setLotNumberValue(e.target.value)} 
                      />
                      <label className='mt-3'>Quantity Number</label>
      
                      <input class="form-control form-control" type="text" placeholder=""
                                          value={quantityNumber} 
                                          onChange={(e) => setQuantityNumber(e.target.value)} 
                      />
      
                        <div className="d-flex justify-content-between flex-wrap" style={{marginTop:"2rem"}}>
                      
                      
                        </div>
                        <div className="login-btn">
                          <button type="button" className="login" onClick={handleSubmit}>
                            Start Measuring
                          </button>
                        </div>
                      </form>
             
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <div id="error"></div>
          {/* Bootstrap-5 */}
          {/* Jquery */}
          {/* My js */}
        </div>




    )
}

export default Details;
