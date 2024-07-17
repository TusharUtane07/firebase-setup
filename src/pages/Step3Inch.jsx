import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDoc, arrayUnion, doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebase";
import "../style/cal.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import loader from "../assests/loader.png";
import { FaAngleLeft, FaHome, FaLandmark } from "react-icons/fa";

const Step3Inch = () => {
	const [displayValue, setDisplayValue] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [showMismatchModal, setShowMismatchModal] = useState(false);
	const [mostUsedLength, setLastlength] = useState([])
	const [mostUsedBreadth, setLastBreadth] = useState([])
	const [newQuantity, setNewQuantity] = useState("");
	const placeholderText = "Enter your size";
	const location = useLocation();
	const { sqft } = location.state || {};
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
	const [squareFeet, setSquareFeet] = useState(0);
	const [total, setTotal] = useState(0);
	const [mostUsedLengthArray, setMostUsedLengthArray] = useState([]);
	const [mostUsedbreadthArray, setMostUsedbreadthArray] = useState([]);
	const [qData, setQData] = useState();


	useEffect(()=>{
		const frequencyMap = mostUsedLength.reduce((acc, val) => {
			acc[val] = (acc[val] || 0) + 1;
			return acc;
		  }, {});
		  const frequencyArray = Object.entries(frequencyMap);
		  frequencyArray.sort((a, b) => a[1] - b[1]);

		  let most_user = []
		  try{
			most_user.push(frequencyArray[frequencyArray.length-1][0])

		  }
		  catch{

		  }
		  try{
			most_user.push(frequencyArray[frequencyArray.length-2][0])

		  }
		  catch{
			
		  }
		setMostUsedLengthArray(most_user)
	},[mostUsedLength])
	useEffect(()=>{
		const frequencyMap = mostUsedBreadth.reduce((acc, val) => {
			acc[val] = (acc[val] || 0) + 1;
			return acc;
		  }, {});
		  const frequencyArray = Object.entries(frequencyMap);
		  frequencyArray.sort((a, b) => a[1] - b[1]);

		  let most_user = []
		  try{
			most_user.push(frequencyArray[frequencyArray.length-1][0])

		  }
		  catch{

		  }
		  try{
			most_user.push(frequencyArray[frequencyArray.length-2][0])

		  }
		  catch{
			
		  }
		  setMostUsedbreadthArray(most_user)
	},[mostUsedBreadth])
	useEffect(()=>{
		
		const check_local = localStorage.getItem("sqft")
		const check_local_length = JSON.parse(localStorage.getItem("length"));
		const check_local_breadth = JSON.parse(localStorage.getItem("breadth"));
		const check_local_data = JSON.parse(localStorage.getItem("lotQuant"))
		const check_local_data_quantity = JSON.parse(localStorage.getItem("data"))
		if (check_local){
			setTotal(parseFloat(check_local))
		}
		if (check_local_length){
			setLastlength(check_local_length)
		}
		if (check_local_breadth){
			setLastBreadth(check_local_breadth)
		}
		if (check_local_data){
			setData(check_local_data)
			setQuantityNumber(check_local_data.quantity)

		}
		if (check_local_data_quantity){
			setQData(check_local_data_quantity)
		}

	},[])
	const navigate = useNavigate();

	const getDocument = async () => {
		try {
			const docSnapshot = await getDoc(
				doc(database, "Data", "lot: " + lotNumberValue)
			);
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				setClientName(data?.["Client Name"] || "");
				setVehicleNumber(data?.["Vehicle Number"] || "");
				setMesurementType(data?.["Measurement Type"] || "");
				setValuesArray(data?.results || []);
				setPieceNumber((data?.results?.length - 1|| 0));
				setLastValue(data?.lastValue || "");
				setSecondLastValue(data?.secondLastValue || "");
				setThirdLastValue(data?.thirdLastValue || "");

				data.results.map((item) => {
					setSquareFeet(Number(item.sqft))
				})

				setLengthUsed(data?.length);
				setBreadthUsed(data?.breadth);
			} else {
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
				setIsMinusClicked(false);
				setDisplayValue((prev) => (prev === "" ? "" : prev + value));
			}
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
		let lastCharacter = displayValue.slice(-1);
		if(lastCharacter == "."){
			setIsMinusClicked(false)
		}
		setDisplayValue((prev) => prev.slice(0, -1));
	};
	const isValidInput = (input) => {
		const pattern = /.+X.+/;
		return pattern.test(input);
	};

	const handleNext = async () => {
		setIsMinusClicked(false)

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
	
			const result = ((firstNumber * secondNumber) / 144).toFixed(2);
	
			const newResult = {
				multiplication: displayValue,
				measurement: measurementType,
				firstNumber: firstNumber,
				secondNumber: secondNumber,
				sqft: result
			};
			setLastlength([...mostUsedLength,firstNumber])
			setLastBreadth([...mostUsedBreadth,secondNumber])
	
			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			try {
				await runTransaction(database, async (transaction) => {
					const docSnapshot = await transaction.get(docRef);
					if (!docSnapshot?.exists()) {
						throw "Document does not exist!";
					}
	
					const currentResults = docSnapshot?.data()?.results || [];
					const currentLengths = docSnapshot?.data()?.length || [];
					const currentBreadths = docSnapshot?.data()?.breadth || [];
	
					transaction.update(docRef, {
						results: [...currentResults, newResult],
						length: [...currentLengths, firstNumber],
						breadth: [...currentBreadths, secondNumber],
						lastValue: newLastValue,
						secondLastValue: newSecondLastValue,
						thirdLastValue: newThirdLastValue,
					});
				});
				setIsMinusClicked(false)

	
				// Update total after adding new square feet
				setTotal(prevTotal => prevTotal + parseFloat(result)); // Ensure result is parsed as float
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
		localStorage.setItem("sqft", total)
		
		localStorage.setItem("length", JSON.stringify(mostUsedLength))
		localStorage.setItem("breadth", JSON.stringify(mostUsedBreadth))
		if (quantityNumber &&!displayValue && quantityNumber != pieceNumber + 1) {
			setShowMismatchModal(true);
			return;
		}
	
		if (displayValue&& quantityNumber && quantityNumber < pieceNumber + 2) {
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
	
				const result = ((firstNumber * secondNumber) / 144).toFixed(2);
				const newResult = {
					multiplication: displayValue,
					measurement: measurementType,
					firstNumber: firstNumber,
					secondNumber: secondNumber,
					sqft: result
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
					setIsMinusClicked(false)

	
					// Update total after adding new square feet
					setTotal(prevTotal => prevTotal + parseFloat(result)); // Ensure result is parsed as float
				} catch (error) {
					console.error("Error updating document:", error);
				}
	
				setLastValue(newLastValue);
				setSecondLastValue(newSecondLastValue);
				setThirdLastValue(newThirdLastValue);
				setPieceNumber(pieceNumber + 1);
			}
	
			setDisplayValue("");
			navigate("/final-result");
		}
	};
		

	const handleMismatchContinue = () => {
		setShowMismatchModal(false);
		navigate("/final-result3");
	};
	const handleMostUsed = (check) => {
		setDisplayValue((prev) => prev + check);
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
		} catch (error) {
			console.error("Error updating document:", error);
		}
	};

	const updateLastData = (value) => {
		if (pieceNumber < quantityNumber || quantityNumber === "") {
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
		<div className="bg-gray-900 overflow-scroll h-screen text-white">
         <div style={{
                width:"100%",
                display:"flex",
                alignItems:"center",
				justifyContent: "space-around",
                paddingTop:"1rem"
            }}>
						
						<div onClick={handleFinalize} >
					<button className="text-white px-8 py-2 bg-blue-600 rounded-md font-bold tracking-wider"
					style={{
						display:"flex",
						alignItems:"center"
					}}
					>
					<FaLandmark size={30} /> <span style={{
							marginLeft:"1rem"
						}}>FINAL</span>
					</button>
				</div>
				<div className="  ml-2 rounded-md p-2 bg-blue-600">
					<NavLink to={"/"} className="text-white" style={{
						display:"flex",
						alignItems:"center"
					}} >
						
						
						<FaHome size={30} /> <span style={{
							marginLeft:"1rem"
						}}>HOME</span>
					</NavLink>
				</div>
			
            </div>
			<div className=" my-2 p-2 flex justify-between ">
				<div className="text-center px-3 border-2  rounded-md border-white" style={{
                    width:"30%"
                }}>
					{data.lotId}  <br /> {lotNumberValue ? lotNumberValue : "Lot Number"}
				</div>
				<div className="px-2 mx-2 text-center border-2 rounded-md  border-white" style={{
                    width:"30%"
                }}>
					{data.quantityId} <br /> {data.quantity ? data.quantity : "N/A"}
				</div>
				<button
					className="btn btn-primary text-center px-3 border-2 rounded-md  "
					style={{
						width: "30%",
						background:"",
						color:"white"
					}}  onClick={()=>{
					localStorage.setItem("sqft", total)
					localStorage.setItem("length", JSON.stringify(mostUsedLength))
					localStorage.setItem("breadth", JSON.stringify(mostUsedBreadth))
					navigate("/view-records3")
		}}>
					Piece <br /> { pieceNumber + 1}
				</button>
			</div>
			<div className=" px-2 my-2 flex justify-around items-center gap-4">
				
				<div className="" style={{
					fontSize:"1.3rem"
				}}>Type	: {measurementType}</div>
				<div className="" style={{
					fontSize:"1.3rem"
				}}>	SQFT : {total.toFixed(2)}</div>

			</div>
			<div style={{
				display:"flex",
				alignItems:"center",
				justifyContent:"space-around"
			}}>
<button
disabled={!(mostUsedbreadthArray?.[0] || mostUsedLengthArray?.[0])}

					onClick={()=>{
						if(!displayValue?.includes("X")){
							handleMostUsed(mostUsedLengthArray?.[0])

						}
						else{
							handleMostUsed(mostUsedbreadthArray?.[0])

						}
					}
					}
					style={{
						width:"40%",
						background:displayValue?.includes("X")?"green":"red",
						border:"0"

					}}
					className="border-2 border-white h-14 h700:h-16 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center overflow-hidden">
					<button>{!displayValue?.includes("X")?"Length":"Breadth"}<br/>{!displayValue?.includes("X") ? mostUsedLengthArray?.[0] || "2nd Most Used" : mostUsedbreadthArray?.[0] || "2nd Most Used" }</button>

				</button>				
				<button
				style={{
					width:"40%",
					background:displayValue?.includes("X")?"green":"red",
					border:"0"
				}}
				disabled={!(mostUsedbreadthArray?.[1] || mostUsedLengthArray?.[1])}

				onClick={()=>{
					if(!displayValue?.includes("X")){
						handleMostUsed(mostUsedLengthArray?.[1])

					}
					else{
						handleMostUsed(mostUsedbreadthArray?.[1])

					}
				}
				}
					className="border-2 border-white h-14 h700:h-16 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center overflow-hidden">
					<button>{!displayValue?.includes("X")?"Length":"Breadth"}<br/>{!displayValue?.includes("X") ? mostUsedLengthArray?.[1] || "2nd Most Used" : mostUsedbreadthArray?.[1] || "2nd Most Used" }</button>
				</button>
			</div>

			<div className=" rounded-md my-3 mx-1 h-[85px] h700:h-[100px] h700:my-6 text-4xl uppercase text-end flex justify-center items-center pr-3"
			
			style={{
				border: "0rem",
					height:"5rem"
			}}>
			{displayValue?.includes("X") ? <><span style={{
					color:"red"
				}}> {displayValue.split("X")[0]}</span> <>&nbsp; X &nbsp;</> <span style={{
					color:"green"
				}}>{displayValue.split("X")[1]}</span> </> : <span style={{
					color:"red"
				}}> {displayValue}</span> ||  placeholderText}
			</div>
			<div className="grid grid-cols-4 pb-2 fixed bottom-0 w-full ">
				<div className="border-2 border-white h700:h-16 h-10 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center">
					<button onClick={handleLastValue} className="overflow-hidden">{lastValue || "LV"}</button>
				</div>
				<div className="border-2 border-white h700:h-16 h-10 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center">
					<button onClick={handleSecondLastValue} className="overflow-hidden">
						{" "}
						{secondLastValue || "SV"}
					</button>
				</div>
				<div className="border-2 border-white h700:h-16 h-10 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center">
					<button onClick={handleThirdLastValue} className="overflow-hidden">
						{" "}
						{thirdLastValue || "TV"}
					</button>
				</div>
				<div onClick={handleClear} className="border-2 border-white bg-blue-500 h700:h-16 h-10 rounded-md mx-2 my-2 flex items-center justify-center">
					<button  > AC</button>
				</div>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("1")} className={`border-2 border-white h700:h-16 h-10 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 1</button>
				</button>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("2")} className={`border-2 border-white h700:h-16 h-10 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 2</button>
				</button>
				<div  onClick={() => handleButtonClick("3")} className="border-2 border-white h700:h-16 h-10 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 3</button>
				</div>
				<div  onClick={() => handleButtonClick("X")} className="border-2 border-white h700:h-16 h-10 rounded-md   bg-blue-500 mx-2 my-2 flex items-center justify-center">
					<button> X</button>
				</div>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("4")} className={`border-2 border-white h700:h-16 h-10 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 4</button>
				</button>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("5")} className={`border-2 border-white h700:h-16 h-10 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 5</button>
				</button>
				<div  onClick={() => handleButtonClick("6")} className="border-2 border-white h700:h-16 h-10 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 6</button>
				</div>
				<div onClick={handleCorrect} className="border-2 border-white h700:h-16 h-10 bg-blue-500 rounded-md mx-2 my-2 flex items-center justify-center">
					<button >
						<FaAngleLeft />
					</button>
				</div>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("7")} className={`border-2 border-white h700:h-16 h-10 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 7</button>
				</button>
				<button disabled={isMinusClicked} onClick={() => handleButtonClick("8")} className={`border-2 border-white h700:h-16 h-10 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button > 8</button>
				</button>
				<div  onClick={() => handleButtonClick("9")} className="border-2 border-white h700:h-16 h-10 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 9</button>
				</div>
				<div onClick={handleNext} className="border-2 border-white row-span-2 rounded-md bg-blue-500 mx-2 my-2 flex items-center justify-center">
					<button > NEXT</button>
				</div>
				<div  onClick={() => handleButtonClick("0")} className="border-2 border-white h700:h-16 h-10 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800">
					<button> 0</button>
				</div>

				<button disabled={isMinusClicked} onClick={() => handleButtonClick(".")} className={`border-2 col-span-2 border-white h700:h-16 h-10 rounded-md   mx-2 my-2 flex items-center justify-center ${isMinusClicked ? "bg-gray-200 text-gray-200" : "bg-gray-800"}`} >
					<button >.</button>
				</button>

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
				<div className="fixed inset-0 m-5 bg-black bg-opacity-50 flex items-center justify-center">
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
