import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDoc, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebase";
import "../style/cal.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const EditPage1Inch = () => {
	const [displayValue, setDisplayValue] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [newQuantity, setNewQuantity] = useState("");
	const placeholderText = "Enter your values";

	const lotNumberValue = useSelector((state) => state.lotReducer.lotNumber);
	const [vehicleNumber, setVehicleNumber] = useState("");

	const [clientName, setClientName] = useState("");
	const [messasurement, setMessasurement] = useState("");
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
			}}>
			<div
				style={{
					height: "30%",
				}}>
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
					}}>
					<div>
						<p
							style={{
								margin: "0rem",
							}}>
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
							}}>
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
							}}>
							Current Piece
						</p>
						<p className="border-2 border-black py-2 px-6 font-bold text-center">
							{pieceNumber ? pieceNumber + 1 : 1}
						</p>
					</div>
				</div>
				<div className="bg-[#EDF0F9] text-xl pl-5 px-4 flex justify-between items-center">
					<select
						name="measurement"
						id="measurement"
						className="bg-[#edf0f9] outline-none border-2 border-black mb-3">
						<option value="mm">MM</option>
						<option value="cm">CM</option>
						<option value="meter">METER</option>
						<option value="inches">INCHES</option>
						<option value="feet">FEET</option>
					</select>
					<NavLink to={"/view-records"}>
						<button className="text-black">View</button>
					</NavLink>
				</div>

				<p
					className="border-2 border-black text-xl px-4 py-2 text-center"
					style={{
						height: "50%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}>
					{displayValue || placeholderText}
				</p>
			</div>
			<div
				className="bottom-cal"
				style={{
					height: "70%",
				}}>
				<div className="botton-top-cal-check">
					<button className="side-button-rash">{lastValue || "LV"}</button>
					<button className="side-button-rash">
						{secondLastValue || "SV"}
					</button>
					<button className="side-button-rash">{thirdLastValue || "TV"}</button>
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
						onClick={() => handleButtonClick("X")}>
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
						onClick={handleNext}>
						Next
					</button>
				</div>
				<div>
					<button onClick={() => handleButtonClick("7")}>7</button>
					<button onClick={() => handleButtonClick("8")}>8</button>
					<button onClick={() => handleButtonClick("9")}>9</button>
					<button
						className="side-button"
						style={{ height: "200%", position: "relative" }}
						onClick={handleFinalize}>
						Final
					</button>
				</div>
				<div>
					<button
						onClick={() => handleButtonClick("0")}
						style={{
							width: "50%",
						}}>
						0
					</button>
					<button onClick={handleCorrect}>&lt;</button>
				</div>
			</div>
		</div>
	);
};

export default EditPage1Inch;
