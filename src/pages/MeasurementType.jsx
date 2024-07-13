import React, { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const MeasurementType = () => {
  const navigate = useNavigate()

  let { type } = useParams();
  useEffect(()=>{
    if(type != "feet"){
      navigate("/step1inch")
    }
  },[])
	return (


<>
  {/* Preloader */}
  {/* <div id="preloader">
    <div className="spinner-grow text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div> */}
  {/* Internet Connection Status */}
  <div className="internet-connection-status" id="internetStatus" />
  {/* Header Area */}
  <div className="header-area" id="headerArea">
    <div className="container">
      {/* Header Content */}
      <div className="header-content header-style-five position-relative d-flex align-items-center justify-content-between">
        {/* Back Button */}
        <div className="back-button">
          {/* <a href="pages.html"> */}
          <NavLink to={"/details"}>
            <i className="bi bi-arrow-left-short" />
          </NavLink>
          {/* </a> */}
        </div>
        {/* Page Title */}
        <div className="page-heading">
          <h6 className="mb-0">Choose Measurement Type</h6>
        </div>
        {/* Navbar Toggler */}
        <div
          className="navbar--toggler"
          id="affanNavbarToggler"
          data-bs-toggle="offcanvas"
          data-bs-target="#affanOffcanvas"
          aria-controls="affanOffcanvas"
          style={{
            display:"none"
          }}
        >
          <span className="d-block" />
          <span className="d-block" />
          <span className="d-block" />
        </div>
      </div>
    </div>
  </div>
  {/* # Sidenav Left */}
 
  <div className="page-content-wrapper py-3">
    <div className="container">
      {/* Accordion Card */}
      <div className="card  rounded-0 rounded-top">
        <div className="card-body text-center py-3">
          <h6 className="mb-0  line-height-1">Regular Type</h6>
        </div>
      </div>
      <div className="card mb-3 rounded-0 rounded-bottom">
        <div className="card-body">
        <div className="accordion-item">
              <div className="accordion-header" id="accordionSix">
                <h6
                  className="collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordionStyleSix"
                  aria-expanded="false"
                  aria-controls="accordionStyleSix"
                >
                  <i className="bi bi-plus-lg" /> Any number can be used, providing flexibility in measurement.
                </h6>
              </div>
              </div>
        <div className="accordion-item">
              <div className="accordion-header" id="accordionSix">
                <h6
                  className="collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordionStyleSix"
                  aria-expanded="false"
                  aria-controls="accordionStyleSix"
                >
                  <i className="bi bi-plus-lg" /> Allows for exact values, which can lead to more accurate and detailed results.
                </h6>
              </div>
              </div>
 
        <div
            className="accordion accordion-flush accordion-style-two"
            id="accordionStyle2"
          >
             <div  onClick={()=>{
                  navigate(`/step1inch`, { state: { sqft: true } });

             }} className="btn btn-primary w-100" style={{
        marginTop:"1rem"
       }}>
           Select Regular Type
          </div>
          </div>
        </div>
      </div>
      {/* Accordion Card */}
      <div className="card rounded-0 rounded-top">
        <div className="card-body text-center py-3">
          <h6 className="mb-0 line-height-1">3 ,6 ,9 ,0</h6>
        </div>
      </div>
      <div className="card mb-3 rounded-0 rounded-bottom">
        <div className="card-body">
        <div className="accordion-item">
              <div className="accordion-header" id="accordionSix">
                <h6
                  className="collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordionStyleSix"
                  aria-expanded="false"
                  aria-controls="accordionStyleSix"
                >
                  <i className="bi bi-plus-lg" /> The second digit of the number can only be 3, 6, 9, or 0, limiting the possible values.
                </h6>
              </div>
              </div>
        <div className="accordion-item">
              <div className="accordion-header" id="accordionSix">
                <h6
                  className="collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#accordionStyleSix"
                  aria-expanded="false"
                  aria-controls="accordionStyleSix"
                >
                  <i className="bi bi-plus-lg" /> Reduces complexity in data entry and may streamline certain processes by limiting options.
                </h6>
              </div>
              </div>
 
        <div
            className="accordion accordion-flush accordion-style-two"
            id="accordionStyle2"
          >
             <div 
              onClick={()=>{
                navigate(`/step3inch`, { state: { sqft: true } });

           }}
          className="btn btn-primary w-100" style={{
        marginTop:"1rem"
       }}>
           Select 3 Steps Type
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</>




// <>

//   {/* splash-screen end */}
//   <main className="auth-main">
//     {/* menu, side-menu start */}
//     <section className="wrapper dz-mode">
//       {/* menu */}
//       <div className="menu">
   
        
//       </div>
//       <div className="m-menu__overlay" />
//       {/* main menu */}
//       <div className="m-menu">
//         <div className="m-menu__header">
//           <button className="m-menu__close">
//             <img src="../../assets/svg/menu/close-white.svg" alt="icon" />
//           </button>
//           <div className="menu-user">
//             <img src="../../assets/images/profile/avatar.png" alt="avatar" />
//             <div>
//               <a href="#!">angela mayer</a>
//               <h3>Verified user · Membership</h3>
//             </div>
//           </div>
//         </div>
//         <ul>
//           <li>
//             <h2 className="menu-title">menu</h2>
//           </li>
//           <li>
//             <a href="../home.html">
//               <div className="d-flex align-items-center gap-16">
//                 <span className="icon">
//                   <img src="../../assets/svg/menu/pie-white.svg" alt="" />
//                 </span>
//                 overview
//               </div>
//               <img src="../../assets/svg/menu/chevron-right-black.svg" alt="" />
//             </a>
//           </li>
//           <li>
//             <a href="../../page.html">
//               <div className="d-flex align-items-center gap-16">
//                 <span className="icon">
//                   <img src="../../assets/svg/menu/page-white.svg" alt="" />
//                 </span>
//                 pages
//               </div>
//               <img src="../../assets/svg/menu/chevron-right-black.svg" alt="" />
//             </a>
//           </li>
//           <li>
//             <h2 className="menu-title">others</h2>
//           </li>
//           <li>
//             <label className="a-label__chevron" htmlFor="item-4">
//               <span className="d-flex align-items-center gap-16">
//                 <span className="icon">
//                   <img src="../../assets/svg/menu/grid-white.svg" alt="" />
//                 </span>
//                 components
//               </span>
//               <img src="../../assets/svg/menu/chevron-right-black.svg" alt="" />
//             </label>
//             <input
//               type="checkbox"
//               id="item-4"
//               name="item-4"
//               className="m-menu__checkbox"
//             />
//             <div className="m-menu">
//               <div className="m-menu__header">
//                 <label className="m-menu__toggle" htmlFor="item-4">
//                   <img src="../../assets/svg/menu/back-white.svg" alt="" />
//                 </label>
//                 <span className="m-menu__header-title">components</span>
//               </div>
//               <ul>
//                 <li>
//                   <a href="../../components/splash-screen.html">
//                     <div className="d-flex align-items-center gap-16">
//                       <span className="icon">
//                         <img
//                           src="../../assets/svg/menu/box-white.svg"
//                           alt="icon"
//                         />
//                       </span>
//                       splash screen
//                     </div>
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li>
//             <label className="a-label__chevron" htmlFor="item-5">
//               <span className="d-flex align-items-center gap-16">
//                 <span className="icon">
//                   <img src="../../assets/svg/menu/gear-white.svg" alt="" />
//                 </span>
//                 settings
//               </span>
//               <img src="../../assets/svg/menu/chevron-right-black.svg" alt="" />
//             </label>
//             <input
//               type="checkbox"
//               id="item-5"
//               name="item-5"
//               className="m-menu__checkbox"
//             />
//             <div className="m-menu">
//               <div className="m-menu__header">
//                 <label className="m-menu__toggle" htmlFor="item-5">
//                   <img src="../../assets/svg/menu/back-white.svg" alt="" />
//                 </label>
//                 <span className="m-menu__header-title">settings</span>
//               </div>
//               <ul>
//                 <li>
//                   <a href="../profile/user-address.html">
//                     <div className="d-flex align-items-center gap-16">
//                       <span className="icon">
//                         <img
//                           src="../../assets/svg/menu/box-white.svg"
//                           alt="icon"
//                         />
//                       </span>
//                       My Address
//                     </div>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="../profile/user-payment.html">
//                     <div className="d-flex align-items-center gap-16">
//                       <span className="icon">
//                         <img
//                           src="../../assets/svg/menu/box-white.svg"
//                           alt="icon"
//                         />
//                       </span>
//                       Payment Method
//                     </div>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="../profile/change-password.html">
//                     <div className="d-flex align-items-center gap-16">
//                       <span className="icon">
//                         <img
//                           src="../../assets/svg/menu/box-white.svg"
//                           alt="icon"
//                         />
//                       </span>
//                       Change Password
//                     </div>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="../profile/forgot-password.html">
//                     <div className="d-flex align-items-center gap-16">
//                       <span className="icon">
//                         <img
//                           src="../../assets/svg/menu/box-white.svg"
//                           alt="icon"
//                         />
//                       </span>
//                       Forgot Password
//                     </div>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="../profile/security.html">
//                     <div className="d-flex align-items-center gap-16">
//                       <span className="icon">
//                         <img
//                           src="../../assets/svg/menu/box-white.svg"
//                           alt="icon"
//                         />
//                       </span>
//                       Security
//                     </div>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="../profile/user-language.html">
//                     <div className="d-flex align-items-center gap-16">
//                       <span className="icon">
//                         <img
//                           src="../../assets/svg/menu/box-white.svg"
//                           alt="icon"
//                         />
//                       </span>
//                       Language
//                     </div>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="../profile/notifications.html">
//                     <div className="d-flex align-items-center gap-16">
//                       <span className="icon">
//                         <img
//                           src="../../assets/svg/menu/box-white.svg"
//                           alt="icon"
//                         />
//                       </span>
//                       Notifications
//                     </div>
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li className="dz-switch">
//             <div className="a-label__chevron">
//               <div className="d-flex align-items-center gap-16">
//                 <span className="icon">
//                   <img src="../../assets/svg/menu/moon-white.svg" alt="" />
//                 </span>
//                 switch to dark mode
//               </div>
//               <label className="toggle-switch" htmlFor="enableMode">
//                 <input
//                   type="checkbox"
//                   id="enableMode"
//                   className="mode-switch"
//                 />
//                 <span className="slider" />
//               </label>
//             </div>
//           </li>
//         </ul>
//       </div>
//       {/* end main menu */}
//     </section>
//     {/* menu, side-menu end */}
//     {/* signin start */}
//     <section className="auth signin">
//       <div className="heading">
//         <h2>Hi, User!</h2>
//         <p>Choose measurement type</p>
//       </div>
//       <div className="form-area auth-form">
//         <form action="#">
//           <div>
 
//           </div>
//           <NavLink to={"/step1inch"} className="btn-primary">
//             Regular
//           </NavLink>
//         </form>
//         <div className="divider d-flex align-items-center justify-content-center gap-12">
//           <span className="d-inline-block" />
//           <small className="d-inline-block">Or</small>
//           <span className="d-inline-block" />
//         </div>
//         <div className="d-flex flex-column gap-16">
//           <NavLink to={"/step3inch"}
//             type="button"
//             className="social-btn"
//             data-bs-toggle="modal"
//             style={{
//               textDecoration:"none"
//             }}
//             data-bs-target="#loginSuccess"
//           >
//             0, 3, 6, 9
//           </NavLink>

//         </div>
   
//       </div>
//     </section>
//     {/* signin end */}
//   </main>
//   {/* modal start */}
  
//   {/* modal end */}
//   {/* jquery */}
//   {/* bootstrap */}
//   {/* jquery ui */}
//   {/* mixitup */}
//   {/* gasp */}
//   {/* draggable */}
//   {/* swiper */}
//   {/* datepicker */}
//   {/* google-map api */}
//   {/* script */}
// </>
























	);
};

export default MeasurementType;
