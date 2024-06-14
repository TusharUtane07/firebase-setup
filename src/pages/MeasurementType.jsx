import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const MeasurementType = () => {
	const navigate = useNavigate()
	return (

<>

  {/* splash-screen end */}
  <main className="auth-main">
    {/* menu, side-menu start */}
    <section className="wrapper dz-mode">
      {/* menu */}
      <div className="menu">
   
        
      </div>
      <div className="m-menu__overlay" />
      {/* main menu */}
      <div className="m-menu">
        <div className="m-menu__header">
          <button className="m-menu__close">
            <img src="../../assets/svg/menu/close-white.svg" alt="icon" />
          </button>
          <div className="menu-user">
            <img src="../../assets/images/profile/avatar.png" alt="avatar" />
            <div>
              <a href="#!">angela mayer</a>
              <h3>Verified user · Membership</h3>
            </div>
          </div>
        </div>
        <ul>
          <li>
            <h2 className="menu-title">menu</h2>
          </li>
          <li>
            <a href="../home.html">
              <div className="d-flex align-items-center gap-16">
                <span className="icon">
                  <img src="../../assets/svg/menu/pie-white.svg" alt="" />
                </span>
                overview
              </div>
              <img src="../../assets/svg/menu/chevron-right-black.svg" alt="" />
            </a>
          </li>
          <li>
            <a href="../../page.html">
              <div className="d-flex align-items-center gap-16">
                <span className="icon">
                  <img src="../../assets/svg/menu/page-white.svg" alt="" />
                </span>
                pages
              </div>
              <img src="../../assets/svg/menu/chevron-right-black.svg" alt="" />
            </a>
          </li>
          <li>
            <h2 className="menu-title">others</h2>
          </li>
          <li>
            <label className="a-label__chevron" htmlFor="item-4">
              <span className="d-flex align-items-center gap-16">
                <span className="icon">
                  <img src="../../assets/svg/menu/grid-white.svg" alt="" />
                </span>
                components
              </span>
              <img src="../../assets/svg/menu/chevron-right-black.svg" alt="" />
            </label>
            <input
              type="checkbox"
              id="item-4"
              name="item-4"
              className="m-menu__checkbox"
            />
            <div className="m-menu">
              <div className="m-menu__header">
                <label className="m-menu__toggle" htmlFor="item-4">
                  <img src="../../assets/svg/menu/back-white.svg" alt="" />
                </label>
                <span className="m-menu__header-title">components</span>
              </div>
              <ul>
                <li>
                  <a href="../../components/splash-screen.html">
                    <div className="d-flex align-items-center gap-16">
                      <span className="icon">
                        <img
                          src="../../assets/svg/menu/box-white.svg"
                          alt="icon"
                        />
                      </span>
                      splash screen
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <label className="a-label__chevron" htmlFor="item-5">
              <span className="d-flex align-items-center gap-16">
                <span className="icon">
                  <img src="../../assets/svg/menu/gear-white.svg" alt="" />
                </span>
                settings
              </span>
              <img src="../../assets/svg/menu/chevron-right-black.svg" alt="" />
            </label>
            <input
              type="checkbox"
              id="item-5"
              name="item-5"
              className="m-menu__checkbox"
            />
            <div className="m-menu">
              <div className="m-menu__header">
                <label className="m-menu__toggle" htmlFor="item-5">
                  <img src="../../assets/svg/menu/back-white.svg" alt="" />
                </label>
                <span className="m-menu__header-title">settings</span>
              </div>
              <ul>
                <li>
                  <a href="../profile/user-address.html">
                    <div className="d-flex align-items-center gap-16">
                      <span className="icon">
                        <img
                          src="../../assets/svg/menu/box-white.svg"
                          alt="icon"
                        />
                      </span>
                      My Address
                    </div>
                  </a>
                </li>
                <li>
                  <a href="../profile/user-payment.html">
                    <div className="d-flex align-items-center gap-16">
                      <span className="icon">
                        <img
                          src="../../assets/svg/menu/box-white.svg"
                          alt="icon"
                        />
                      </span>
                      Payment Method
                    </div>
                  </a>
                </li>
                <li>
                  <a href="../profile/change-password.html">
                    <div className="d-flex align-items-center gap-16">
                      <span className="icon">
                        <img
                          src="../../assets/svg/menu/box-white.svg"
                          alt="icon"
                        />
                      </span>
                      Change Password
                    </div>
                  </a>
                </li>
                <li>
                  <a href="../profile/forgot-password.html">
                    <div className="d-flex align-items-center gap-16">
                      <span className="icon">
                        <img
                          src="../../assets/svg/menu/box-white.svg"
                          alt="icon"
                        />
                      </span>
                      Forgot Password
                    </div>
                  </a>
                </li>
                <li>
                  <a href="../profile/security.html">
                    <div className="d-flex align-items-center gap-16">
                      <span className="icon">
                        <img
                          src="../../assets/svg/menu/box-white.svg"
                          alt="icon"
                        />
                      </span>
                      Security
                    </div>
                  </a>
                </li>
                <li>
                  <a href="../profile/user-language.html">
                    <div className="d-flex align-items-center gap-16">
                      <span className="icon">
                        <img
                          src="../../assets/svg/menu/box-white.svg"
                          alt="icon"
                        />
                      </span>
                      Language
                    </div>
                  </a>
                </li>
                <li>
                  <a href="../profile/notifications.html">
                    <div className="d-flex align-items-center gap-16">
                      <span className="icon">
                        <img
                          src="../../assets/svg/menu/box-white.svg"
                          alt="icon"
                        />
                      </span>
                      Notifications
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li className="dz-switch">
            <div className="a-label__chevron">
              <div className="d-flex align-items-center gap-16">
                <span className="icon">
                  <img src="../../assets/svg/menu/moon-white.svg" alt="" />
                </span>
                switch to dark mode
              </div>
              <label className="toggle-switch" htmlFor="enableMode">
                <input
                  type="checkbox"
                  id="enableMode"
                  className="mode-switch"
                />
                <span className="slider" />
              </label>
            </div>
          </li>
        </ul>
      </div>
      {/* end main menu */}
    </section>
    {/* menu, side-menu end */}
    {/* signin start */}
    <section className="auth signin">
      <div className="heading">
        <h2>Hi, User!</h2>
        <p>Choose measurement type</p>
      </div>
      <div className="form-area auth-form">
        <form action="#">
          <div>
 
          </div>
          <NavLink to={"/step1inch"} className="btn-primary">
            Regular
          </NavLink>
        </form>
        <div className="divider d-flex align-items-center justify-content-center gap-12">
          <span className="d-inline-block" />
          <small className="d-inline-block">Or</small>
          <span className="d-inline-block" />
        </div>
        <div className="d-flex flex-column gap-16">
          <NavLink to={"/step3inch"}
            type="button"
            className="social-btn"
            data-bs-toggle="modal"
            style={{
              textDecoration:"none"
            }}
            data-bs-target="#loginSuccess"
          >
            0, 3, 6, 9
          </NavLink>

        </div>
   
      </div>
    </section>
    {/* signin end */}
  </main>
  {/* modal start */}
  
  {/* modal end */}
  {/* jquery */}
  {/* bootstrap */}
  {/* jquery ui */}
  {/* mixitup */}
  {/* gasp */}
  {/* draggable */}
  {/* swiper */}
  {/* datepicker */}
  {/* google-map api */}
  {/* script */}
</>
















        // <div style={
        //     {
        //       height:"100vh",
        //       display:"flex",
        //       alignItems:"center",
        //       justifyContent:"center",
        //       fontFamily:"initial"
        //     }
        //   }>
        //   {/* background */}
        //   <div className="ls-bg">
        //     <img className="ls-bg-inner" src="assets/images/bg.png" alt="" />
        //   </div>
        //   <main className="overflow-hidden" style={{width:"90%"}}>
        //     <div className="wrapper">
        //       <div className="main-inner">
        //         {/* logo */}
           
        //         <div className="row h-100 align-content-center">
      
        //           <div className="col-md-6 tab-100">
        //             {/* form */}
        //             <div className="form">
        //               <h2 className="login-form form-title" style={{fontFamily:"emoji"}}>Raghu Marbles</h2>
        //               <form id="step1" className="login-form" method="post" style={{marginTop:"-0.6rem", display:"flex", flexDirection:"column", alignContent:"center", justifyContent:"center", height:"20rem"}}>

        //                 <NavLink to={"/step1inch"} className="login-btn">
        //                   <button type="button" className="login" >
        //                     Step over 1 Inch
        //                   </button>
        //                 </NavLink>

        //                 <NavLink to={"/step3inch"} className="login-btn">
        //                   <button type="button" className="login" >
        //                     Step over 3 Inch
        //                   </button>
        //                 </NavLink>
        //               </form>
             
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </main>
        //   <div id="error"></div>
        //   {/* Bootstrap-5 */}
        //   {/* Jquery */}
        //   {/* My js */}
        // </div>











	);
};

export default MeasurementType;
