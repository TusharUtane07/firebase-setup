import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDoc, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebase";
import "../style/cal.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const EditPage3Inch = () => {
	const [displayValue, setDisplayValue] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [newQuantity, setNewQuantity] = useState("");
	const placeholderText = "Enter your values";

    const [showMismatchModal, setShowMismatchModal] = useState(false);


	const lotNumberValue = useSelector((state) => state.lotReducer.lotNumber);
	const [vehicleNumber, setVehicleNumber] = useState("");

	const [clientName, setClientName] = useState("");
	const [measurementType, setMesurementType] = useState("");
	const [quantityNumber, setQuantityNumber] = useState("");
	const [pieceNumber, setPieceNumber] = useState(0);

	const [lastValue, setLastValue] = useState("");
	const [secondLastValue, setSecondLastValue] = useState("");
	const [thirdLastValue, setThirdLastValue] = useState("");

	const [valuesArray, setValuesArray] = useState();

	const { id } = useParams();
	const navigate = useNavigate();

	const getDocument = async () => {
		try {
			const docSnapshot = await getDoc(
				doc(database, "Data", "lot: " + lotNumberValue)
			);
			if (docSnapshot.exists()) {
				setClientName(docSnapshot?.data()?.clientName);
				setVehicleNumber(docSnapshot?.data()?.vehicleNumber);
				setQuantityNumber(docSnapshot?.data()?.quantityNumber);
				setValuesArray(docSnapshot?.data()?.results);
				const index = parseInt(id);
		if (!isNaN(index) && index >= 0 && index < docSnapshot?.data()?.results?.length) {
			const valueToSave = docSnapshot?.data()?.results[index];
			setDisplayValue(valueToSave?.multiplication);
			console.log("Value to save:", valueToSave);
		} else {
			console.error("Invalid index or values array is empty.");
		}
			} else {
				console.log("No such document!");
				return null;
			}
		} catch (error) {
			console.error("Error getting document:", error);
			throw error;
		}
	};


	useEffect(() => {
		getDocument();
	}, [lotNumberValue]);

	const handleButtonClick = (value) => {
		setDisplayValue((prev) => (prev === "" ? value : prev + value));
	};

	const handleCorrect = () => {
		setDisplayValue((prev) => prev.slice(0, -1));
	};

	const handleNext = async () => {
		try {
			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			
			const docSnapshot = await getDoc(docRef);
			
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				const index = parseInt(id);
				if (!isNaN(index) && index >= 0 && index < data?.results?.length) {
					data.results[index].multiplication = displayValue;
					await updateDoc(docRef, data);
					navigate('/view-records')
				} else {
					console.error("Invalid index or values array is empty.");
				}
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.error("Error updating document:", error);
		}
	};
	
	const handleFinalize = async () => {
		try {
			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			
			const docSnapshot = await getDoc(docRef);
			
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				const index = parseInt(id);
				if (!isNaN(index) && index >= 0 && index < data?.results?.length) {
					data.results[index].multiplication = displayValue;
					await updateDoc(docRef, data);
					navigate('/final-result')
				} else {
					console.error("Invalid index or values array is empty.");
				}
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.error("Error updating document:", error);
		}
	}
	

	const handleClear = () => {
		setDisplayValue("");
	};

	return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <button
                className=""
                onClick={() => navigate(`/`)}
                style={{
                    background: "#4E97F3",
                    color: "white",
                }}
            >
                {" "}
                Home Screen
            </button>
            <div
                style={{
                    height: "30%",
                }}
            >
                <div
                    className="flex"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#EDF0F9",
                        height: "50%",
                        padding: "0rem 1rem",
                        paddingTop: "0.5rem",
                    }}
                >
                    <div>
                        <p
                            style={{
                                margin: "0rem",
                            }}
                        >
                            Lot Number
                        </p>
                        <p className="border-2 border-black py-2 px-6 font-bold text-center">
                            {lotNumberValue ? lotNumberValue : "Lot Number"}
                        </p>
                    </div>
                    <div>
                        <p
                            style={{
                                margin: "0rem",
                            }}
                        >
                            Total Quantity
                        </p>
                        <p className="border-2 border-black py-2 px-6 font-bold text-center">
                            {quantityNumber ? quantityNumber : "Null"}
                        </p>
                    </div>

                    <div>
                        <p
                            style={{
                                margin: "0rem",
                            }}
                        >
                            Current Piece
                        </p>
                        <p className="border-2 border-black py-2 px-6 font-bold text-center">
                            {pieceNumber ? pieceNumber + 1 : 1}
                        </p>
                    </div>
                </div>
                <div
                    className="bg-[#EDF0F9] text-xl pl-5 px-4 flex justify-between items-center"
                    style={{
                        paddingBottom: "1rem",
                    }}
                >
                    
                    <NavLink to={"/view-records3"}>
                        <button className="check-view-button">View Records</button>
                    </NavLink>
                </div>

                <p
                    className="border-2 border-black text-xl px-4 py-2 text-center"
                    style={{
                        height: "27%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {displayValue || placeholderText}
                </p>
            </div>
            <div
                className="bottom-cal"
                style={{
                    height: "70%",
                }}
            >
                <div className="botton-top-cal-check">
                    <button className="side-button-rash" disabled >
                        {lastValue || "LV"}
                    </button>
                    <button className="side-button-rash" disabled >
                        {secondLastValue || "SV"}
                    </button>
                    <button className="side-button-rash" disabled >
                        {thirdLastValue || "TV"}
                    </button>
                    <button className="side-button" onClick={handleClear}>
                        AC
                    </button>
                </div>
                <div>
                    <button onClick={() => handleButtonClick("1")}>1</button>
                    <button onClick={() => handleButtonClick("2")}>2</button>
                    <button onClick={() => handleButtonClick("3")}>3</button>
                    <button
                        className="side-button"
                        style={{ fontSize: "3rem", fontWeight: "100 " }}
                        onClick={() => handleButtonClick("X")}
                    >
                        x
                    </button>
                </div>
                <div>
                    <button onClick={() => handleButtonClick("4")}>4</button>
                    <button onClick={() => handleButtonClick("5")}>5</button>
                    <button onClick={() => handleButtonClick("6")}>6</button>
                    <button
                        className="side-button"
                        style={{ fontSize: "1.3rem" }}
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
                <div>
                    <button onClick={() => handleButtonClick("7")}>7</button>
                    <button onClick={() => handleButtonClick("8")}>8</button>
                    <button onClick={() => handleButtonClick("9")}>9</button>
                    <button
                        className="side-button"
                        style={{ height: "100%", position: "relative" }}
                        onClick={handleFinalize}
                    >
                        Final
                    </button>

                </div>
                <div>
                    <button
                        onClick={() => handleButtonClick("0")}
                        style={{ width: "25%" }}
                    >
                        0
                    </button>
                    
                        
                        <button
                            onClick={() => handleButtonClick("-")}
                        >
                            -
                        </button>
                        <button
                            onClick={() => handleButtonClick(`"`)}
                        >
                            "
                        </button>
                        
                       
                <button onClick={handleCorrect}>&lt;</button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 w-full bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded mx-5">
                        <h2 className="text-xl mb-4">Piece Limit Exceeded</h2>
                        <p>
                            Current piece limit is maxed. Enter the number to increase the
                            quantity:
                        </p>
                        <input
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(e.target.value)}
                            placeholder="Enter Quantity "
                            className="border p-2 mt-2 border-black w-full rounded-lg"
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="mr-2 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button onClick={handleIncreaseQuantity} className="rounded">
                                Increase
                            </button>
                        </div>
                    </div>
                </div>
            )}
             {showMismatchModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                    <div
                        className="bg-white p-4 rounded"
                    >
                        <h2
                            className="text-lg font-bold"
                        >
                            Quantity Mismatch
                        </h2>
                        <p>
                            The piece number and quantity number do not match.
                        </p>
                        <div
                            className="flex justify-between mt-4"
                        >
                            <button
                                onClick={handleMismatchContinue}
                                className="border-2 border-black py-2 px-4 font-bold text-center"
                            >
                                Continue
                            </button>
                            <button
                                onClick={handleMismatchCancel}
                                className="border-2 border-black py-2 px-4 font-bold text-center"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditPage3Inch;
