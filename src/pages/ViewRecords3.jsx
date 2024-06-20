import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { database } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { IoHome } from 'react-icons/io5';
// import loader from '../assets/images/loader.png'

const ViewRecords3 = () => {
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
          <a onClick={() => navigate(`/step3inch`)} style={{
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
            <a className="d-flex" href="chat.html">
              {/* Thumbnail */}
          
              {/* Info */}

              <div className="chat-user-info">
                <h6 className="text-truncate mb-0">{item.multiplication} {item.measurement}</h6>
                <div className="last-chat">
                  <p className="mb-0 text-truncate">
                  Peice Number : {index+1}
                  </p>
                </div>
              </div>
            </a>
            {/* Options */}
            <div className="dropstart chat-options-btn">
              <button
                className="btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-three-dots-vertical" />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a onClick={() => navigate(`/edit-3inch/${index}`)}>
                    <i className="bi bi-mic-mute" />
                    Edit
                  </a>
                </li>
            
              </ul>
            </div>
          </li>
          )
        })}
       
      </ul>
    </div>
  </div>

</>

// <>

//   {/* splash-screen end */}
//   <main className="ticket">
//     {/* page-title */}
//     <div className="page-title" style={{
//       display:"flex",
//       flexDirection:"column",
//       alignItems:"center"
//     }}>
//       <h2 className="main-title" style={{
//         fontSize:"1.4rem"
//       }}>Current Records</h2>
//       <button className='form-control' onClick={() => navigate(`/step1inch`)}> &lt; Return Back</button>

//     </div>
//     {/* tab */}
//     <section className="ticket-tab">
//       <ul className="nav nav-tabs" id="myTab" role="tablist">
//         <li className="nav-item" role="presentation">
//           <button
//             className={`nav-link ${toogleView=="detailed" && "active"} `}
//             id="booked-tab"
//             data-bs-toggle="tab"
//             data-bs-target="#booked-tab-pane"
//             type="button"
//             role="tab"
//             aria-controls="booked-tab-pane"
//             aria-selected="true"
//             onClick={()=>{
//               setToggleView("detailed")
//             }}
//           >
//             Detailed View
//           </button>
//         </li>
//         <li className="nav-item" role="presentation">
//           <button
//             className={`nav-link ${toogleView=="lotview" && "active"} `}
//             id="history-tab"
//             data-bs-toggle="tab"
//             data-bs-target="#history-tab-pane"
//             type="button"
//             role="tab"
//             aria-controls="history-tab-pane"
//             aria-selected="false"
//             onClick={()=>{
//               setToggleView("lotview")
//             }}
//           >
//             Lot View
//           </button>
//         </li>
//       </ul>
//       {
//             data?.results?.map((item, index) => {
//                 return (
//                   toogleView=="lotview" ?
//                   <div className="tab-content" id="myTabContent">
//                   <div
//                     className="tab-pane fade show active"
//                     id="booked-tab-pane"
//                     role="tabpanel"
//                     aria-labelledby="booked-tab"
//                     tabIndex={0}
//                   >
//                     {/* item 1 */}
//                     <div className="ticket-card radius-8">
//                       {/* card-title */}
                  
//                       {/* card-item */}
      
//                       <div className="card-footer d-flex align-items-center justify-content-between">
//                         <div>
//                           <p>Peice Number : {index+1}</p>
//                           <h3>{item.multiplication}</h3>
//                         </div>
//                         <a onClick={() => navigate(`/edit-1inch/${index}`)}>Edit</a>
//                       </div>
//                     </div>
          
//                   </div>
            
//                 </div>:
//                     <div className="tab-content" id="myTabContent">
//                     <div
//                       className="tab-pane fade show active"
//                       id="booked-tab-pane"
//                       role="tabpanel"
//                       aria-labelledby="booked-tab"
//                       tabIndex={0}
//                     >
//                       {/* item 1 */}
//                       <div className="ticket-card radius-8">
//                         {/* card-title */}
//                         <div className="card-title d-flex align-items-center justify-content-between">
//                           <p>{data?.vehicleNumber}</p>
//                           <span style={{background:"#4e97f3", color:"white"}}>{data?.lotNumberValue}</span>
//                         </div>
//                         {/* card-item */}
//                         <div className="card-item d-flex align-items-center gap-16 w-100">
                         
//                           <div className="content flex-grow">
//                             <h4>Peice Number - {index+1}</h4>
                           
                           
//                           </div>
//                         </div>
//                         {/* card-footer */}
//                         <div className="card-footer d-flex align-items-center justify-content-between">
//                           <div>
//                             <p>Marked Calculation</p>
//                             <h3>{item.multiplication}</h3>
//                           </div>
//                           <a onClick={() => navigate(`/edit-1inch/${index}`)}>Edit</a>
//                         </div>
//                       </div>
            
//                     </div>
              
//                   </div>
//                 )
//             })
//             }

//     </section>
//   </main>

// </>















    );
};

export default ViewRecords3;
