import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../firebase/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setLotNumber } from "../redux/actions/lotActions";
import { FiEdit } from "react-icons/fi";
import img from "../img/bg-img/36.png";
import loader from '../assests/loader.png';

const DetailsLot = () => {
  useEffect(()=>{
    window.localStorage.clear() 
   },[])
  const [clientName, setClientName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [lotNumberValue, setLotNumberValue] = useState("");
  const [measurementType, setMesurementType] = useState("feet");
  const [quantityNumber, setQuantityNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newText, setNewText] = useState("");
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState({
    clientName: "Client Name",
    vehicleNumber: "Vehicle Number",
    lotNumber: "Lot Number",
    quantityNumber: "Quantity Number",
    measurement: "Measurement",
  });
  const [dynamicFields, setDynamicFields] = useState([]);
  const [lotNumberError, setLotNumberError] = useState(false);

  let { id } = useParams();

	const lotNumberDetailsValue = useSelector((state) => state.lotReducer.lotNumber);


  const [tempalteName, setTemplateName] = useState("");
  const [templateModal, setTemplateModal] = useState(false);
  const [data, setData] = useState([]);
  const [templatesData, setTemplatesData] = useState([]);
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

  const handleAddTemplate = async () => {
    const data = {
      templateName: tempalteName,
      1: labels.clientName,
      2: labels.vehicleNumber,
    };

    const docRef = doc(database, "Templates", tempalteName);
    await setDoc(docRef, data);

    setTemplateModal(false);
    setTemplateName("");
  }

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(database, 'Templates'));
      const templateData = querySnapshot.docs.map(doc => doc.data());
      setTemplatesData(templateData);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  }

  const getDataLot = async () => {
    try {
      const docRef = doc(database, "Data", "lot: " + id);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        setData([docSnapshot.data()]);
      } else {
      }
    } catch (error) {
      console.error("Error getting document:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getDataLot();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen animate-spin">
        <img src={loader} alt="Loading..." className="w-40 h-40" />
      </div>
    );
  }


    const excludedKeys = [
      "breadth", 
      "length", 
      "Quantity Number", 
      "Lot Number", 
      "Measurement", 
      "lastValue", 
      "results", 
      "secondLastValue", 
      "thirdLastValue",
      "undefined"
  ];
  
  const filteredData = Object.keys(data[0]).reduce((acc, key) => {
      if (!excludedKeys.includes(key)) {
          acc[key] = data[0][key];
      }
      return acc    
    }, {});
  


  return (
    <>
      {/* Internet Connection Status */}
      <div className="internet-connection-status" id="internetStatus" />
      {/* Back Button */}
      <div className="login-back-button">
        <a onClick={() => {
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
            {Array.isArray(data) && data.length > 0 && data.map((item, index) => (
              <div key={index}>
                 <div>
      {/* {Object.keys(filteredData).map((key) => (
        <div className="form-group text-start mb-3" key={key}>
          <label
            onClick={() => openModal(key)}
            className="cursor-pointer mt-4"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}
          >
            {key}
          </label>
          <input
            type="text"
            className="form-control"
            placeholder={filteredData[key]}
            value={filteredData[key]}
            disabled
            />
        </div>
      ))} */}
    </div>
                <div className="form-group text-start mb-3 position-relative mt-4">
                  <label
                    onClick={() => openModal("lotNumber")}
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom: "0.5rem" }}
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
                  {lotNumberError && <div className="pt-2 text-red-500">Lot Number needs to be added.</div>}
                  <div className="position-absolute" id="password-visibility">
                    <i className="bi bi-eye-slash" />
                  </div>
                </div>
                <div className="form-group text-start mb-3 position-relative">
                  <label
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom: "0.5rem" }}
                  >
                    Quantity Number 
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Enter the Quantity Number `}
                    value={quantityNumber}
                    onChange={(e) => setQuantityNumber(e.target.value)}
                  />
                  <div className="position-absolute" id="password-visibility">
                    <i className="bi bi-eye-slash" />
                  </div>
                </div>
 
              </div>
            ))}
            {dynamicFields.map((field, index) => (
              <div className="form-group text-start mb-3" key={index}>
                <label
                  className="cursor-pointer mt-4"
                  style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom: "0.5rem" }}
                >
                  {field.label} 
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${field.label}`}
                  className="form-control"
                  value={field.value}
                  onChange={(e) => handleDynamicFieldChange(index, e.target.value)}
                />
              </div>
            ))}
            {/* <div className="form-group text-start mb-3 d-flex justify-content-between">
              <button
                onClick={() => setTemplateShowCase(!templateShowCase)}
                className="btn m-2 btn-warning"
              >
                {templateShowCase ? 'Hide Templates' : 'Show Templates'}
              </button>
              <button
                onClick={() => setTemplateModal(true)}
                className="btn m-2 btn-primary"
              >
                Add Template
              </button>
            </div> */}
            {templateShowCase && (
              <div className="form-group text-start mb-3">
                {templatesData.map((item, index) => (
                  <button
                    onClick={() => setTheLabels(item)}
                    className="btn m-2 btn-outline-primary"
                    key={index}
                  >
                    {item.templateName}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={handleSubmit}
              className="btn btn-primary w-100"
              type="submit"
            >
              Save & Next
            </button>
          </div> 
        </div>
      </div>
      {/* Modal */}
      <div
        className={`modal fade show ${showModal ? 'd-block' : 'd-none'}`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{fieldToEdit ? `Edit ${labels[fieldToEdit]}` : 'Add New Field'}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="editField">Field Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="editField"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleLabelChange}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Template Modal */}
      <div
        className={`modal fade show ${templateModal ? 'd-block' : 'd-none'}`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Template</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setTemplateModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="templateName">Template Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="templateName"
                  value={tempalteName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setTemplateModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddTemplate}
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsLot;
