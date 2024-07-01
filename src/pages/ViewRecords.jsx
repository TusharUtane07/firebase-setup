import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { database } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { IoHome } from 'react-icons/io5';
import loader from "../assests/loader.png";
import { FaPencilAlt } from 'react-icons/fa';
import { BsPencilSquare } from 'react-icons/bs';
const ViewRecords = () => {
    const [data, setData] = useState(null);
    const [toogleView, setToggleView] = useState("detailed")
    const navigate = useNavigate();
    const lotNumberValue = useSelector((state) => state.lotReducer.lotNumber);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        try {
            const docRef = doc(database, "Data", "lot: "+lotNumberValue);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                console.log(docSnapshot.data())
                setData(docSnapshot.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        } finally {
          setLoading(false)
        }
    };

    useEffect(() => {
        getData();
    }, [lotNumberValue]);

    if (loading) {
      return <div className="flex items-center justify-center h-screen animate-spin">
          <img src={loader} alt="Loading..." className="w-40 h-40" />
      </div>;
  }

    return (


<>

  {/* Internet Connection Status */}
  <div className="internet-connection-status" id="internetStatus" />
  {/* Header Area */}
  <div className="header-area" id="headerArea">
    <div className="container">
      {/* Header Content */}
      <div className="header-content header-style-five position-relative d-flex align-items-center justify-content-between">
        {/* Back Button */}
        <div className="back-button">
          <a onClick={() => navigate(`/step1inch`)} style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
          }}>
            <i className="bi bi-arrow-left-short" />
            Return to Calculation
          </a>
        </div>
        {/* Page Title */}
        <div className="page-heading">
          <h6 className="mb-0">View Records</h6>
        </div>
        {/* Navbar Toggler */}
    
      </div>
    </div>
  </div>
  {/* # Sidenav Left */}
  <div
    className="offcanvas offcanvas-start"
    id="affanOffcanvas"
    data-bs-scroll="true"
    tabIndex={-1}
    aria-labelledby="affanOffcanvsLabel"
  >
    <button
      className="btn-close btn-close-white text-reset"
      type="button"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    />
 
  </div>
  {/* Add new contact modal */}
  <div
    className="add-new-contact-modal modal fade px-0"
    id="addnewcontact"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabIndex={-1}
    aria-labelledby="addnewcontactlabel"
    aria-hidden="true"
  >
  
  </div>
  <div className="page-content-wrapper py-3">
    {/* Add New Contact */}
    <div className="add-new-contact-wrap">
    
    </div>
    <div className="container">
     
 
      {/* Element Heading */}
      <div className="element-heading">
        <h6 className="ps-1">Recorded Messaurements</h6>
      </div>
      {/* Chat User List */}
      <ul className="ps-0 chat-user-list">
        {/* Single Chat User */}
        {data?.results?.map((item, index) => {
          return(
            <li className="p-3 chat-unread">
            {/* <a className="d-flex" href="chat.html"> */}
              {/* Thumbnail */}
          
              {/* Info */}

              <div className="chat-user-info">
                <h6 className="text-truncate mb-0">{item.multiplication} {item.measurement} <span style={{
                  fontSize:"0.8rem",
                  marginLeft:"0.5rem"
                }}>- 1 Inch Measurements Data</span></h6>
                <div className="last-chat">
                  <p className="mb-0 text-truncate">
                  Peice Number : {index+1}
                  </p>
                </div>
              </div>
           
            {/* Options */}
            <div className="dropstart chat-options-btn">
             
                  <a onClick={() => navigate(`/edit-1inch/${index}`)}>
                  <BsPencilSquare />
                  
                  </a>
                
            </div>
          </li>
          )
        })}
       
      </ul>
    </div>
  </div>

</>


    );
};

export default ViewRecords;
