import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDoc, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebase";
import "../style/cal.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FaAngleLeft, FaHome } from "react-icons/fa";

const EditPage1Inch = () => {
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

    
    const isValidInput = (input) => {
        const pattern = /.+X.+/;
        return pattern.test(input);
    }
	const handleNext = async () => {
        if (!isValidInput(displayValue)) {
            alert("Invalid format");
            return;
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
        <div className="bg-gray-900 h-screen text-white">
        <div className="flex w-12 ml-2 rounded-md p-2 bg-blue-600">
            <NavLink to={"/"} className="text-white">
                <FaHome size={30} />
            </NavLink>
        </div>
        <div className=" my-2 p-2 flex justify-between ">
            <div className="text-center px-3 border-2  rounded-md border-white">
                Lot <br /> {lotNumberValue ? lotNumberValue : "Lot Number"}
            </div>
            <div className="px-2 mx-2 text-center border-2 rounded-md  border-white">
                Quantity <br /> {quantityNumber ? quantityNumber : "Null"}
            </div>
            <div className="text-center px-3 border-2 rounded-md  border-white">
                Piece Number <br /> {pieceNumber ? pieceNumber + 1 : 1}
            </div>
        </div>
        <div className=" px-4 my-2 flex items-center  justify-between">
            <select
                name="measurement"
                id="measurement"
                value={measurementType}
                onChange={(e) => setMesurementType(e.target.value)}
                className="bg-black text-xl  ">
                <option value="mm">MM</option>
                <option value="cm">CM</option>
                <option value="meter">METER</option>
                <option value="inches">INCHES</option>
                <option value="feet">FEET</option>
            </select>
            <NavLink to={"/view-records"}>
                <button className="text-white px-3 py-1 bg-blue-600 rounded-md font-bold tracking-wider">
                    View Records
                </button>
            </NavLink>
        </div>
        <div className="border-2 rounded-md my-3 mx-1 border-white h-32 text-4xl uppercase text-end flex justify-center items-center pr-3">
            {displayValue || placeholderText}
        </div>
        <div className="grid grid-cols-4  ">
            <div className="border-2 border-white h-20 bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center">
                <button >{lastValue || "LV"}</button>
            </div>
            <div className="border-2 border-white h-20 bg-gray-700  rounded-md mx-2 my-2 flex items-center justify-center">
                <button >
                    {" "}
                    {secondLastValue || "SV"}
                </button>
            </div>
            <div className="border-2 border-white h-20  bg-gray-700 rounded-md mx-2 my-2 flex items-center justify-center">
                <button>
                    {" "}
                    {thirdLastValue || "TV"}
                </button>
            </div>
            <div onClick={handleClear}  className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-blue-500">
					<button > AC</button>
				</div>
				<div  onClick={() => handleButtonClick("1")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 1</button>
				</div>
				<div  onClick={() => handleButtonClick("2")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 2</button>
				</div>
				<div  onClick={() => handleButtonClick("3")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 3</button>
				</div>
				<div  onClick={() => handleButtonClick("X")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-blue-500">
					<button> X</button>
				</div>
				<div  onClick={() => handleButtonClick("4")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 4</button>
				</div>
				<div  onClick={() => handleButtonClick("5")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 5</button>
				</div>
				<div  onClick={() => handleButtonClick("6")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 6</button>
				</div>
				<div onClick={handleCorrect}  className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-blue-500">
					<button >
						<FaAngleLeft />
					</button>
				</div>
				<div  onClick={() => handleButtonClick("7")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 7</button>
				</div>
				<div  onClick={() => handleButtonClick("8")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 8</button>
				</div>
				<div  onClick={() => handleButtonClick("9")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 9</button>
				</div>
				<div onClick={handleNext} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-blue-500">
					<button > NEXT</button>
				</div>
				<div  onClick={() => handleButtonClick("0")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
					<button> 0</button>
				</div>

				{measurementType === "mm" ||
				measurementType === "cm" ||
				measurementType === "meter" ? (
					<>
                    <div  onClick={() => handleButtonClick(".")} className="col-span-2  border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
						<button>.</button>
                    </div>
					</>
				) : (
					<>
                    <div  onClick={() => handleButtonClick("-")} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
						<button>-</button>
                    </div>
                    <div onClick={() => handleButtonClick(`"`)} className="border-2 border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-gray-800 ">
						<button >"</button>
                    </div>
					</>
				)}

				<div onClick={handleFinalize} className="border-2  border-white h-20 rounded-md mx-2 my-2 flex items-center justify-center bg-blue-500">
					<button  > FINAL</button>
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

export default EditPage1Inch;
