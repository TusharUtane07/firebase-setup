import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDoc, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebase";
import "../style/cal.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FaAngleLeft, FaHome } from "react-icons/fa";

const EditPage3Inch = () => {
	const [displayValue, setDisplayValue] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [newQuantity, setNewQuantity] = useState("");
	const placeholderText = "Enter your size";
    const [oldValue, setOldvalue] = useState("")

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

	const [isMinusClicked, setIsMinusClicked] = useState(false);
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
				setQuantityNumber(docSnapshot?.data()?.['Quantity Number']);
				setValuesArray(docSnapshot?.data()?.results);
				const index = parseInt(id);
		if (!isNaN(index) && index >= 0 && index < docSnapshot?.data()?.results?.length) {
			const valueToSave = docSnapshot?.data()?.results[index];
			setDisplayValue(valueToSave?.multiplication);
			setOldvalue(valueToSave?.multiplication)

		} else {
			console.error("Invalid index or values array is empty.");
		}
			} else {
				return null;
			}
		} catch (error) {
			console.error("Error getting document:", error);
			throw error;
		}
	};


	const parseValue = (value) => {
		// Replace "'" with ".", "-" with "."
		value = value?.replace(/'/g, ".")?.replace(/"/g, "");

		// If value contains "-", treat it as decimal point
		if (value?.includes("-")) {
			// Replace "-" with "." to convert it into decimal
			value = value?.replace("-", ".");
		}

		// Parse value into float
		return parseFloat(value);
	};
	useEffect(() => {
		getDocument();
	}, [lotNumberValue]);

    const handleButtonClick = (value) => {
		if (value === ".") {
			setIsMinusClicked(true);
			setDisplayValue((prev) => prev + ".");
		} else if (value === "X") {
			if (!displayValue.includes("X")) {
				setIsMinusClicked(false);
				setDisplayValue((prev) => (prev === "" ? "" : prev + value));
			}
		} else {
			setDisplayValue((prev) => prev + value);
		}
	};

	const handleCorrect = () => {
		let lastCharacter = displayValue.slice(-1);
		if(lastCharacter == "."){
			setIsMinusClicked(false)
		}
		setDisplayValue((prev) => prev.slice(0, -1));
	};

    
    const isValidInput = (input) => {
        const pattern = /.+X.+/;
        return pattern.test(input);
    }

	const handleNext = async () => {
		if (!isValidInput(displayValue)) {
            alert("Invalid format");
            return;
        }
		if(oldValue != displayValue){
			let oldSqft = localStorage.getItem("sqft")
			const num1 = parseValue(oldValue.split("X")[0]);
			const num2 = parseValue(oldValue.split("X")[1]);
			const newnum1 = parseValue(displayValue.split("X")[0]);
			const newnum2 = parseValue(displayValue.split("X")[1]);

			let sqfttoDelete = ((parseFloat(num1) * parseFloat(num2))/144).toFixed(2);
			let sqfttoAdd = ((parseFloat(newnum1) * parseFloat(newnum2))/144).toFixed(2);

			let newToAddSqft = parseFloat(oldSqft - sqfttoDelete).toFixed(2);

			newToAddSqft = parseFloat(newToAddSqft) + parseFloat(sqfttoAdd)
			localStorage.setItem("sqft", newToAddSqft)


		}
      
		try {
			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			
			const docSnapshot = await getDoc(docRef);
			
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				const index = parseInt(id);
				if (!isNaN(index) && index >= 0 && index < data?.results?.length) {
					data.results[index].multiplication = displayValue;
					await updateDoc(docRef, data);
					navigate('/view-records3')
				} else {
					console.error("Invalid index or values array is empty.");
				}
			} else {
			}
		} catch (error) {
			console.error("Error updating document:", error);
		}
	};
	
	const handleFinalize = async () => {
        if (displayValue) {
			if (!isValidInput(displayValue)) {
				alert("Invalid format");
				return;
			}
		}
		try {
			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			
			const docSnapshot = await getDoc(docRef);
			
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				const index = parseInt(id);
				if (!isNaN(index) && index >= 0 && index < data?.results?.length) {
					data.results[index].multiplication = displayValue;
					await updateDoc(docRef, data);
					navigate('/final-result3')
				} else {
					console.error("Invalid index or values array is empty.");
				}
			} else {
			}
		} catch (error) {
			console.error("Error updating document:", error);
		}
	}
	

	const handleClear = () => {
		setIsMinusClicked(false);
		setDisplayValue("");
	};


	return (
		<div className="bg-gray-900 overflow-scroll h-screen text-white">
	<div
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-around",
					paddingTop: "1rem",
				}} >
				
				<div  onClick={()=>{
							navigate("/view-records3")
				}}>
					<button className="text-white px-3 py-1 bg-blue-600 rounded-md font-bold tracking-wider">
						View Records
					</button>
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
		
			<div className=" rounded-md my-3 mx-1 h-28 text-4xl uppercase text-end flex justify-center items-center pr-3">
			{displayValue?.includes("X") ? <><span style={{
					color:"red"
				}}> {displayValue.split("X")[0]}</span> <>&nbsp; X &nbsp;</> <span style={{
					color:"green"
				}}>{displayValue.split("X")[1]}</span> </> : <span style={{
					color:"red"
				}}> {displayValue}</span> ||  placeholderText}			</div>
			<div className="grid grid-cols-4  fixed bottom-20 w-full">
			
				<button disabled={isMinusClicked}  onClick={() => handleButtonClick("1")} className={`border-2 border-white h-14 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 1</button>
				</button>
				<button disabled={isMinusClicked}  onClick={() => handleButtonClick("2")} className={`border-2 border-white h-14 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 2</button>
				</button>
				<div  onClick={() => handleButtonClick("3")} className="border-2 border-white h-14 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 3</button>
				</div>
				<div onClick={handleClear} className="border-2 border-white bg-blue-500 h-14 rounded-md mx-2 my-2 flex items-center justify-center">
					<button  > AC</button>
				</div>
				<button disabled={isMinusClicked}  onClick={() => handleButtonClick("4")} className={`border-2 border-white h-14 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 4</button>
				</button>
				<button disabled={isMinusClicked}  onClick={() => handleButtonClick("5")} className={`border-2 border-white h-14 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 5</button>
				</button>
				<div  onClick={() => handleButtonClick("6")} className="border-2 border-white h-14 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 6</button>
				</div>
				<div  onClick={() => handleButtonClick("X")} className="border-2 border-white h-14 rounded-md   bg-blue-500 mx-2 my-2 flex items-center justify-center">
					<button> X</button>
				</div>
				<button disabled={isMinusClicked}  onClick={() => handleButtonClick("7")} className={`border-2 border-white h-14 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 7</button>
				</button>
				<button disabled={isMinusClicked}  onClick={() => handleButtonClick("8")} className={`border-2 border-white h-14 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 8</button>
				</button>
				<div  onClick={() => handleButtonClick("9")} className="border-2 border-white h-14 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 9</button>
				</div>
				<div onClick={handleCorrect} className="border-2 border-white h-14 bg-blue-500 rounded-md mx-2 my-2 flex items-center justify-center">
					<button >
						<FaAngleLeft />
					</button>
				</div>
				<div  onClick={() => handleButtonClick("0")} className="border-2 border-white h-14 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 0</button>
				</div>

				<button disabled={isMinusClicked}  onClick={() => handleButtonClick(".")} className={`border-2 col-span-2 border-white h-14 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button >.</button>
				</button>
				

				<div onClick={handleNext} className="border-2 border-white h-14 rounded-md bg-blue-500 mx-2 my-2 flex items-center justify-center">
					<button > NEXT</button>
				</div>
			</div>
			{showModal && (
				<div className="fixed text-gray-200  inset-0 bg-gray-600 w-full bg-opacity-50 flex justify-center items-center">
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
							className="border p-2 mt-2 border-gray2text-gray-200 w-full rounded-lg"
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
				<div className="fixed inset-0 m-5 bg-gray-900 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white text-gray-200 p-4 rounded">
						<h2 className="text-lg font-bold">Quantity Mismatch</h2>
						<p>The piece number and quantity number do not match.</p>
						<div className="flex justify-between mt-4">
							<button
								onClick={handleMismatchContinue}
								className="border-2 border-gray2text-gray-200 py-2 px-4 font-bold text-center">
								Continue
							</button>
							<button
								onClick={handleMismatchCancel}
								className="border-2 border-gray2text-gray-200 py-2 px-4 font-bold text-center">
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
