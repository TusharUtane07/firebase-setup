import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import loader from "../assests/loader.png";
import { Radio, Space } from "antd-mobile";
import { Select } from "antd";
import { camelCaseToReadable } from "../utils/commonFunctions";

const FinalResult3 = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [exportType, setExportType] = useState("excel");
	const [selectedFields, setSelectedFields] = useState([]);
	const [options, setOptions] = useState([]);

	const navigate = useNavigate();
	const lotNumberValue = useSelector((state) => state.lotReducer.lotNumber);
	
	const excludedFields = [
		'results',
		'secondLastValue',
		'thirdLastValue',
		'lastValue',
		'inch',
	];
	const getData = async () => {
		try {
			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			const docSnapshot = await getDoc(docRef);
			if (docSnapshot.exists()) {
				setData(docSnapshot?.data());
				const fields = Object?.keys(docSnapshot?.data())?.filter(key => !excludedFields.includes(key));
				const selectOptions = fields?.map(field => ({ label: camelCaseToReadable(field), value: field }));
				setOptions(selectOptions);
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
		getData();
	}, [lotNumberValue]);

	const parseValue = (value) => {
		value = value?.replace(/'/g, ".")?.replace(/"/g, "");
		if (value?.includes("-")) {
			value = value?.replace("-", ".");
		}
		return parseFloat(value);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen animate-spin">
				<img src={loader} alt="Loading..." className="w-40 h-40" />
			</div>
		);
	}

	const handleExport = () => {
		console.log(exportType);
	};

	const handleChange = (value) => {
		setSelectedFields([...value]);
	}

	return (
		<div className="h-screen">
			<div
				className="flex items-center gap-6 justify-start mb-2"
				style={{
					fontSize: "1rem",
				}}>
				<div>
					<IoIosArrowRoundBack
						size={50}
						onClick={() => navigate("/step3inch")}
					/>
				</div>
				<div className="">
					<p className="font-bold text-2xl text-center my-3">
						Final Data Records
					</p>
				</div>
			</div>


			
			<div className="" >
				<Space
					style={{ width: '100%', padding:"1rem" }}
					direction="vertical"
					
				>
					<Select
						mode="multiple"
						allowClear
						style={{ width: '100%' }}
						placeholder="Please select"
						// defaultValue={['Quantity Number']}
						onChange={handleChange}
						options={options}
					/>
				</Space>

		
			<div className="mx-4 my-4" style={{
				marginTop:"0rem !important"
			}}>
				{data &&
					Object.entries(data)?.map(([key, value]) => {
						if (excludedFields?.includes(key)) return null;
						if (selectedFields?.includes(key)) {
							return    <a class="affan-element-item" style={{
								display:"flex",
								alignItems:"center",
								justifyContent:"space-between"
							}}>
								<p style={{
									color:"black"
								}}>
							{camelCaseToReadable(key)}
							</p>
							<p>
							{value}
							</p>
						  </a>						}
						return null;
					})}
			</div>
			<div className="mx-4 overflow-hidden">
				<div className="overflow-x-auto">
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
			</div>
			<div
				className="mt-5 flex flex-col gap-3 border-2 border-black p-4 rounded-md m-3"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<Radio.Group value={exportType} onChange={(e) => setExportType(e)}>
					<Space direction="vertical" block className="">
						<Radio value="excel" block>
							Export as Excel
						</Radio>
						<Radio value="pdf">Export as PDF</Radio>
					</Space>
				</Radio.Group>
				<button
					className="btn-primary"
					onClick={handleExport}
					style={{
						background: "#4E97F3",
						color: "white",
						width: "70%",
						alignSelf: "center",
					}}>
					Export
				</button>
			</div>
		</div>
		</div>
	);
};

export default FinalResult3;
