import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
	addDoc,
	arrayUnion,
	doc,
	getDoc,
	runTransaction,
	updateDoc,
} from "firebase/firestore";
import { database } from "../firebase/firebase";
import loader from "../assests/loader.png";
import "../style/cal.css";
import { json, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaAngleLeft, FaHome, FaLandmark } from "react-icons/fa";
import { Tooltip } from "antd";

const Step1Inch = () => {
	const [displayValue, setDisplayValue] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [showMismatchModal, setShowMismatchModal] = useState(false);
	const [mostUsedLength, setLastlength] = useState([])
	const [mostUsedBreadth, setLastBreadth] = useState([])
	const [newQuantity, setNewQuantity] = useState("");
	const placeholderText = "Enter your size";
	const location = useLocation();
	const { sqft } = location.state || {};
	const [unit, setUnit] = useState("");
	const truncate = (str, maxLength) => {
		return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
	  };
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
	const [data, setSData] = useState();
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
	const [qId, setQId] = useState("");

	useEffect(() => {
		const frequencyMap = mostUsedLength.reduce((acc, val) => {
		  acc[val] = (acc[val] || 0) + 1;
		  return acc;
		}, {});
		
		const frequencyArray = Object.entries(frequencyMap);
		frequencyArray.sort((a, b) => b[1] - a[1]); // Sort in descending order of frequency
	  
		let most_user = [];
		try {
		  most_user.push(frequencyArray[0][0]);
		} catch {}
	  
		try {
		  most_user.push(frequencyArray[1][0]);
		} catch {}
	  
		try {
		  most_user.push(frequencyArray[2][0]);
		} catch {}
	  
		try {
		  most_user.push(frequencyArray[3][0]);
		} catch {}
	  
		setMostUsedLengthArray(most_user);
	  }, [mostUsedLength]);
	  
	  useEffect(() => {
		const frequencyMap = mostUsedBreadth.reduce((acc, val) => {
		  acc[val] = (acc[val] || 0) + 1;
		  return acc;
		}, {});
		
		const frequencyArray = Object.entries(frequencyMap);
		frequencyArray.sort((a, b) => b[1] - a[1]); // Sort in descending order of frequency
	  
		let most_user = [];
		try {
		  most_user.push(frequencyArray[0][0]);
		} catch {}
	  
		try {
		  most_user.push(frequencyArray[1][0]);
		} catch {}
	  
		try {
		  most_user.push(frequencyArray[2][0]);
		} catch {}
	  
		try {
		  most_user.push(frequencyArray[3][0]);
		} catch {}
	  
		setMostUsedbreadthArray(most_user);
	  }, [mostUsedBreadth]);
	  

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
			setSData(check_local_data)
			console.log(check_local_data)
			setQId(check_local_data?.quantityId)
			
			// setQuantityNumber(check_local_data.quantityId)
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
setQuantityNumber(data?.["quantityNumber"])
				
					if(data?.["Measurement Type"] === 'mm'){
						setUnit("SQ.MM")
					}else if(data?.["Measurement Type"] === 'cm'){
						setUnit("SQ.CM")
					}else if( data?.["Measurement Type"] === "inches"){
						setUnit("SQ.IN")
					}else if(data?.["Measurement Type"] === 'meter'){
						setUnit("SQ.M")
					}else if (data?.["Measurement Type"] === "feet"){
						setUnit("SQ.FT")
					}
				setValuesArray(data?.results || []);
				setPieceNumber((data?.results?.length  || 0));
				setLastValue(data?.lastValue || "");
				setSecondLastValue(data?.secondLastValue || "");
				setThirdLastValue(data?.thirdLastValue || "");
				data.results.map((item) => {
					setSquareFeet(Number(item.sqft))
				})
				setLengthUsed(data?.length);
				setBreadthUsed(data?.breadth);
				// setTotal(Number(squareFeet + total))
		
			} else {
			}
		} catch (error) {
			console.error("Error getting document:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		
			getDocument();
		
	}, [lotNumberValue]);

	const [changeValuesTab, setChangeValue] = useState(true)

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
		if (!isValidInput(displayValue)) {
			alert("Invalid input format.");
			return;
		}
		setIsMinusClicked(false)
		if (pieceNumber < quantityNumber || quantityNumber === "") {
			const [firstNumber, secondNumber] = displayValue
				.split("X")
				.map((num) => parseFloat(num.trim()));
	
			const newLastValue = displayValue;
			const newSecondLastValue = lastValue;
			const newThirdLastValue = secondLastValue;
			let result ;
			if(measurementType == "feet"){
				 result = ((firstNumber * secondNumber) / 144).toFixed(2);

			}
			else{
				 result = ((firstNumber * secondNumber)).toFixed(2);

			}
	
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

		if (quantityNumber &&!displayValue && quantityNumber != pieceNumber  ) {
			setShowMismatchModal(true);
			return;
		}

	console.log(pieceNumber, quantityNumber)
	setDisplayValue("");
	navigate("/final-result");
	};

	const handleMismatchContinue = () => {
		setShowMismatchModal(false);
		navigate("/final-result");
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

	const handleLastValue = () => {
		setDisplayValue(lastValue);
	};
	const handleMostUsed = (check) => {
		setDisplayValue((prev) => prev + check);
	};

	const handleSecondLastValue = () => {
		setDisplayValue(secondLastValue);
	};

	const handleThirdLastValue = () => {
		setDisplayValue(thirdLastValue);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen animate-spin">
				<img src={loader} alt="Loading..." className="w-40 h-40" />
			</div>
		);
	}



	return (
		<div className="bg-gray-900 h-screen overflow-scroll h500:text-sm p-1 text-white">
			<div
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-around",
					paddingTop: "1rem",
				}} className="h500:text-sm">
				
				<div onClick={handleFinalize} className="h500:text-sm">
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
				<div className="  ml-2 rounded-md p-2 bg-blue-600" >
					<NavLink to={"/"} className="text-white" style={{
						    width:" 9rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
					}} >
						
						
						<FaHome size={30} /> <span style={{
							marginLeft:"1rem"
						}} className="font-bold">HOME</span>
					</NavLink>
				</div>
			</div>
			<div className=" my-2 p-2 flex justify-between ">
				<div
					className="text-center px-3 border-2  rounded-md border-white"
					style={{
						width: "30%",
						background:'rgb(92,97,101)',
						border:"0"
					}}>
						<Tooltip placement="bottom" title={data.lotId} >
					<span style={{
						textWrap:"nowrap"
					}}>{truncate(data.lotId, 6)}</span> <br /> {lotNumberValue ? lotNumberValue : "Lot Number"}
					</Tooltip>
				</div>
				<div
					className="px-2 mx-2 text-center border-2 rounded-md  border-white"
					style={{
						width: "30%",
						background:'rgb(92,97,101)',
						border:"0",
						
					}}>
												<Tooltip placement="bottom" title={data.quantityId} >

					<span style={{
						textWrap:"nowrap"
					}}>{truncate(data.quantityId, 6)}</span> <br /> {quantityNumber ? quantityNumber : "N/A"}
					</Tooltip>
				</div>
				<button
					className="btn btn-primary text-center px-3 border-2 rounded-md  "
					style={{
						width: "30%",
						background:"",
						color:"white",
						padding:"0rem"
					}}  onClick={()=>{
						localStorage.setItem("sqft", total)
						localStorage.setItem("length", JSON.stringify(mostUsedLength))
						localStorage.setItem("breadth", JSON.stringify(mostUsedBreadth))
						navigate("/view-records")
			}}>
					Piece <br /> {pieceNumber}
				</button>
			</div>
			<div className=" px-2 my-2 flex justify-around items-center gap-4">
				
				<div className="" style={{
					fontSize:"1.3rem"
				}}>Type	: {measurementType}</div>
				<div className="" style={{
					fontSize:"1.3rem"
				}}>	{unit} : {total.toFixed(2)}</div>

			</div>


			<div
				className="border-2 rounded-md  mx-1 border-white h-[85px] h700:h-[100px] h700:my-6 text-4xl uppercase text-end flex justify-center items-center pr-3 "
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
			{changeValuesTab ?
			<div className="grid grid-cols-4 pb-2 fixed bottom-0 w-full">
				<button
					onClick={handleLastValue}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center overflow-hidden">
					<button>{lastValue || "LV"}</button>
				</button>
				<button
					onClick={handleSecondLastValue}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 bg-gray-700  rounded-md mx-2 my-2 flex items-center justify-center overflow-hidden">
					<button> {secondLastValue || "SV"}</button>
				</button>
				<button
					onClick={handleThirdLastValue}
					className="border-2 border-white h700:h-16 h-10 h500:h-8  bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center overflow-hidden">
					<button> {thirdLastValue || "TV"}</button>
				</button>
				<button
					onClick={handleClear}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-blue-500">
					<button> AC</button>
				</button>
				<div
					onClick={() => handleButtonClick("1")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 1</button>
				</div>
				<div
					onClick={() => handleButtonClick("2")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 2</button>
				</div>
				<div
					onClick={() => handleButtonClick("3")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 3</button>
				</div>
				<div
					onClick={() => handleButtonClick("X")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-blue-500">
					<button> X</button>
				</div>
				<div
					onClick={() => handleButtonClick("4")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 4</button>
				</div>
				<div
					onClick={() => handleButtonClick("5")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 5</button>
				</div>
				<div
					onClick={() => handleButtonClick("6")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 6</button>
				</div>
				<button
					onClick={handleCorrect}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-blue-500">
					<button>
						<FaAngleLeft />
					</button>
				</button>
				<div
					onClick={() => handleButtonClick("7")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 7</button>
				</div>
				<div
					onClick={() => handleButtonClick("8")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 8</button>
				</div>
				<div
					onClick={() => handleButtonClick("9")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 9</button>
				</div>
				<button
					onClick={handleNext}
					className="border-2 border-white  row-span-2 rounded-md mx-2 my-2 flex items-center justify-center bg-blue-500">
					<button> NEXT</button>
				</button>
				<div
					onClick={() => {
						setChangeValue(!changeValuesTab)
					}}
					style={{
						background:"rgb(12,109,253)"
					}}
					
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button>Values</button>
				</div>
				<div
					onClick={() => handleButtonClick("0")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 0</button>
				</div>

				<button
					disabled={isMinusClicked}
					onClick={() => handleButtonClick(".")}
					className="border-2 border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button>.</button>
				</button>
				
			</div>

:
<>
<div
onClick={() => {
	setChangeValue(!changeValuesTab)
}}
style={{
	background:"rgb(12,109,253)"
}}

className="border btn-primary border-white h700:h-16 h-10 h500:h-8 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
<button>Keypad</button>
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
						border:"0",
						height:"7rem",


					}}
					className="border-2 border-white h-14 h700:h-16 bg-gray-700  rounded-md mx-2 my-2 flex items-center justify-center overflow-hidden">
					<button>{!displayValue?.includes("X")?"Length":"Breadth"}<br/>{!displayValue?.includes("X") ? mostUsedLengthArray?.[0] || "1st Most Used" : mostUsedbreadthArray?.[0] || "1st Most Used" }</button>

				</button>				
				<button
				style={{
					width:"40%",
					background:displayValue?.includes("X")?"green":"red",
					border:"0",
					height:"7rem",


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
				<button
				style={{
					width:"40%",
					background:displayValue?.includes("X")?"green":"red",
					border:"0",
					height:"7rem",


				}}
				disabled={!(mostUsedbreadthArray?.[2] || mostUsedLengthArray?.[2])}


				onClick={()=>{
					if(!displayValue?.includes("X")){
						handleMostUsed(mostUsedLengthArray?.[2])

					}
					else{
						handleMostUsed(mostUsedbreadthArray?.[2])

					}
				}
				}
					className="border-2 border-white h-14 h700:h-16 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center overflow-hidden">
					<button>{!displayValue?.includes("X")?"Length":"Breadth"}<br/>{!displayValue?.includes("X") ? mostUsedLengthArray?.[2] || "3rd Most Used" : mostUsedbreadthArray?.[2] || "3rd Most Used" }</button>
				</button>
				<button
				style={{
					width:"40%",
					background:displayValue?.includes("X")?"green":"red",
					border:"0",
					height:"7rem",


				}}
				disabled={!(mostUsedbreadthArray?.[3] || mostUsedLengthArray?.[3])}


				onClick={()=>{
					if(!displayValue?.includes("X")){
						handleMostUsed(mostUsedLengthArray?.[3])

					}
					else{
						handleMostUsed(mostUsedbreadthArray?.[3])

					}
				}
				}
					className="border-2 border-white h-14 h700:h-16 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center overflow-hidden">
					<button>{!displayValue?.includes("X")?"Length":"Breadth"}<br/>{!displayValue?.includes("X") ? mostUsedLengthArray?.[3] || "4th Most Used" : mostUsedbreadthArray?.[3] || "4th Most Used" }</button>
				</button>
			</div>
<div style={{
				display:"flex",
				alignItems:"center",
				justifyContent:"space-between"
			}}>
<button
					onClick={() => handleButtonClick("X")}
					style={{
						width:"40%",
						background:"rgb(12,109,253)",
						height:"7rem",

						border:"0"

					}}
					className="border-2 border-white h-14 h700:h-16 bg-gray-700  rounded-md mx-2 my-2 flex items-center justify-center overflow-hidden">
					<button>X</button>

				</button>				
				<button
				style={{
					width:"40%",
					background:"rgb(12,109,253)",
					height:"7rem",
					border:"0"

				}}
				onClick={handleNext}

					className="border-2 border-white h-14 h700:h-16 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center overflow-hidden">
					<button>Next</button>
				</button>
			</div>
</>
}
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
				<div className="fixed inset-0 m-5 bg-opacity-50 flex items-center justify-center">
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

export default Step1Inch;
