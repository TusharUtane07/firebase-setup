import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoHome } from "react-icons/io5";

const FinalResult = () => {
    const [data, setData] = useState(null);

    const navigate = useNavigate();
    const lotNumberValue = useSelector((state) => state.lotReducer.lotNumber);

    const getData = async () => {
        try {
            const docRef = doc(database, "Data", "lot number: " + lotNumberValue);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                setData(docSnapshot.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }
    };

    useEffect(() => {
        getData();
    }, [lotNumberValue]);

    return (
        <div>
            <div className="flex items-center gap-6 justify-start mb-7" style={{
                fontSize:"1rem"
            }}>
                <div>
                    <IoIosArrowRoundBack size={50} onClick={() => navigate('/step1inch')}/>
                </div>
                <div className="">
                    <p className="font-bold text-2xl text-center my-3">Final Data Records</p>
                </div>
            </div>
            
            <div className="mx-4">
                <p><span className="font-bold">Client Name:</span> {data?.clientName}</p>
                <p><span className="font-bold">Vehicle Number:</span> {data?.vehicleNumber}</p>
                <p><span className="font-bold">Quantity Number:</span> {data?.quantityNumber}</p>
                <p><span className="font-bold">Lot Number:</span> {data?.lotNumberValue}</p>
            </div>
            <div className="mx-4">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 text-left uppercase tracking-wider">SR NO</th>
                            <th className="py-2 px-4 text-left uppercase tracking-wider">SIZE</th>
                            <th className="py-2 px-4 text-left uppercase tracking-wider">SQFT</th>
                        </tr>
                    </thead>
                    {data?.results?.map((item, index) => {
                        const [value1, value2] = item.multiplication.split('X').map(Number);
                        const result = ((value1 * value2)/144).toFixed(2);

                        return (
                            <tbody key={index}>
                                <tr
                                    className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                                >
                                    <td className="py-2 px-4">{index + 1}</td>
                                    <td className="py-2 px-4">{item.multiplication}</td>
                                    <td className="py-2 px-4">{result}</td>
                                </tr>
                            </tbody>
                        );
                    })}
                </table>
            </div>
            <div
            style={{
                width:"100vw",
                display:"flex",
                alignItems:"center",
                justifyContent:"center"
            }}
            >
            <button className='absolute bottom-6 btn-primary' onClick={() => navigate('/')} style={{
                background:"#4E97F3",
                color:"white",
                width:"70%",
                alignSelf:"center"
            }}>
                    Save as pdf
            </button>
            </div>
        </div>
    );
};

export default FinalResult;
