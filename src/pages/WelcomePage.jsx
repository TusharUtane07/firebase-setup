import React from 'react'
import { Link } from 'react-router-dom'
import backImg from "../img/bg-img/19.png"
import imgDot from  "../img/core-img/dot.png"
const WelcomePage = () => {
  return (
<>
  {/* Preloader */}

  {/* Internet Connection Status */}
  <div className="internet-connection-status" id="internetStatus" />
  {/* Hero Block Wrapper */}
  <div className="hero-block-wrapper bg-primary">
    {/* Styles */}
    <div className="hero-block-styles">
      <div
        className="hb-styles1"
        style={{ backgroundImage: `url(${imgDot})` }}
      />
      <div className="hb-styles2" />
      <div className="hb-styles3" />
    </div>
    <div className="custom-container">
      {/* Skip Page */}
      <div class="skip-page">
        <Link to={"/details"}>Next</Link>
      </div>
      {/* Hero Block Content */}
      <div className="hero-block-content">
        <img className="mb-4" src={backImg} alt="" />
        <h2 className="display-4 text-white mb-3">

        <h2 class="display-4 text-white mb-3" style={{marginTop:"3rem"}}>
               Complete Your Measurement With SIZER

              </h2>        </h2>
        <p className="text-white" style={{
          marginTop:"-0.5rem"
        }}>
        Measure slabs every way.
        </p>
        <Link className="btn btn-warning btn-lg w-100" to={"/details"}>
          Get Started
          </Link>   
      </div>
    </div>
  </div>
  {/* All JavaScript Files */}
</>






  
  )
}

export default WelcomePage