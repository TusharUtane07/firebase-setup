import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const MeasurementType = () => {
	const navigate = useNavigate()
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
                      <form id="step1" className="login-form" method="post" style={{marginTop:"-0.6rem", display:"flex", flexDirection:"column", alignContent:"center", justifyContent:"center", height:"20rem"}}>

                        <NavLink to={"/step1inch"} className="login-btn">
                          <button type="button" className="login" >
                            Step over 1 Inch
                          </button>
                        </NavLink>

                        <NavLink to={"/step2inch"} className="login-btn">
                          <button type="button" className="login" >
                            Step over 3 Inch
                          </button>
                        </NavLink>
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











	);
};

export default MeasurementType;
