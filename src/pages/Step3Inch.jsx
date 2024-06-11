import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDoc, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebase";
import "../style/cal.css";
import { NavLink, useNavigate } from "react-router-dom";

const Step3Inch = () => {
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
    const [valuesArray, setValuesArray] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const getDocument = async () => {
        try {
            const docSnapshot = await getDoc(doc(database, "Data", "lot number: " + lotNumberValue));
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setClientName(data?.clientName || "");
                setVehicleNumber(data?.vehicleNumber || "");
                setQuantityNumber(data?.quantityNumber || "");
                setValuesArray(data?.results || []);
                setPieceNumber((data?.results?.length || 0) - 1);
                setLastValue(data?.lastValue || "");
                setSecondLastValue(data?.secondLastValue || "");
                setThirdLastValue(data?.thirdLastValue || "");
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
                const newLastValue = `${firstNumber}X${secondNumber}`;
                const newSecondLastValue = lastValue;
                const newThirdLastValue = secondLastValue;

                const newResult = {
                    firstNumber: firstNumber,
                    secondNumber: secondNumber,
                    multiplication: newLastValue,
                    measurement: messasurement,
                };

                const docRef = doc(database, "Data", "lot number: " + lotNumberValue);
                try {
                    await updateDoc(docRef, {
                        results: arrayUnion(newResult),
                        inch: "3 Inch Measurements Data",
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
                const newLastValue = `${firstNumber}X${secondNumber}`;
                const newSecondLastValue = lastValue;
                const newThirdLastValue = secondLastValue;

                const newResult = {
                    firstNumber: firstNumber,
                    secondNumber: secondNumber,
                    multiplication: newLastValue,
                    measurement: messasurement,
                };

                const docRef = doc(database, "Data", "lot number: " + lotNumberValue);
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
                setDisplayValue("");
            } else {
                console.log("Please enter values in the format 'number X number'.");
                setDisplayValue("");
            }
        }
        navigate('/final-result3');
    };

    const handleClear = () => {
        setDisplayValue("");
    };

    const handleIncreaseQuantity = async () => {
        const newQty = parseInt(newQuantity, 10);
        if (!isNaN(newQty) && newQty > 0) {
            const updatedQuantity = Number(quantityNumber) + newQty;
            setQuantityNumber(updatedQuantity);
            const quantityRef = doc(database, "Data", "lot number: " + lotNumberValue);
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
        if (lastValue) {
            setDisplayValue(lastValue);
        }
    };

    const handleSecondLastValue = () => {
        if (secondLastValue) {
            setDisplayValue(secondLastValue);
        }
    };

    const handleThirdLastValue = () => {
        if (thirdLastValue) {
            setDisplayValue(thirdLastValue);
        }
    };

    const isXAdded = () => {
        return displayValue.includes('X');
    };

    const isButtonDisabled = (value) => {
        if (isXAdded()) {
            if (value !== '3' && value !== '6' && value !== '9') {
                return true;
            }
        }
        return false;
    };

    const buttonStyle = (disabled) => ({
        opacity: disabled ? 0.5 : 1,
    });

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}>
                      <button className='' onClick={() => navigate(`/`)}
                        style={{
                            background:"#4E97F3",
                            color:"white"
                        }}
                        > Home Screen</button>

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
                <div className="bg-[#EDF0F9] text-xl pl-5 px-4 flex justify-between items-center" style={{
                    paddingBottom:"1rem"
                }}>
                    <select name="measurement" id="measurement" className="bg-[#edf0f9] outline-none border-2 border-black mb-3">
                        <option value="mm">MM</option>
                        <option value="cm">CM</option>
                    </select>
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
                    <button className="side-button-rash" onClick={handleLastValue} disabled={!lastValue} >
                        {lastValue || "LV"}
                    </button>
                    <button className="side-button-rash" onClick={handleSecondLastValue} disabled={!secondLastValue} >
                        {secondLastValue || "SV"}
                    </button>
                    <button className="side-button-rash" onClick={handleThirdLastValue} disabled={!thirdLastValue} >
                        {thirdLastValue || "TV"}
                    </button>
                    <button className="side-button" onClick={handleClear}>
                        AC
                    </button>
                </div>
                <div>
                    <button onClick={() => handleButtonClick("1")} disabled={isButtonDisabled("1")} style={buttonStyle(isButtonDisabled("1"))}>1</button>
                    <button onClick={() => handleButtonClick("2")} disabled={isButtonDisabled("2")} style={buttonStyle(isButtonDisabled("2"))}>2</button>
                    <button onClick={() => handleButtonClick("3")} disabled={isButtonDisabled("3")} style={buttonStyle(isButtonDisabled("3"))}>3</button>
                    <button
                        className="side-button"
                        style={{ fontSize: "3rem", fontWeight: "100 " }}
                        onClick={() => handleButtonClick("X")}>
                        x
                    </button>
                </div>
                <div>
                    <button onClick={() => handleButtonClick("4")} disabled={isButtonDisabled("4")} style={buttonStyle(isButtonDisabled("4"))}>4</button>
                    <button onClick={() => handleButtonClick("5")} disabled={isButtonDisabled("5")} style={buttonStyle(isButtonDisabled("5"))}>5</button>
                    <button onClick={() => handleButtonClick("6")} disabled={isButtonDisabled("6")} style={buttonStyle(isButtonDisabled("6"))}>6</button>
                    <button
                        className="side-button"
                        style={{ fontSize: "1.3rem" }}
                        onClick={handleFinalize}>
                        Final
                    </button>
                </div>
                <div>
                    <button onClick={() => handleButtonClick("7")} disabled={isButtonDisabled("7")} style={buttonStyle(isButtonDisabled("7"))}>7</button>
                    <button onClick={() => handleButtonClick("8")} disabled={isButtonDisabled("8")} style={buttonStyle(isButtonDisabled("8"))}>8</button>
                    <button onClick={() => handleButtonClick("9")} disabled={isButtonDisabled("9")} style={buttonStyle(isButtonDisabled("9"))}>9</button>
                    <button
                        className="side-button"
                        style={{ height: "200%", position: "relative" }}
                        onClick={handleNext}>
                        Next
                    </button>
                </div>
                <div>
				<button
    onClick={() => handleButtonClick("0")}
    style={{
        width: "50%",
        ...buttonStyle(isButtonDisabled("7"))
    }}
    disabled={isButtonDisabled("7")}
>
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

export default Step3Inch;
