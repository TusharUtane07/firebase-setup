import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setLotNumber } from "../redux/actions/lotActions";
import { FiEdit } from "react-icons/fi";
import img from "../img/bg-img/36.png"

const Details = () => {
  const [clientName, setClientName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [lotNumberValue, setLotNumberValue] = useState("");
  const [quantityNumber, setQuantityNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newText, setNewText] = useState("");
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [labels, setLabels] = useState({
    clientName: "Client Name",
    vehicleNumber: "Vehicle Number",
    lotNumber: "Lot Number",
    quantityNumber: "Quantity Number",
  });
  const [dynamicFields, setDynamicFields] = useState([]);
  const [lotNumberError, setLotNumberError] = useState(false);
  const [quantityNumberError, setQuantityNumberError] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    let isValid = true;

    if (!lotNumberValue) {
      setLotNumberError(true);
      isValid = false;
    } else {
      setLotNumberError(false);
    }

    if (!quantityNumber) {
      setQuantityNumberError(true);
      isValid = false;
    } else {
      setQuantityNumberError(false);
    }

    if (!isValid) return;

    const data = {
      clientName,
      vehicleNumber,
      lotNumber: lotNumberValue,
      quantityNumber,
    };

    dynamicFields.forEach((field) => {
      data[field.label] = field.value;
    });

    const docRef = doc(database, "Data", "lot: " + lotNumberValue);
    await setDoc(docRef, data);

    localStorage.setItem("data", JSON.stringify(data));
    console.log("Document Added: ", docRef.id);
    dispatch(setLotNumber(lotNumberValue));
    navigate("/measurement-type");
  };

  const openModal = (field) => {
    setFieldToEdit(field);
    setShowModal(true);
  };

  const handleLabelChange = () => {
    if (fieldToEdit) {
      setLabels({ ...labels, [fieldToEdit]: newText });
    } else {
      setDynamicFields([
        ...dynamicFields,
        { label: newText, value: "" },
      ]);
    }
    setShowModal(false);
    setNewText("");
  };

  const handleDynamicFieldChange = (index, value) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index].value = value;
    setDynamicFields(updatedFields);
  };

  return (
    <>

  {/* Internet Connection Status */}
  <div className="internet-connection-status" id="internetStatus" />
  {/* Back Button */}
  <div className="login-back-button">
    <a onClick={()=>{
      window.history.back()
    }}>
      <i className="bi bi-arrow-left-short" />
    </a>
  </div>
  {/* Login Wrapper Area */}
  <div className="login-wrapper d-flex align-items-center justify-content-center">
    <div className="custom-container">
      <div className="text-center px-4">
        <img className="login-intro-img" src={img} alt="" />
      </div>
      {/* Register Form */}
      <div className="register-form mt-4">
        <h5 className="mb-3 text-center mb-2">Please Enter the Lot Details Accordingly </h5>
        <div >
          <div className="form-group text-start mb-3">
          <label
                    onClick={() => openModal("clientName")}
                    className="cursor-pointer mt-4"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom:"0.5rem" }}
                  >
                    {labels.clientName} <FiEdit />
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter the ${labels.clientName}`}
                    className="form-control"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
          </div>
          <div className="form-group text-start mb-3">
          <label
                    onClick={() => openModal("vehicleNumber")}
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px",marginBottom:"0.5rem"  }}
                  >
                    {labels.vehicleNumber} <FiEdit />
                  </label>
                  <input
                    type="text"
                    className="form-control"

                    placeholder={`Enter the ${labels.vehicleNumber}`}
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
          </div>
          <div className="form-group text-start mb-3 position-relative">
          <label
                    onClick={() => openModal("lotNumber")}
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom:"0.5rem" }}
                  >
                    {labels.lotNumber} <FiEdit />
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter the ${labels.lotNumber}`}
                    className="form-control"
                    value={lotNumberValue}
                    onChange={(e) => setLotNumberValue(e.target.value)}
                  />
                  {lotNumberError && <div className="pt-2  text-red-500">Lot number needs to be added.</div>}
            <div className="position-absolute" id="password-visibility">
              <i className="bi bi-eye-slash" />
            </div>
          </div>
          <div className="form-group text-start mb-3 position-relative">
          <label
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom:"0.5rem"  }}
                  >
                    {labels.quantityNumber}
                  </label>
                  <input
                    type="number"
                    placeholder={`Enter the ${labels.quantityNumber}`}
                    className="form-control"
                    value={quantityNumber}
                    onChange={(e) => setQuantityNumber(e.target.value)}
                  />
                  {quantityNumberError && <div className="pt-2 text-red-500">Quantity number needs to be added.</div>}
            <div className="position-absolute" id="password-visibility">
              <i className="bi bi-eye-slash" />
            </div>
          </div>
          {dynamicFields.map((field, index) => (
                  <div key={index}>
                    <label
                      className="cursor-pointer"
                      style={{ display: 'flex', alignItems: 'center', gap: "10px", marginTop:"0.5rem"  }}
                      >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter the ${field.label}`}
                      className="form-control"
                      value={field.value}
                      onChange={(e) => handleDynamicFieldChange(index, e.target.value)}
                    />
                  </div>
                ))}
          <div className="mb-3" id="pswmeter" />
          <div className="form-check mb-3">
          
          </div>
       <button onClick={() => openModal(null)} type="button" className="btn btn-primary w-100 mt-2 mb-2" style={{
        background:"transparent",
        color:"rgb(12,109,253)"
       }}>Add new field</button>

          <button className="btn btn-primary w-100" onClick={handleSubmit}>
            Start
          </button>
        </div>
      </div>
      {/* Login Meta */}
      {showModal && (
          <div className="fixed inset-0 bg-gray-600 w-full h-screen bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded mx-5">
              <h2 className="text-xl mb-4">Enter Name of Field</h2>
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter title"
                className="border p-2 mt-1 border-black w-full rounded-lg"
              />
              <div className="mt-4 flex justify-start">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  style={{
                    width:"5rem"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLabelChange}
                  className="btn-primary py-1 border-none ml-3 rounded-md"
                  style={{
                    width:"5rem"
                  }}
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  </div>
  {/* All JavaScript Files */}
</>

    // <>
    //   <main>
    //     <section className="auth signin-email">
    //       <div className="page-title"></div>
    //       <div className="heading">
    //         <h2> Details</h2>
    //         <p>Please Enter the Lot Details Accordingly</p>
    //       </div>
    //       <div className="auth-form">
    //         <form action="#">
    //           <div className="d-flex flex-column gap-4">
    //             <div>
    //               <label
    //                 onClick={() => openModal("clientName")}
    //                 className="cursor-pointer"
    //                 style={{ display: 'flex', alignItems: 'center', gap: "10px" }}
    //               >
    //                 {labels.clientName} <FiEdit />
    //               </label>
    //               <input
    //                 type="text"
    //                 placeholder={`Enter the ${labels.clientName}`}
    //                 className="input-field d-block"
    //                 value={clientName}
    //                 onChange={(e) => setClientName(e.target.value)}
    //               />
    //             </div>
    //             <div>
    //               <label
    //                 onClick={() => openModal("vehicleNumber")}
    //                 className="cursor-pointer"
    //                 style={{ display: 'flex', alignItems: 'center', gap: "10px" }}
    //               >
    //                 {labels.vehicleNumber} <FiEdit />
    //               </label>
    //               <input
    //                 type="text"
    //                 placeholder={`Enter the ${labels.vehicleNumber}`}
    //                 className="input-field d-block"
    //                 value={vehicleNumber}
    //                 onChange={(e) => setVehicleNumber(e.target.value)}
    //               />
    //             </div>
    //             <div>
    //               <label
    //                 onClick={() => openModal("lotNumber")}
    //                 className="cursor-pointer"
    //                 style={{ display: 'flex', alignItems: 'center', gap: "10px" }}
    //               >
    //                 {labels.lotNumber} <FiEdit />
    //               </label>
    //               <input
    //                 type="text"
    //                 placeholder={`Enter the ${labels.lotNumber}`}
    //                 className="input-field d-block"
    //                 value={lotNumberValue}
    //                 onChange={(e) => setLotNumberValue(e.target.value)}
    //               />
    //               {lotNumberError && <div className="pt-2 text-center text-red-500">Lot number needs to be added.</div>}
    //             </div>
    //             <div>
    //               <label
    //                 className="cursor-pointer"
    //                 style={{ display: 'flex', alignItems: 'center', gap: "10px" }}
    //               >
    //                 {labels.quantityNumber}
    //               </label>
    //               <input
    //                 type="number"
    //                 placeholder={`Enter the ${labels.quantityNumber}`}
    //                 className="input-field d-block"
    //                 value={quantityNumber}
    //                 onChange={(e) => setQuantityNumber(e.target.value)}
    //               />
    //               {quantityNumberError && <div className="pt-2 text-center text-red-500">Quantity number needs to be added.</div>}
    //             </div>
    //             {dynamicFields.map((field, index) => (
    //               <div key={index}>
    //                 <label
    //                   className="cursor-pointer"
    //                   style={{ display: 'flex', alignItems: 'center', gap: "10px" }}
    //                 >
    //                   {field.label}
    //                 </label>
    //                 <input
    //                   type="text"
    //                   placeholder={`Enter the ${field.label}`}
    //                   className="input-field d-block"
    //                   value={field.value}
    //                   onChange={(e) => handleDynamicFieldChange(index, e.target.value)}
    //                 />
    //               </div>
    //             ))}
    //             <div>
    //               <button onClick={() => openModal(null)} type="button" className="btn-primary border-none">Add new field</button>
    //             </div>
    //           </div>
    //           <a onClick={handleSubmit} className="btn-primary">
    //             Proceed
    //           </a>
    //         </form>
    //       </div>
    //     </section>

    //   </main>
    // </>
  );
};

export default Details;
