import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoHome } from "react-icons/io5";

const FinalResult3 = () => {
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
					<IoIosArrowRoundBack
						size={50}
						onClick={() => navigate("/step1inch")}
					/>
				</div>
				<div className="">
					<p className="font-bold text-3xl text-center my-3">Data Records</p>
				</div>
			</div>

			<div className="font-bold mx-4">
				<p>Client Name: {data?.clientName}</p>
				<p>Vehicle Number: {data?.vehicleNumber}</p>
				<p>Quantity Number: {data?.quantityNumber}</p>
				<p>Lot Number: {data?.lotNumberValue}</p>
			</div>
			<div className="mx-4">
				<p className="font-bold">Values: </p>
				<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
					<thead className="bg-gray-200">
						<tr>
							<th className="py-2 px-4 text-left uppercase tracking-wider">
								SR NO
							</th>
							<th className="py-2 px-4 text-left uppercase tracking-wider">
								SIZE
							</th>
							<th className="py-2 px-4 text-left uppercase tracking-wider">
								SQFT
							</th>
						</tr>
					</thead>
					{data?.results?.map((item, index) => {
						return (
							<tbody>
								<tr
									key={index}
									className={`border-b ${
										index % 2 === 0 ? "bg-gray-50" : "bg-white"
									} hover:bg-gray-100`}>
									<td className="py-2 px-4">{index + 1}</td>
									<td className="py-2 px-4">{item?.multiplication}</td>
									<td className="py-2 px-4">34.00</td>
								</tr>
							</tbody>
						);
					})}
				</table>
			</div>
			<button
				className="absolute bottom-6 left-2/4 "
				onClick={() => navigate("/")}>
				<IoHome />
			</button>
		</div>
	);
};

export default FinalResult3;
