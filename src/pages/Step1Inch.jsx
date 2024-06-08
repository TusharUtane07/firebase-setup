import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDoc, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebase";

const Step1Inch = () => {
	const [displayValue, setDisplayValue] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [newQuantity, setNewQuantity] = useState("");
	const placeholderText = "Enter your values";

	const lotNumberValue = useSelector((state) => state.lotReducer.lotNumber);

	const [clientName, setClientName] = useState("");
	const [vehicleNumber, setVehicleNumber] = useState("");
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
				setValuesArray(docSnapshot?.data()?.results)
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
    setDisplayValue((prev) => (prev === '' ? value : prev + value));
  }

  const handleCorrect = () => {
    setDisplayValue((prev) => prev.slice(0, -1));
  };
  

	const handleNext = async () => {
		if (pieceNumber < quantityNumber) {
			const parts = displayValue.split("X").map((part) => part.trim());
			if (parts.length === 2) {
				const firstNumber = parseFloat(parts[0]);
				const secondNumber = parseFloat(parts[1]);
				if (!isNaN(firstNumber) && !isNaN(secondNumber)) {
					const result = (firstNumber * secondNumber) / 144;
          
					const docRef = doc(database, "Data", "lot number: " + lotNumberValue);
					try {
						await updateDoc(docRef, {
							results: arrayUnion(`${firstNumber}X${secondNumber}`), 
						});
						console.log("Result added to Firestore array");
					} catch (error) {
						console.error("Error updating document:", error);
					}
					setPieceNumber(pieceNumber + 1);
          getDocument();
          if (valuesArray && valuesArray.length >= 3) {
            const lastIndex = valuesArray.length - 1;
            const secondLastIndex = valuesArray.length - 2;
            const thirdLastIndex = valuesArray.length - 3;
          
            setLastValue(valuesArray[lastIndex]);
            setSecondLastValue(valuesArray[secondLastIndex]);
            setThirdLastValue(valuesArray[thirdLastIndex]);
          }
          
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
	const handleFinalize = () => {
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
		<div className="mx-5 mt-20">
			<div className="flex justify-between">
				<p className="border-2 border-black py-2 px-6 font-bold">
					{lotNumberValue ? lotNumberValue : "Lot Number"}
				</p>
				<p className="border-2 border-black py-2 px-6 font-bold">
					{quantityNumber ? quantityNumber : "Quality Name"}
				</p>
			</div>
			<div className="mt-6">
				<p className="border-2 border-black text-4xl px-4 py-2 text-center">
					{displayValue || placeholderText}
				</p>
			</div>
			<div className="mt-6 flex justify-between">
				<button
					className="font-bold text-xl"
					onClick={() => handleButtonClick("X")}>
					X
				</button>
				<button className="font-bold text-xl">{pieceNumber}</button>
			</div>
			<div className="mt-6 flex justify-evenly gap-3">
				<div className="mt-6 flex justify-evenly gap-3">
					<button onClick={handleLastValue}>Last Value Typed</button>
					<button onClick={handleSecondLastValue}>Second Last Typed</button>
					<button onClick={handleThirdLastValue}>Third Last Typed</button>
				</div>
			</div>
			<div className="mt-10 grid grid-cols-3 mx-6 gap-x-5 gap-y-4">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
					<button
						key={number}
						onClick={() => handleButtonClick(number.toString())}>
						{number}
					</button>
				))}
			</div>
			<div className="mt-6 flex justify-evenly">
				<button className="px-6" onClick={handleCorrect}>
					Correct
				</button>
				<button className="px-10" onClick={() => handleButtonClick("0")}>
					0
				</button>
				<button className="px-6" onClick={handleNext}>
					Next
				</button>
			</div>
			<div className="mt-6 text-xl text-center flex justify-evenly">
				<button onClick={handleClear}>Clear</button>
				<button onClick={handleFinalize}>Finalize</button>
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

export default Step1Inch;
