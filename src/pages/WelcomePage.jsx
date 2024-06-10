import React from 'react'
import { Link } from 'react-router-dom'

const WelcomePage = () => {
  return (
    <div style={{
        height:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
    }}>
    <div id="page">
      <div className="header header-fixed header-logo-app" style={{marginLeft:"0rem"}}>
        <Link to="/" className="header-title custom-header-title " >
          <span className="color-highlight" style={{marginLeft:"-1.5rem"}}>Raghu </span>Marbles
        </Link>
    
      </div>
      <div
        id="menu-main"
        data-menu-load="menu-main.html"
        data-menu-active="nav-welcome"
        className="menu menu-box-left"
        data-menu-width={250}
        data-menu-effect="menu-parallax"
      />
      <div
        id="menu-colors"
        data-menu-load="menu-colors.html"
        data-menu-effect="menu-parallax"
        className="menu menu-box-right"
        data-menu-width={75}
      />
      <div
        id="menu-share"
        data-menu-load="menu-share.html"
        data-menu-effect="menu-parallax"
        className="menu menu-box-bottom"
        data-menu-height={323}
      />
      <div className="page-content header-clear-medium">
        <div
          className="splide single-slider slider-no-arrows slider-no-dots"
          id="single-slider-1"
        >
          <div className="splide__track">
            <div className="splide__list">
              <div className="splide__slide">
                <div className="card card-style bg-1" data-card-height={280}>
                  <div className="card-bottom text-center">
                    <h1 className="color-white mb-0 font-800">Top Quality</h1>
                    <p className="mt-n2 pb-3 color-white">
                      Flexibility, Speed, Ease of Use.
                    </p>
                  </div>
                  <div className="card-overlay bg-gradient-overlay" />
                </div>
              </div>
              <div className="splide__slide">
                <div className="card card-style bg-18" data-card-height={280}>
                  <div className="card-bottom text-center">
                    <h1 className="color-white mb-0 font-800">Feature Filled</h1>
                    <p className="mt-n2 pb-3 color-white">
                      Mobile Website or App or PWA.
                    </p>
                  </div>
                  <div className="card-overlay bg-gradient-overlay" />
                </div>
              </div>
              <div className="splide__slide">
                <div className="card card-style bg-28" data-card-height={280}>
                  <div className="card-bottom text-center">
                    <h1 className="color-white mb-0 font-800">
                      Splendid Simplicity
                    </h1>
                    <p className="mt-n2 pb-3 color-white">
                      It's Bootstrap, familiar, simple and powerful.
                    </p>
                  </div>
                  <div className="card-overlay bg-gradient-overlay" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center under-slider-btn">

        </div>
        <div className="content" style={{
            display:"flex",
            flexDirection:"column"
        }}>
          <p className="boxed-text-xl">
        Your Personalized Business Calculator for Perfect Marble Slab Measurements.
          </p>
          <Link
            to="/details"
            className="btn btn-center-l bg-highlight rounded-sm btn-m text-uppercase font-900 mt-4"
          >
            START MEASURING
          </Link>
        </div>
 

        <div className="divider divider-margins" />
        <div className="footer" data-menu-load="menu-footer.html" />
      </div>
      <div
        id="menu-install-pwa-android"
        className="menu menu-box-bottom rounded-0"
        data-menu-height={380}
        data-menu-effect="menu-parallax"
      >
        <img
          className="mx-auto mt-4 rounded-m"
          src="app/icons/icon-128x128.png"
          alt="img"
          width={90}
        />
        <h4 className="text-center mt-4 mb-2">Eazy on your Home Screen</h4>
        <p className="text-center boxed-text-xl">
          Install Eazy on your home screen, and access it just like a regular app.
          It really is that simple!
        </p>
        <div className="boxed-text-l">
          <a
            href="#"
            className="pwa-install mx-auto btn btn-m font-700 bg-highlight text-uppercase"
          >
            Add to Home Screen
          </a>
          <a
            href="#"
            className="pwa-dismiss close-menu btn-full mt-3 pt-2 text-center text-uppercase font-600 color-red-light font-12 opacity-50"
          >
            Maybe later
          </a>
        </div>
      </div>
      <div
        id="menu-install-pwa-ios"
        className="menu menu-box-bottom rounded-0"
        data-menu-height={340}
        data-menu-effect="menu-parallax"
      >
        <div className="boxed-text-xl top-25">
          <img
            className="mx-auto mt-4 rounded-m"
            src="app/icons/icon-128x128.png"
            alt="img"
            width={90}
          />
          <h4 className="text-center mt-4 mb-2">Eazy on your Home Screen</h4>
          <p className="text-center ms-3 me-3">
            Install Eazy on your home screen, and access it just like a regular
            app. Open your Safari menu and tap "Add to Home Screen".
          </p>
          <a
            href="#"
            className="pwa-dismiss close-menu btn-full mt-3 text-center text-uppercase font-900 color-red-light opacity-50 font-110"
          >
            Maybe later
          </a>
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default WelcomePage