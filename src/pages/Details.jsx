import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setLotNumber } from "../redux/actions/lotActions";
import { FiEdit } from "react-icons/fi";
import img from "../img/bg-img/36.png"
import { FaTrash } from "react-icons/fa";
import { Spin } from "antd";
import { App as CapacitorApp } from '@capacitor/app';
import jsPDF from "jspdf";

const Details = () => {
  useEffect(()=>{
    window.localStorage.clear() 
   },[])
   useEffect(() => {
    CapacitorApp.removeAllListeners();

    const backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      const currentUrl = window.location.pathname;
      console.log(currentUrl);
      let toGo = true;
      
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else if (currentUrl === '/view-records') {
        console.log("aa");
        toGo = false;
        navigate(`/step1inch`);
      } else if (currentUrl.includes("measurement-type")) {
        toGo = false;
        navigate(`/details`);
      } else if (currentUrl.includes("details")) {
        toGo = false;
        navigate(`/`);
      } else if (currentUrl === '/view-records3') {
        console.log("bb");
        toGo = false;
        navigate(`/step3inch`);
      } else if (currentUrl === '/step1inch') {
        console.log("cc");
        toGo = false;
        navigate(`/measurement-type/feet`);
      } else if (currentUrl === '/step3inch') {
        console.log("dd");
        toGo = false;
        navigate(`/measurement-type/feet`);
      } else if (currentUrl.includes("edit-1inch")) {
        console.log("ee");
        toGo = false;
        navigate(`/view-records`);
      } else if (currentUrl.includes("edit-3inch")) {
        console.log("ff");
        toGo = false;
        navigate(`/view-records3`);
      } else if (currentUrl === "/final-result") {
        console.log("gg");
        toGo = false;
        navigate(`/step1inch`);
      } else if (currentUrl === "/final-result3") {
        console.log("hh");
        toGo = false;
        navigate(`/step3inch`);
      }
    });


  }, []);
  const [clientName, setClientName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [lotNumberValue, setLotNumberValue] = useState("");
  const [measurementType, setMesurementType ] = useState("feet");
  const [quantityNumber, setQuantityNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newText, setNewText] = useState("");
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [labels, setLabels] = useState({
    clientName: "Client Name",
    vehicleNumber: "Vehicle Number",
    lotNumber: "Lot Number",
    quantityNumber: "Quantity Number",
    measurement: "Measurement",
  });
  const [dynamicFields, setDynamicFields] = useState([]);
  const [lotNumberError, setLotNumberError] = useState(false);

  const [tempalteName, setTemplateName] = useState("");
  const [templateModal, setTemplateModal] = useState(false);
  const [templatesData, setTemplatesData] = useState({});
  const [templateShowCase, setTemplateShowCase] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);

  console.log(JSON.stringify(templatesData) + "datatemplate")
  const navigate = useNavigate();
  const dispatch = useDispatch();
