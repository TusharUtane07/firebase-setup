import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDoc, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebase";
import "../style/cal.css";
import { NavLink } from "react-router-dom";

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

	const getDocument = async () => {
		try {
			const docSnapshot = await getDoc(
				doc(database, "Data", "lot number: " + lotNumberValue)
			);
			if (docSnapshot.exists()) {
				setClientName(docSnapshot?.data()?.clientName);
				setVehicleNumber(docSnapshot?.data()?.vehicleNumber);
				setQuantityNumber(docSnapshot?.data()?.quantityNumber);
				setValuesArray(docSnapshot?.data()?.results);
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
		if (pieceNumber + 1 < quantityNumber) {
			const parts = displayValue.split("X").map((part) => part.trim());
			if (parts.length === 2) {
				const firstNumber = parseFloat(parts[0]);
				const secondNumber = parseFloat(parts[1]);
				const docSnap = await getDoc(
					doc(database, "Data", "lot number: " + lotNumberValue)
				);
				const data = docSnap.data();
				const currentResults = data.results || [];
				currentResults.push({
					firstNumber: firstNumber,
					secondNumber: secondNumber,
					multiplication: `${firstNumber}X${secondNumber}`,
					measurement: messasurement,
				});
				setLastValue(`${firstNumber}X${secondNumber}`);
				setSecondLastValue(lastValue);
				setThirdLastValue(secondLastValue);
				if (!isNaN(firstNumber) && !isNaN(secondNumber)) {
					const result = (firstNumber * secondNumber) / 144;

					const docRef = doc(database, "Data", "lot number: " + lotNumberValue);
					try {
						await updateDoc(docRef, {
							results: currentResults,
						});
						console.log("Result added to Firestore array");
					} catch (error) {
						console.error("Error updating document:", error);
					}
					setPieceNumber(pieceNumber + 1);
					getDocument();

					setDisplayValue("");
				} else {
					console.log("Invalid numbers entered.");
					setDisplayValue("");
				}
			} else {
				console.log("Please enter values in the format 'number X number'.");
				setDisplayValue("");
			}
		} else {
			setShowModal(true);
		}
	};
	const handleFinalize = async () => {
		if (true) {
			const parts = displayValue.split("X").map((part) => part.trim());
			if (parts.length === 2) {
				const firstNumber = parseFloat(parts[0]);
				const secondNumber = parseFloat(parts[1]);
				const docSnap = await getDoc(
					doc(database, "Data", "lot number: " + lotNumberValue)
				);
				const data = docSnap.data();
				const currentResults = data.results || [];
				currentResults.push({
					firstNumber: firstNumber,
					secondNumber: secondNumber,
					multiplication: `${firstNumber}X${secondNumber}`,
					measurement: messasurement,
				});

				if (!isNaN(firstNumber) && !isNaN(secondNumber)) {
					const result = (firstNumber * secondNumber) / 144;

					const docRef = doc(database, "Data", "lot number: " + lotNumberValue);
					try {
						await updateDoc(docRef, {
							results: currentResults,
						});
						console.log("Result added to Firestore array");
					} catch (error) {
						console.error("Error updating document:", error);
					}
					setPieceNumber(pieceNumber + 1);
					getDocument();

					setDisplayValue("");
				} else {
					console.log("Invalid numbers entered.");
					setDisplayValue("");
				}
			} else {
				console.log("Please enter values in the format 'number X number'.");
				setDisplayValue("");
			}
		}
		alert(`Finalized value: ${displayValue}`);
	};

	const handleClear = () => {
		setDisplayValue("");
	};

	const handleIncreaseQuantity = async () => {
		const newQty = parseInt(newQuantity, 10);
		if (!isNaN(newQty) && newQty > 0) {
			const updatedQuantity = Number(quantityNumber) + newQty;
			setQuantityNumber(updatedQuantity);
			const quantityRef = doc(
				database,
				"Data",
				"lot number: " + lotNumberValue
			);
			try {
				await updateDoc(quantityRef, {
					quantityNumber: updatedQuantity,
				});
				console.log("Quantity updated successfully");
				setShowModal(false);
				setNewQuantity("");
			} catch (err) {
				console.error("Error updating document:", err.message);
			}
		} else {
			alert("Please enter a valid number.");
		}
	};

	const handleLastValue = () => {
		setDisplayValue(lastValue);
	};

	const handleSecondLastValue = () => {
		setDisplayValue(secondLastValue);
	};

	const handleThirdLastValue = () => {
		setDisplayValue(thirdLastValue);
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
					<select name="measurement" id="measurement" className="bg-[#edf0f9] outline-none border-2 border-black mb-3">
						<option value="mm">MM</option>
						<option value="cm">CM</option>
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
					<button className="side-button-rash" onClick={handleLastValue}>
						{lastValue || "LV"}
					</button>
					<button className="side-button-rash" onClick={handleSecondLastValue}>
						{secondLastValue || "SV"}
					</button>
					<button className="side-button-rash" onClick={handleThirdLastValue}>
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
						onClick={handleFinalize}>
						Final
					</button>
				</div>
				<div>
					<button onClick={() => handleButtonClick("7")}>7</button>
					<button onClick={() => handleButtonClick("8")}>8</button>
					<button onClick={() => handleButtonClick("9")}>9</button>
					<button
						className="side-button"
						style={{ height: "200%", position: "relative" }}
						onClick={handleNext}>
						Save
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
								className="mr-2 px-4 py-2 rounded">
								Cancel
							</button>
							<button onClick={handleIncreaseQuantity} className="rounded">
								Increase
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default EditPage1Inch;
