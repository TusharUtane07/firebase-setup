import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import loader from '../assets/images/loader.png'
import { Radio, Space } from "antd-mobile";


const FinalResult = () => {
	const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);


	const navigate = useNavigate();
	const lotNumberValue = useSelector((state) => state.lotReducer.lotNumber);

	const getData = async () => {
		try {
			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			const docSnapshot = await getDoc(docRef);
			if (docSnapshot.exists()) {
				setData(docSnapshot.data());
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.error("Error getting document:", error);
		}  finally {
			setLoading(false)
		  }
	};

	useEffect(() => {
		getData();
	}, [lotNumberValue]);

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

	if (loading) {
        return <div className="flex items-center justify-center h-screen animate-spin">
            <img src={loader} alt="Loading..." className="w-40 h-40" />
        </div>;
    }

	return (
		<div>
			<div
				className="flex items-center gap-6 justify-start mb-7"
				style={{
					fontSize: "1rem",
				}}>
				<div>
					<IoIosArrowRoundBack
						size={50}
						onClick={() => navigate("/step1inch")}
					/>
				</div>
				<div className="">
					<p className="font-bold text-2xl text-center my-3">
						Final Data Records
					</p>
				</div>
			</div>

			<div className="mx-4">
				<p>
					<span className="font-bold">Client Name:</span> {data?.clientName}
				</p>
				<p>
					<span className="font-bold">Vehicle Number:</span>{" "}
					{data?.vehicleNumber}
				</p>
				<p>
					<span className="font-bold">Quantity Number:</span>{" "}
					{data?.quantityNumber}
				</p>
				<p>
					<span className="font-bold">Lot Number:</span> {data?.lotNumberValue}
				</p>
			</div>
			<div className="mx-4">
				<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
					<thead className="bg-gray-200">
						<tr>
							<th className="py-2 px-4 text-left uppercase tracking-wider">
								SR NO
							</th>
							<th className="py-2 px-4 text-left uppercase tracking-wider">
								PIECE NO
							</th>
							<th className="py-2 px-4 text-left uppercase tracking-wider">
								LENGTH
							</th>
							<th className="py-2 px-4 text-left uppercase tracking-wider">
								BREADTH
							</th>
							<th className="py-2 px-4 text-left uppercase tracking-wider">
								AREA
							</th>
							<th className="py-2 px-4 text-left uppercase tracking-wider">
								SQFT
							</th>
						</tr>
					</thead>
					{data?.results?.map((item, index) => {
						const value1 = parseValue(item.multiplication.split("X")[0]);
						const value2 = parseValue(item.multiplication.split("X")[1]);

						if (isNaN(value1) || isNaN(value2)) {
							console.error("Invalid values:", value1, value2);
							return null;
						}

						const result = ((value1 * value2) / 144).toFixed(2);

						return (
							<tbody key={index}>
								<tr
									className={`border-b ${
										index % 2 === 0 ? "bg-gray-50" : "bg-white"
									} hover:bg-gray-100`}>
									<td className="py-2 px-4">{index + 1}</td>
									<td className="py-2 px-4">{index + 1}</td>
									<td className="py-2 px-4">{value1}</td>
									<td className="py-2 px-4">{value2}</td>
									<td className="py-2 px-4">{item.multiplication}</td>
									<td className="py-2 px-4">{result}</td>
								</tr>
							</tbody>
						);
					})}
				</table>
			</div>
			<div className="mt-5 flex flex-col gap-3 border-2 border-black p-4 rounded-md m-3 "
				style={{
					// width: "100vw",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
					<Radio.Group >
            <Space direction='vertical' block className="">
              <Radio value='1' block>
                Export as Excel
              </Radio>
              <Radio value='2'>
                Export as PDF
              </Radio>
            </Space>
          </Radio.Group>
				<button
					className=" btn-primary"
					onClick={() => navigate("/")}
					style={{
						background: "#4E97F3",
						color: "white",
						width: "70%",
						alignSelf: "center",
					}}>
					Save as pdf
				</button>
			</div>
		</div>
	);
};

export default FinalResult;