const [handleLoader, setLoader] = useState(false)
  const handleSubmit = async () => {
    setLoader(true)
    let isValid = true;

    if (!lotNumberValue) {
      setLotNumberError(true);
      isValid = false;
    } else {
      setLotNumberError(false);
    }

    if (!isValid) return;

    const data = {
      [labels.clientName]: clientName,
    [labels.vehicleNumber]: vehicleNumber,
    [labels.lotNumber]: lotNumberValue,
    [labels.quantityNumber]: quantityNumber,
    [labels.measurement]: measurementType,
    };

    const lotQuant = {
      "lotId": labels.lotNumber,
      "quantityId": labels.quantityNumber,
      "quantity": quantityNumber
    }

    dynamicFields.forEach((field) => {
      data[field.label] = field.value;
    });

    const docRef = doc(database, "Data", "lot: " + lotNumberValue);
    await setDoc(docRef, data);
    setLoader(false)
    localStorage.setItem("data", JSON.stringify(data));
    localStorage.setItem("lotQuant", JSON.stringify(lotQuant));
    dispatch(setLotNumber(lotNumberValue));
    navigate("/measurement-type/"+measurementType);
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
  const deleteItem = async(id) => {
    try {
      const docRef = doc(database, "Templates", id.templateName);
      await deleteDoc(docRef);
      getData()
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  }
  const handleAddTemplate = async() => {
    const data = {
      templateName: tempalteName,
      1: labels.clientName,
      2: labels.vehicleNumber,
      3: labels.lotNumber,
      4: labels.quantityNumber,
    };
    
    // Assuming dynamicFields is an array of objects with a 'label' property
    dynamicFields.forEach((field, index) => {
      data[5 + index] = field.label;
    });
    

    const docRef = doc(database, "Templates", tempalteName);
    await setDoc(docRef, data);

    setTemplateModal(false);
    setTemplateName("");
    getData();
  }

  const getData = async() => {
    try {
      const querySnapshot = await getDocs(collection(database, 'Templates'));
      const templateData = querySnapshot?.docs?.map(doc => doc.data());
      setTemplatesData(templateData);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  }
  const getDefaultTemplate = async() => {
    try {
      const querySnapshot = await getDocs(collection(database, 'DefaultTemplate'));
      const templateData = querySnapshot?.docs?.map(doc => doc.data());
      setTheLabels(templateData[0]);
      console.log("lbales", labels)
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  }
  

  useEffect(() => {
    getData();
  }, [])

  const setTheLabels = (item) => {
    // First, set the static labels
    const updatedLabels = {
      clientName: item[1],
      vehicleNumber: item[2],
      lotNumber: item[3],
      quantityNumber: item[4],
    };
  
    const updatedDynamicFields = [];
    for (let i = 5; i < Object.keys(item).length; i++) {
      updatedDynamicFields.push({ label: item[i], value: "" });
    }
  
    // Update labels and dynamicFields state together
    setLabels(updatedLabels);
    setDynamicFields(updatedDynamicFields);
    setTemplateShowCase(false);
  };

  const handleSetDefault = async() => {
    const data = {
      1: labels.clientName,
      2: labels.vehicleNumber,
      3: labels.lotNumber,
      4: labels.quantityNumber,
    };

    dynamicFields.forEach((field, index) => {
      data[5 + index] = field.label;
    });
    const docRef = doc(database, "DefaultTemplate", "tempalteName");
    await setDoc(docRef, data);
    getDefaultTemplate();
    console.log("set this as default")
  }
  
  useEffect(() => {
    getDefaultTemplate();
  }, [])
  
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
        <h5 className="mb-3 text-center ">Please Enter the Lot Details Accordingly </h5>
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
                  {lotNumberError && <div className="pt-2  text-red-500">Lot Number needs to be added.</div>}
            <div className="position-absolute" id="password-visibility">
              <i className="bi bi-eye-slash" />
            </div>
          </div>
          
          <div className="form-group text-start mb-3 position-relative">
          <label
                    onClick={() => openModal("quantityNumber")}
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom:"0.5rem"  }}
                  >
                    {labels.quantityNumber} <FiEdit />
                  </label>
                  <input
                    type="number"
                    placeholder={`Enter the ${labels.quantityNumber}`}
                    className="form-control"
                    value={quantityNumber}
                    onChange={(e) => setQuantityNumber(e.target.value)}
                  />
                 
            <div className="position-absolute" id="password-visibility">
              <i className="bi bi-eye-slash" />
            </div>
          </div>
          {/* <div className="form-group text-start mb-3 position-relative">

          <label
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom:"0.5rem"  }}
                  >
                    {labels.measurement}
                  </label>
                  <select
					name="measurement"
					id="measurement"
					value={measurementType}
					onChange={(e) => setMesurementType(e.target.value)}
					className="form-control">
					<option value="mm">MM</option>
					<option value="cm">CM</option>
					<option value="meter">METER</option>
					<option value="inches">INCHES</option>
					<option value="feet">FEET</option>
				</select>  
        </div> */}
          
          {dynamicFields.map((field, index) => (
  <div key={index}>
    <label
      className="cursor-pointer"
      style={{ display: 'flex', alignItems: 'center', gap: "10px", marginTop:"0.5rem" }}
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
          <div className="flex justify-between gap-3">
          <button onClick={() => setTemplateModal(true)} className="btn btn-primary w-full">+ Add Template</button>
          <button onClick={() => setTemplateShowCase(true)} className="btn btn-primary w-full">Saved Template</button>
          </div>
      { defaultButton && <button onClick={handleSetDefault} type="button" className="btn btn-primary w-100 mt-1 mb-2" style={{
       }}>Set as Default</button>}
       <button onClick={() => openModal(null)} type="button" className="btn mt-1 btn-primary w-100  mb-2" style={{
       }}>Add new field</button>

          <button className="btn btn-primary w-100" onClick={handleSubmit}>
            {handleLoader ? <Spin /> :"Start"} 
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
      {templateModal && (
          <div className="fixed inset-0 bg-gray-600 w-full h-screen bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded mx-5">
              <h2 className="text-xl mb-4">Enter Name of Template</h2>
              <input
                type="text"
                value={tempalteName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter title"
                className="border p-2 mt-1 border-black w-full rounded-lg"
              />
              <div className="mt-4 flex justify-start">
                <button
                  onClick={() => setTemplateModal(false)}
                  className="btn btn-secondary"
                  style={{
                    width:"5rem"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTemplate}
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
      {templateShowCase && (
  <div className="fixed inset-0 bg-gray-600 w-full h-screen bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-5 rounded mx-5">
      <h2 className="text-xl mb-4">Saved Templates</h2>
      <div className="row">
        {templatesData?.map((item, index) => (
          <>
          <div className="flex flex-col ">
          <div  key={item.templateName} className="border border-black cursor-pointer m-2 p-2 rounded-md " style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between"
          }}><p onClick={() => {setTheLabels(item)
             setDefaultButton(true)}
            } style={{
            margin:"0rem"
          }}>{item.templateName}</p> <a onClick={()=>{
            deleteItem(item)
          }} style={{
            color:"red"
          }}><FaTrash /></a>
          </div>
          </div>
          </>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setTemplateShowCase(false)}
          className="btn btn-secondary"
          style={{ width: "5rem" }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  </div>
  {/* All JavaScript Files */}
</>
  );
};

export default Details;
