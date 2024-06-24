import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDoc, arrayUnion, doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebase";
import "../style/cal.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaAngleLeft, FaHome } from "react-icons/fa";
import loader from "../assests/loader.png";
const Step3Inch = () => {
	const [displayValue, setDisplayValue] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [showMismatchModal, setShowMismatchModal] = useState(false);

	const [newQuantity, setNewQuantity] = useState("");
	const placeholderText = "Enter your size";

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
	const [measurementType, setMesurementType] = useState("");
	const [isMinusClicked, setIsMinusClicked] = useState(false);
	const [lengthUsed, setLengthUsed] = useState([]);
	const [breadthUsed, setBreadthUsed] = useState([]);
	const [filteredLengths, setFilteredLengths] = useState([]);
	const [filteredBreadth, setFilteredBreadth] = useState([]);

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
				setMesurementType(data?.measurementType || "");
				setValuesArray(data?.results || []);
				setPieceNumber((data?.results?.length || 0) - 1);
				setLastValue(data?.lastValue || "");
				setSecondLastValue(data?.secondLastValue || "");
				setThirdLastValue(data?.thirdLastValue || "");

				setLengthUsed(data?.length);
				setBreadthUsed(data?.breadth);
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
		if (value === ".") {
			setIsMinusClicked(true);
			setDisplayValue((prev) => prev + ".");
		} else if (value === "X") {
			if (!displayValue.includes("X")) {
				setDisplayValue((prev) => (prev === "" ? "" : prev + value));
			}
			setIsMinusClicked(false);
		} else {
			const newDisplayValue = displayValue + value;
			setDisplayValue(newDisplayValue);

			const newFilteredLengths = lengthUsed.filter(length => 
				length.toString().startsWith(newDisplayValue)
			);

			setFilteredLengths(newFilteredLengths);
			const newFilteredBreadths = breadthUsed.filter(breadth => 
				breadth.toString().startsWith(newDisplayValue)
			);
			setFilteredBreadth(newFilteredBreadths);
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
		if (!isValidInput(displayValue)) {
			alert("Invalid input format.");
			return;
		}

		if (pieceNumber + 1 < quantityNumber || quantityNumber === "") {
			const [firstNumber, secondNumber] = displayValue
				.split("X")
				.map((num) => parseFloat(num.trim()));

			const newLastValue = displayValue;
			const newSecondLastValue = lastValue;
			const newThirdLastValue = secondLastValue;

			const newResult = {
				multiplication: displayValue,
				measurement: measurementType,
				firstNumber: firstNumber,
				secondNumber: secondNumber,
			};

			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			try {
				await runTransaction(database, async (transaction) => {
					const docSnapshot = await transaction.get(docRef);
					if (!docSnapshot.exists()) {
						throw "Document does not exist!";
					}

					const currentResults = docSnapshot.data().results || [];
					const currentLengths = docSnapshot.data().length;
					const currentBreadths = docSnapshot.data().breadth;

					transaction.update(docRef, {
						results: [...currentResults, newResult],
						length: [...currentLengths, firstNumber],
						breadth: [...currentBreadths, secondNumber],
						lastValue: newLastValue,
						secondLastValue: newSecondLastValue,
						thirdLastValue: newThirdLastValue,
					});
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
		} else {
			setShowModal(true);
		}
	};
	const handleFinalize = async () => {
		if (!displayValue && quantityNumber !== pieceNumber) {
			setShowMismatchModal(true);
			return;
		}

		if (quantityNumber < pieceNumber + 2) {
			setShowModal(true);
		} else {
			if (displayValue) {
				if (!isValidInput(displayValue)) {
					alert("Invalid format");
					return;
				}

				const [firstNumber, secondNumber] = displayValue
					.split("X")
					.map((num) => parseFloat(num.trim()));

				const newLastValue = displayValue;
				const newSecondLastValue = lastValue;
				const newThirdLastValue = secondLastValue;

				const newResult = {
					multiplication: displayValue,
					measurement: measurementType,
					firstNumber: firstNumber,
					secondNumber: secondNumber,
				};

				const docRef = doc(database, "Data", "lot: " + lotNumberValue);
				try {
					await runTransaction(database, async (transaction) => {
						const docSnapshot = await transaction.get(docRef);
						if (!docSnapshot.exists()) {
							throw "Document does not exist!";
						}

						const currentResults = docSnapshot.data().results || [];
						const currentLengths = docSnapshot.data()?.length || [];
						const currentBreadths = docSnapshot.data()?.breadth || [];

						transaction.update(docRef, {
							results: [...currentResults, newResult],
							length: [...currentLengths, firstNumber],
							breadth: [...currentBreadths, secondNumber],
							lastValue: newLastValue,
							secondLastValue: newSecondLastValue,
							thirdLastValue: newThirdLastValue,
						});
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
		}
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

		setDisplayValue(lastValue)
		setIsMinusClicked(false);
	};

	const handleSecondLastValue = () => {

		setDisplayValue(secondLastValue)
		setIsMinusClicked(false);
	};
	
	const handleThirdLastValue = () => {
		setDisplayValue(thirdLastValue)
		setIsMinusClicked(false);
		
	};

    if (loading) {
        return <div className="flex items-center justify-center h-screen animate-spin">
            <img src={loader} alt="Loading..." className="w-40 h-40" />
        </div>;
    }

	return (
		<div className="bg-gray-900 min-h-screen text-white">
         <div style={{
                width:"100%",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                paddingTop:"1rem"
            }}>
			<div className=" w-12 ml-2 rounded-md p-2 bg-blue-600">
				<NavLink to={"/"} className="text-white">
					<FaHome size={30} />
				</NavLink>
			</div>
			
            </div>
			<div className=" my-2 p-2 flex justify-between ">
				<div className="text-center px-3 border-2  rounded-md border-white" style={{
                    width:"30%"
                }}>
					Lot <br /> {lotNumberValue ? lotNumberValue : "Lot Number"}
				</div>
				<div className="px-2 mx-2 text-center border-2 rounded-md  border-white" style={{
                    width:"30%"
                }}>
					Quantity <br /> {quantityNumber ? quantityNumber : "N/A"}
				</div>
				<div className="text-center px-3 border-2 rounded-md  border-white" style={{
                    width:"30%"
                }}>
					Number <br /> {pieceNumber ? pieceNumber + 1 : 1}
				</div>
			</div>
			<div className=" px-2 my-4 flex justify-center">
				<NavLink to={"/view-records3"}>
					<button className="text-white px-3 py-1 bg-blue-600 rounded-md font-bold tracking-wider">
						View Records
					</button>
				</NavLink>
				{/* <p className="text-white px-3 text-lg py-1 uppercase font-bold">TYPE: {measurementType}</p>			 */}
			</div>
			<div className="text-lg flex justify-between mx-3">
				<div className="border-2 border-white px-3 py-1 rounded-md font-semibold">
					{" "}
					{filteredLengths.length > 0 ? (
                        <div className="filtered-lengths">
                            {filteredLengths.map((length, index) => (
                                <button key={index} onClick={() => setDisplayValue(length.toString())}>
                                    {length}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <button className="mfu-button">MFU</button>
                    )}
				</div>
				<div className="border-2 border-white px-3 py-1 rounded-md font-semibold">
					{" "}
					{filteredBreadth.length > 0 ? (
                        <div className="filtered-lengths">
                            {filteredBreadth.map((length, index) => (
                                <button key={index} onClick={() => setDisplayValue(length.toString())}>
                                    {length}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <button className="mfu-button">MFU</button>
                    )}
				</div>
			</div>
			<div className=" rounded-md my-3 mx-1 h-32 text-4xl uppercase text-end flex justify-center items-center pr-3">
				{displayValue || placeholderText}
			</div>
			<div className="grid grid-cols-4  ">
				<div className="border-2 border-white h-16 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center">
					<button onClick={handleLastValue}>{lastValue || "LV"}</button>
				</div>
				<div className="border-2 border-white h-16 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center">
					<button onClick={handleSecondLastValue}>
						{" "}
						{secondLastValue || "SV"}
					</button>
				</div>
				<div className="border-2 border-white h-16 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center">
					<button onClick={handleThirdLastValue}>
						{" "}
						{thirdLastValue || "TV"}
					</button>
				</div>
				<div onClick={handleClear} className="border-2 border-white bg-blue-500 h-16 rounded-md mx-2 my-2 flex items-center justify-center">
					<button  > AC</button>
				</div>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("1")} className={`border-2 border-white h-16 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 1</button>
				</button>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("2")} className={`border-2 border-white h-16 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 2</button>
				</button>
				<div  onClick={() => handleButtonClick("3")} className="border-2 border-white h-16 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 3</button>
				</div>
				<div  onClick={() => handleButtonClick("X")} className="border-2 border-white h-16 rounded-md   bg-blue-500 mx-2 my-2 flex items-center justify-center">
					<button> X</button>
				</div>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("4")} className={`border-2 border-white h-16 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 4</button>
				</button>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("5")} className={`border-2 border-white h-16 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 5</button>
				</button>
				<div  onClick={() => handleButtonClick("6")} className="border-2 border-white h-16 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 6</button>
				</div>
				<div onClick={handleCorrect} className="border-2 border-white h-16 bg-blue-500 rounded-md mx-2 my-2 flex items-center justify-center">
					<button >
						<FaAngleLeft />
					</button>
				</div>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("7")} className={`border-2 border-white h-16 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 7</button>
				</button>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("8")} className={`border-2 border-white h-16 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 8</button>
				</button>
				<div  onClick={() => handleButtonClick("9")} className="border-2 border-white h-16 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 9</button>
				</div>
				<div onClick={handleNext} className="border-2 border-white h-16 rounded-md bg-blue-500 mx-2 my-2 flex items-center justify-center">
					<button > NEXT</button>
				</div>
				<div  onClick={() => handleButtonClick("0")} className="border-2 border-white h-16 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 0</button>
				</div>

				<button disabled={isMinusClicked} onClick={() => handleButtonClick(".")} className={`border-2 col-span-2 border-white h-16 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button >.</button>
				</button>

				<div onClick={handleFinalize} className="border-2  border-white h-16 rounded-md bg-blue-500 mx-2 my-2 flex items-center justify-center">
					<button > FINAL</button>
				</div>
			</div>
			{showModal && (
				<div className="fixed text-black  inset-0 bg-gray-600 w-full bg-opacity-50 flex justify-center items-center">
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
					<div className="bg-white text-black p-4 rounded">
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
