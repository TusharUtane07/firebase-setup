import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setLotNumber } from "../redux/actions/lotActions";
import { FiEdit } from "react-icons/fi";
import img from "../img/bg-img/36.png"

const Details = () => {
  const [clientName, setClientName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [lotNumberValue, setLotNumberValue] = useState("");
  const [measurementType, setMesurementType ] = useState("MM");
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

    if (!isValid) return;

    const data = {
      [labels.clientName]: clientName,
    [labels.vehicleNumber]: vehicleNumber,
    [labels.lotNumber]: lotNumberValue,
    [labels.quantityNumber]: quantityNumber,
    [labels.measurement]: measurementType,
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

  const handleAddTemplate = async() => {
    const data = {
      templateName: tempalteName,
      1: labels.clientName,
      2: labels.vehicleNumber,
    };
    
    // Assuming dynamicFields is an array of objects with a 'label' property
    dynamicFields.forEach((field, index) => {
      data[3 + index] = field.label;
    });
    
    console.log(data);

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
      console.log("Templates:", templatesData);
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
    };
  
    const updatedDynamicFields = [];
    for (let i = 3; i < Object.keys(item).length; i++) {
      updatedDynamicFields.push({ label: item[i], value: "" });
    }
  
    // Update labels and dynamicFields state together
    setLabels(updatedLabels);
    setDynamicFields(updatedDynamicFields);
    setTemplateShowCase(false);
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
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom:"0.5rem" }}
                  >
                    Lot Number 
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter the Lot Number`}
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
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom:"0.5rem"  }}
                  >
                    Quantity Number
                  </label>
                  <input
                    type="number"
                    placeholder={`Enter the Quantity Number`}
                    className="form-control"
                    value={quantityNumber}
                    onChange={(e) => setQuantityNumber(e.target.value)}
                  />
                 
            <div className="position-absolute" id="password-visibility">
              <i className="bi bi-eye-slash" />
            </div>
          </div>
          <div className="form-group text-start mb-3 position-relative">
          <label
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom:"0.5rem"  }}
                  >
                    Measurement
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
            <div className="position-absolute" id="password-visibility">
              <i className="bi bi-eye-slash" />
            </div>
          </div>
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
          <div onClick={() => setTheLabels(item)} key={item.templateName} className="border border-black cursor-pointer m-2 p-2 rounded-md " style={{
            textAlign:"center"
          }}>{item.templateName}</div>
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
