import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../firebase/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setLotNumber } from "../redux/actions/lotActions";
import { FiEdit } from "react-icons/fi";
import img from "../img/bg-img/36.png";
import loader from '../assests/loader.png';

const DetailsLot = () => {
  const [clientName, setClientName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [lotNumberValue, setLotNumberValue] = useState("");
  const [measurementType, setMesurementType] = useState("MM");
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
  console.log("id:", id);

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
      clientName,
      vehicleNumber,
      lotNumber: lotNumberValue,
      quantityNumber,
      measurementType
    };

    dynamicFields.forEach((field) => {
      data[field.label] = field.value;
    });
    const docRef = doc(database, "Data", "lot: " + id);
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

  const handleAddTemplate = async () => {
    const data = {
      templateName: tempalteName,
      1: labels.clientName,
      2: labels.vehicleNumber,
      3: labels.lotNumber,
      4: labels.quantityNumber,
      5: labels.measurement
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
      console.log("Templates:", templatesData);
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
        console.log("No such document!");
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

  const setTheLabels = (item) => {
    setLabels({
      clientName: item[1],
      vehicleNumber: item[2],
      lotNumber: item[3],
      quantityNumber: item[4],
      measurement: item[5],
    });
    setTemplateShowCase(false);
  }

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
                <div className="form-group text-start mb-3">
                  <label
                    onClick={() => openModal("clientName")}
                    className="cursor-pointer mt-4"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom: "0.5rem" }}
                  >
                    {labels.clientName} <FiEdit />
                  </label>
                  <input
                    type="text"
                    placeholder={item?.clientName}
                    className="form-control"
                    value={item?.clientName}
                    disabled
                  />
                </div>
                <div className="form-group text-start mb-3">
                  <label
                    onClick={() => openModal("vehicleNumber")}
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom: "0.5rem" }}
                  >
                    {labels.vehicleNumber} <FiEdit />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={item?.vehicleNumber}
                    value={item?.vehicleNumber}
                    disabled
                  />
                </div>
                <div className="form-group text-start mb-3 position-relative">
                  <label
                    onClick={() => openModal("lotNumber")}
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom: "0.5rem" }}
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
                  {lotNumberError && <div className="pt-2 text-red-500">{labels.lotNumber} needs to be added.</div>}
                  <div className="position-absolute" id="password-visibility">
                    <i className="bi bi-eye-slash" />
                  </div>
                </div>
                <div className="form-group text-start mb-3 position-relative">
                  <label
                    className="cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom: "0.5rem" }}
                  >
                    {labels.quantityNumber} <FiEdit />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Enter the ${labels.quantityNumber}`}
                    value={quantityNumber}
                    onChange={(e) => setQuantityNumber(e.target.value)}
                  />
                  <div className="position-absolute" id="password-visibility">
                    <i className="bi bi-eye-slash" />
                  </div>
                </div>
                <div className="form-group text-start mb-3">
                  <label
                    className="cursor-pointer"
                    onClick={() => openModal("measurement")}
                    style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom: "0.5rem" }}
                  >
                    {labels.measurement} <FiEdit />
                  </label>
                  <select
                    value={measurementType}
                    className="form-control"
                    onChange={(e) => setMesurementType(e.target.value)}
                  >
                    <option value="MM">MM</option>
                    <option value="GM">GM</option>
                    <option value="KG">KG</option>
                  </select>
                </div>
              </div>
            ))}
            {dynamicFields.map((field, index) => (
              <div className="form-group text-start mb-3" key={index}>
                <label
                  className="cursor-pointer mt-4"
                  style={{ display: 'flex', alignItems: 'center', gap: "10px", marginBottom: "0.5rem" }}
                >
                  {field.label} <FiEdit />
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
