import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDoc, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebase";
import "../style/cal.css";
import { NavLink, useNavigate } from "react-router-dom";
import loader from "../assets/images/loader.png";

const Step3Inch = () => {
	const [displayValue, setDisplayValue] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [showMismatchModal, setShowMismatchModal] = useState(false);

	const [newQuantity, setNewQuantity] = useState("");
	const placeholderText = "Enter your values";

	const lotNumberValue = useSelector((state) => state.lotReducer.lotNumber);
	const [vehicleNumber, setVehicleNumber] = useState("");
	const [clientName, setClientName] = useState("");
	const [quantityNumber, setQuantityNumber] = useState("");
	const [pieceNumber, setPieceNumber] = useState(0);
	const [lastValue, setLastValue] = useState("");
	const [secondLastValue, setSecondLastValue] = useState("");
	const [thirdLastValue, setThirdLastValue] = useState("");
	const [valuesArray, setValuesArray] = useState([]);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState();
	const [measurementType, setMesurementType] = useState("mm");
	const [isMinusClicked, setIsMinusClicked] = useState(false);

	const navigate = useNavigate();

	const getDocument = async () => {
		try {
			const docSnapshot = await getDoc(
				doc(database, "Data", "lot: " + lotNumberValue)
			);
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				console.log(data);
				setClientName(data?.clientName || "");
				setVehicleNumber(data?.vehicleNumber || "");
				setQuantityNumber(data?.quantityNumber || "");
				setValuesArray(data?.results || []);
				setPieceNumber((data?.results?.length || 0) - 1);
				setLastValue(data?.lastValue || "");
				setSecondLastValue(data?.secondLastValue || "");
				setThirdLastValue(data?.thirdLastValue || "");
				console.log(quantityNumber, clientName, vehicleNumber);
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
		if (lotNumberValue) {
			getDocument();
		}
	}, [lotNumberValue]);

	const handleButtonClick = (value) => {
		if (value === "-") {
			setIsMinusClicked(true);
			setDisplayValue((prev) => prev + "'-");
		} else if (value === "X") {
			if (!displayValue.includes("X")) {
				setDisplayValue((prev) => (prev === "" ? "" : prev + value));
			}
			setIsMinusClicked(false);
		} else {
			setDisplayValue((prev) => prev + value);
		}
	};

	const handleCorrect = () => {
		setDisplayValue((prev) => prev.slice(0, -1));
	};
	const isValidInput = (input) => {
		const pattern = /.+X.+/;
		return pattern.test(input);
	};

	const handleNext = async () => {
		if (displayValue && !isValidInput(displayValue)) {
			alert("Invalid format");
			return;
		}
		if (pieceNumber + 1 < quantityNumber || quantityNumber === "") {
			const newLastValue = displayValue;
			const newSecondLastValue = lastValue;
			const newThirdLastValue = secondLastValue;

			const newResult = {
				multiplication: displayValue,
				measurement: measurementType,
			};

			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			try {
				await updateDoc(docRef, {
					results: arrayUnion(newResult),
					inch: "1 Inch Measurements Data",
					lastValue: newLastValue,
					secondLastValue: newSecondLastValue,
					thirdLastValue: newThirdLastValue,
				});
				console.log("Result added to Firestore array");
			} catch (error) {
				console.error("Error updating document:", error);
			}
			setLastValue(newLastValue);
			setSecondLastValue(newSecondLastValue);
			setThirdLastValue(newThirdLastValue);
			setPieceNumber(pieceNumber + 1);
			setDisplayValue("");
			setIsMinusClicked(false);
		} else {
			setShowModal(true);
		}
	};

	const handleFinalize = async () => {
		if (displayValue) {
			if (!isValidInput(displayValue)) {
				alert("Invalid format");
				return;
			}
		}

		if (quantityNumber !== "" && pieceNumber !== Number(quantityNumber)) {
			setShowMismatchModal(true);
			return;
		}

		if (displayValue) {
			const newLastValue = displayValue;
			const newSecondLastValue = lastValue;
			const newThirdLastValue = secondLastValue;

			const newResult = {
				multiplication: displayValue,
				measurement: measurementType,
			};

			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			try {
				await updateDoc(docRef, {
					results: arrayUnion(newResult),
					lastValue: newLastValue,
					inch: "1Inch",
					secondLastValue: newSecondLastValue,
					thirdLastValue: newThirdLastValue,
				});
				console.log("Result added to Firestore array");
			} catch (error) {
				console.error("Error updating document:", error);
			}
			setLastValue(newLastValue);
			setSecondLastValue(newSecondLastValue);
			setThirdLastValue(newThirdLastValue);
			setPieceNumber(pieceNumber + 1);
		}

		setDisplayValue("");
		navigate("/final-result3");
	};

	const handleMismatchContinue = () => {
		setShowMismatchModal(false);
		navigate("/final-result3");
	};

	const handleMismatchCancel = () => {
		setShowMismatchModal(false);
	};

	const handleClear = () => {
		setIsMinusClicked(false);
		setDisplayValue("");
	};

	const handleIncreaseQuantity = async () => {
		const newQty = parseInt(newQuantity, 10);
		if (!isNaN(newQty) && newQty > 0) {
			const updatedQuantity = Number(quantityNumber) + newQty;
			setQuantityNumber(updatedQuantity);
			const quantityRef = doc(database, "Data", "lot: " + lotNumberValue);
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

	const updateFirestoreWithResult = async (newResult) => {
		const docRef = doc(database, "Data", "lot: " + lotNumberValue);
		try {
			await updateDoc(docRef, {
				results: arrayUnion(newResult),
				lastValue,
				secondLastValue,
				thirdLastValue,
			});
			console.log("Result added to Firestore array");
		} catch (error) {
			console.error("Error updating document:", error);
		}
	};

	const updateLastData = (value) => {
		if (pieceNumber + 1 < quantityNumber || quantityNumber === "") {
			const newResult = {
				multiplication: value,
				measurement: "1 Inch Measurements Data",
			};
			updateFirestoreWithResult(newResult);
			setLastValue(value);
			setSecondLastValue(lastValue);
			setThirdLastValue(secondLastValue);
			setPieceNumber(pieceNumber + 1);
			setDisplayValue("");
		} else {
			setShowModal(true);
		}
	};

	const handleLastValue = () => {
		updateLastData(lastValue);
		setIsMinusClicked(false);
	};

	const handleSecondLastValue = () => {
		updateLastData(secondLastValue);
		setIsMinusClicked(false);
	};

	const handleThirdLastValue = () => {
		updateLastData(thirdLastValue);
		setIsMinusClicked(false);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen animate-spin">
				<img src={loader} alt="Loading..." className="w-40 h-40" />
			</div>
		);
	}

	return (
		<div
			style={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
			}}>
			<button
				className=""
				onClick={() => navigate(`/`)}
				style={{
					background: "#4E97F3",
					color: "white",
				}}>
				{" "}
				Home Screen
			</button>
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
				<div
					className="bg-[#EDF0F9] text-xl pl-5 px-4 flex justify-between items-center"
					style={{
						paddingBottom: "1rem",
					}}>
					{/* <select
                        name="measurement"
                        id="measurement"
                        value={measurementType}
                        onChange={(e) => setMesurementType(e.target.value)}
                        className="bg-[#edf0f9] outline-none border-2 border-black mb-3"
                    >
                        <option value="mm">MM</option>
                        <option value="cm">CM</option>
                        <option value="meter">METER</option>
                        <option value="inches">INCHES</option>
                        <option value="feet">FEET</option>
                    </select> */}
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
					<button
						onClick={() => handleButtonClick("1")}
						disabled={isMinusClicked}
						style={{ backgroundColor: !isMinusClicked ? "#ccc" : "#fff" }}>
						1
					</button>
					<button
						onClick={() => handleButtonClick("2")}
						disabled={isMinusClicked}
						style={{ backgroundColor: !isMinusClicked ? "#ccc" : "#fff" }}>
						2
					</button>
					<button
						onClick={() => handleButtonClick("3")}
						style={{ backgroundColor: "#ccc" }}>
						3
					</button>
					<button
						className="side-button"
						style={{ fontSize: "3rem", fontWeight: "100 " }}
						onClick={() => handleButtonClick("X")}>
						x
					</button>
				</div>
				<div>
					<button
						onClick={() => handleButtonClick("4")}
						disabled={isMinusClicked}
						style={{ backgroundColor: !isMinusClicked ? "#ccc" : "#fff" }}>
						4
					</button>
					<button
						onClick={() => handleButtonClick("5")}
						disabled={isMinusClicked}
						style={{ backgroundColor: !isMinusClicked ? "#ccc" : "#fff" }}>
						5
					</button>
					<button
						onClick={() => handleButtonClick("6")}
						style={{ backgroundColor: "#ccc" }}>
						6
					</button>
					<button
						className="side-button"
						style={{ fontSize: "1.3rem" }}
						onClick={handleNext}>
						Next
					</button>
				</div>
				<div>
					<button
						onClick={() => handleButtonClick("7")}
						disabled={isMinusClicked}
						style={{ backgroundColor: !isMinusClicked ? "#ccc" : "#fff" }}>
						7
					</button>
					<button
						onClick={() => handleButtonClick("8")}
						disabled={isMinusClicked}
						style={{ backgroundColor: !isMinusClicked ? "#ccc" : "#fff" }}>
						8
					</button>
					<button
						onClick={() => handleButtonClick("9")}
						style={{ backgroundColor: "#ccc" }}>
						9
					</button>
					<button
						className="side-button"
						style={{ height: "100%", position: "relative" }}
						onClick={handleFinalize}>
						Final
					</button>
				</div>
				<div>
					<button
						onClick={() => handleButtonClick("0")}
						style={{ width: "25%", backgroundColor: "#ccc" }}>
						0
					</button>

					<button
						onClick={() => handleButtonClick("-")}
						style={{ backgroundColor: !isMinusClicked ? "#ccc" : "#fff" }}
						disabled={isMinusClicked}>
						-
					</button>
					<button
						onClick={() => handleButtonClick(`"`)}
						style={{ backgroundColor: "#ccc" }}
						disabled={!isMinusClicked}>
						"
					</button>

					<button onClick={handleCorrect} style={{ backgroundColor: "#ccc" }}>
						&lt;
					</button>
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
			{showMismatchModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-4 rounded">
						<h2 className="text-lg font-bold">Quantity Mismatch</h2>
						<p>The piece number and quantity number do not match.</p>
						<div className="flex justify-between mt-4">
							<button
								onClick={handleMismatchContinue}
								className="border-2 border-black py-2 px-4 font-bold text-center">
								Continue
							</button>
							<button
								onClick={handleMismatchCancel}
								className="border-2 border-black py-2 px-4 font-bold text-center">
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Step3Inch;
