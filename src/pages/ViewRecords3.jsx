import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { database } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { IoHome } from 'react-icons/io5';

const ViewRecords = () => {
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
            <div className="flex items-center gap-6 justify-start mb-7">
				<div>
					<IoIosArrowRoundBack size={50} onClick={() => navigate('/step3inch')}/>
				</div>
				<div className="">
					<p className="font-bold text-3xl text-center my-3">Data Records</p>
				</div>
			</div>
            <div className='font-bold mx-4'>
                <p>Client Name: {data?.clientName}</p>
                <p>Vehicle Number: {data?.vehicleNumber}</p>
                <p>Quantity Number: {data?.quantityNumber}</p>
                <p>Lot Number: {data?.lotNumberValue}</p>
                <p>{data?.inch}</p>
            </div>
            <hr />
            <div className='mx-4'>
                <p className='font-bold'>Values: </p>
                {
                    data?.results?.map((item, index) => {
                        return (
                            <ul className='flex justify-between font-semibold'>
                                <li className='text-lg py-2'>{index+1}. {item.multiplication}</li>
                                <div className='flex items-center gap-2'>
                                <button onClick={() => navigate(`/edit-3inch/${index}`)}>Edit</button>
                                </div>
                            </ul>
                        )
                    })
                }
            </div>
            <button className='absolute bottom-6 left-2/4 ' onClick={() => navigate('/')}>
                <IoHome/> 
            </button>
        </div>
    );
};

export default ViewRecords;
