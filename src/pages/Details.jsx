import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setLotNumber } from '../redux/actions/lotActions';

const Details = () => {
    const [clientName, setClientName] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [lotNumberValue, setLotNumberValue] = useState("");
    const [quantityNumber, setQuantityNumber] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async() => {
        if (clientName && vehicleNumber && lotNumberValue && quantityNumber) {
            dispatch(setLotNumber(lotNumberValue))
            const docRef = doc(database, "Data", "lot number: "+ lotNumberValue);
            await setDoc(docRef, {
                clientName,
                lotNumberValue,
                vehicleNumber,
                quantityNumber
            })
            console.log("Document Added: ", docRef.id)
            navigate("/measurement-type")        
        } else {
            alert("Please fill in all fields before starting measuring.");
        }
    };

    return (
        <div className='mt-10 w-full text-center'>
            <div className='flex flex-col gap-3'>
                <input 
                    className='border-2 border-black outline-none mx-4 py-2 px-3 rounded-lg' 
                    type="text" 
                    placeholder='Client Name' 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                />
                <input 
                    className='border-2 border-black outline-none mx-4 py-2 px-3 rounded-lg' 
                    type="text" 
                    placeholder='Vehicle Number' 
                    value={vehicleNumber} 
                    onChange={(e) => setVehicleNumber(e.target.value)} 
                />
                <input 
                    className='border-2 border-black outline-none mx-4 py-2 px-3 rounded-lg' 
                    type="text" 
                    placeholder='Lot Number' 
                    value={lotNumberValue} 
                    onChange={(e) => setLotNumberValue(e.target.value)} 
                />
                <input 
                    className='border-2 border-black outline-none mx-4 py-2 px-3 rounded-lg' 
                    type="number" 
                    placeholder='Quantity Number' 
                    value={quantityNumber} 
                    onChange={(e) => setQuantityNumber(e.target.value)} 
                />
            </div>
            <button className='mt-10' onClick={handleSubmit}>Start Measuring</button>
        </div>
    )
}

export default Details;
