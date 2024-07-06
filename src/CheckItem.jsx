import React from 'react'
import { App as CapacitorApp } from '@capacitor/app';
import { useNavigate } from 'react-router-dom';

const CheckItem = () => {
    const navigate = useNavigate();

CapacitorApp.addListener('backButton', ({canGoBack}) => {
	const currentUrl = window.location.pathname;
	if (currentUrl === '/view-records') {
        console.log("aa")
        navigate(`/step1inch`)
	  }
      else if (currentUrl === '/view-records3') {
        console.log("bb")

		navigate('/step3inch');
	  }
      else if (currentUrl === '/final-result') {
        console.log("cc")

        navigate(`/step1inch`)
	  }
      else if (currentUrl === '/final-result3') {
        console.log("dd")

		navigate('/step3inch');
	  }
	else if(!canGoBack){
	  CapacitorApp.exitApp();
	} else {
        console.log("ee")

	  window.history.back();
	}
  });
  return (
    <></>
  )
}

export default CheckItem