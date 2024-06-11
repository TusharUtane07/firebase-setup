import React from 'react'
import { Link } from 'react-router-dom'
import img from "../assets/images/onboarding/slide-1.jpg"
const WelcomePage = () => {
  return (
<>
 
  <section className="wrapper dz-mode">
    {/* menu */}
    
    <div className="m-menu__overlay" />
    {/* main menu */}
    <div className="m-menu">
      <div className="m-menu__header">
        <button className="m-menu__close">
          <img src="assets/svg/menu/close-white.svg" alt="icon" />
        </button>
        <div className="menu-user">
          <img src="assets/images/profile/avatar.png" alt="avatar" />
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
          <a href="pages/home.html">
            <div className="d-flex align-items-center gap-16">
              <span className="icon">
                <img src="assets/svg/menu/pie-white.svg" alt="" />
              </span>
              overview
            </div>
            <img src="assets/svg/menu/chevron-right-black.svg" alt="" />
          </a>
        </li>
        <li>
          <a href="page.html">
            <div className="d-flex align-items-center gap-16">
              <span className="icon">
                <img src="assets/svg/menu/page-white.svg" alt="" />
              </span>
              pages
            </div>
            <img src="assets/svg/menu/chevron-right-black.svg" alt="" />
          </a>
        </li>
        <li>
          <h2 className="menu-title">others</h2>
        </li>
        <li>
          <label className="a-label__chevron" htmlFor="item-4">
            <span className="d-flex align-items-center gap-16">
              <span className="icon">
                <img src="assets/svg/menu/grid-white.svg" alt="" />
              </span>
              components
            </span>
            <img src="assets/svg/menu/chevron-right-black.svg" alt="" />
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
                <img src="assets/svg/menu/back-white.svg" alt="" />
              </label>
              <span className="m-menu__header-title">components</span>
            </div>
            <ul>
              <li>
                <a href="components/splash-screen.html">
                  <div className="d-flex align-items-center gap-16">
                    <span className="icon">
                      <img src="assets/svg/menu/box-white.svg" alt="icon" />
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
                <img src="assets/svg/menu/gear-white.svg" alt="" />
              </span>
              settings
            </span>
            <img src="assets/svg/menu/chevron-right-black.svg" alt="" />
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
                <img src="assets/svg/menu/back-white.svg" alt="" />
              </label>
              <span className="m-menu__header-title">settings</span>
            </div>
            <ul>
              <li>
                <a href="pages/profile/user-address.html">
                  <div className="d-flex align-items-center gap-16">
                    <span className="icon">
                      <img src="assets/svg/menu/box-white.svg" alt="icon" />
                    </span>
                    My Address
                  </div>
                </a>
              </li>
              <li>
                <a href="pages/profile/user-payment.html">
                  <div className="d-flex align-items-center gap-16">
                    <span className="icon">
                      <img src="assets/svg/menu/box-white.svg" alt="icon" />
                    </span>
                    Payment Method
                  </div>
                </a>
              </li>
              <li>
                <a href="pages/profile/change-password.html">
                  <div className="d-flex align-items-center gap-16">
                    <span className="icon">
                      <img src="assets/svg/menu/box-white.svg" alt="icon" />
                    </span>
                    Change Password
                  </div>
                </a>
              </li>
              <li>
                <a href="pages/profile/forgot-password.html">
                  <div className="d-flex align-items-center gap-16">
                    <span className="icon">
                      <img src="assets/svg/menu/box-white.svg" alt="icon" />
                    </span>
                    Forgot Password
                  </div>
                </a>
              </li>
              <li>
                <a href="pages/profile/security.html">
                  <div className="d-flex align-items-center gap-16">
                    <span className="icon">
                      <img src="assets/svg/menu/box-white.svg" alt="icon" />
                    </span>
                    Security
                  </div>
                </a>
              </li>
              <li>
                <a href="pages/profile/user-language.html">
                  <div className="d-flex align-items-center gap-16">
                    <span className="icon">
                      <img src="assets/svg/menu/box-white.svg" alt="icon" />
                    </span>
                    Language
                  </div>
                </a>
              </li>
              <li>
                <a href="pages/profile/notifications.html">
                  <div className="d-flex align-items-center gap-16">
                    <span className="icon">
                      <img src="assets/svg/menu/box-white.svg" alt="icon" />
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
                <img src="assets/svg/menu/moon-white.svg" alt="" />
              </span>
              switch to dark mode
            </div>
            <label className="toggle-switch" htmlFor="enableMode">
              <input type="checkbox" id="enableMode" className="mode-switch" />
              <span className="slider" />
            </label>
          </div>
        </li>
      </ul>
    </div>
    {/* end main menu */}
  </section>
  {/* menu, side-menu end */}
  <main>
    {/* onboarding start */}
    <section className="onboarding">
      <div className="swiper onboarding-swiper">
        <div className="swiper-wrapper">
          {/* item-1 */}
          <div className="swiper-slide">
            <div className="image position-relative">
              <img
                src={img}
                alt="Slide"
                className="w-100 h-80 object-fit-cover"
              />
            </div>
       
            <div className="content text-center">
              <h2>RAGHU MARBELS</h2>
              <p>
              Your Personalized Business Calculator for Perfect Marble Slab Measurements.
              </p>
              <Link
                to={"/details"}
                style={{
                  textDecoration:"none"
                }}
                className="btn-primary btn-get-started check-decoration-no"
              >
               Start Measuring
              </Link>
            </div>
          </div>

          {/* item-2 */}

        </div>
      </div>
    </section>
    {/* onboarding end */}
  </main>
  {/* jquery */}
  {/* bootstrap */}
  {/* jquery ui */}
  {/* mixitup */}
  {/* gasp */}
  {/* draggable */}
  {/* swiper */}
  {/* datepicker */}
  {/* google-map api */}
  {/*  */}
  {/* script */}
</>

  
  )
}

export default WelcomePage