import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import loader from "../assests/loader.png";
import { Radio, Space } from "antd-mobile";
import { Modal, Progress, Select } from "antd";
import { camelCaseToReadable } from "../utils/commonFunctions";
import { downloadExcel } from "./handleDownload";
import { downloadPDF } from "./handlePdfDownload";

const FinalResult = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [exportType, setExportType] = useState("excel");
	const [selectedFields, setSelectedFields] = useState([]);
	const [options, setOptions] = useState([]);
	const [exportModal, setExportModal] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [measurements, setMeasurements] = useState([]);
	const [measurementUnit, setMeasurementUnit] = useState("feet");

	const [selectedValue, setSelectedValue] = useState('1');
	const [pieceNumbers, setPieceNumbers] = useState([]);

	const [totalArea, setTotalArea] = useState(0);

	const showModal = () => {
	  setIsModalOpen(true);
	};

	const handleRadioChange = (event) => {
		setSelectedValue(event.target.value);
	};

	const handleOk = () => {
	  setIsModalOpen(false);
	  setTimeout(() => {
		handleExport();
	  }, 1500);
	};
	const handleCancel = () => {
	  setIsModalOpen(false);
	};
	const [percentageDownload, setPercentageDownload] = useState(0);

	const navigate = useNavigate();
	const lotNumberValue = useSelector((state) => state.lotReducer.lotNumber);

	const excludedFields = [
		"results",
		"secondLastValue",
		"thirdLastValue",
		"lastValue",
		"inch",
		"length",
		"breadth",
	];

	const handleDownload = () => {
		console.log("sdd")
		downloadExcel(data, "measurements.xlsx", measurementUnit);
	};
	const getData = async () => {
		try {
			const docRef = doc(database, "Data", "lot: " + lotNumberValue);
			const docSnapshot = await getDoc(docRef);
			if (docSnapshot.exists()) {
				setData(docSnapshot?.data());
				const fields = Object?.keys(docSnapshot?.data())?.filter(key => !excludedFields.includes(key));
				const selectOptions = fields?.map(field => ({ label: camelCaseToReadable(field), value: field }));
				setOptions(selectOptions);
				setMeasurements(docSnapshot?.data()?.Measurement)
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.error("Error getting document:", error);
		} finally {
			setLoading(false);
		}
	};
	const handleDownloadPDF = () => {
		downloadPDF(data, "measurements.pdf", measurementUnit);
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

	const convertValue = (value, unit) => {
		switch (unit) {
			case "cm":
				return value / 30.48; // 1 cm = 0.0328084 feet
			case "meter":
				return value / 0.3048; // 1 meter = 3.28084 feet
			case "inch":
				return value / 12; // 1 inch = 0.0833333 feet
			case "feet":
				return value; // 1 feet = 1 feet
			case "mm":
				return value / 304.8; // 1 mm = 0.00328084 feet
			default:
				return value * 0.3048; // Convert unknown unit to feet
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen animate-spin">
				<img src={loader} alt="Loading..." className="w-40 h-40" />
			</div>
		);
	}

	const handleExport = () => {
		setExportModal(true);
		console.log(exportType);
	};

	const handleMeasurementChange = (e) => {
		setMeasurementUnit(e.target.value);
	};

	const handleChange = (value) => {
		setSelectedFields([...value]);
	};

	
	const groupData = () => {
		const grouped = {};
		data.results.forEach((item, index) => {
			const value1 = parseValue(item.multiplication.split("X")[0]);
			const value2 = parseValue(item.multiplication.split("X")[1]);

			if (isNaN(value1) || isNaN(value2)) {
				console.error("Invalid values:", value1, value2);
				return;
			}

			const convertedValue1 = convertValue(value1, measurementUnit).toFixed(2);
			const convertedValue2 = convertValue(value2, measurementUnit).toFixed(2);
			const result = ((convertedValue1 * convertedValue2) / 144).toFixed(2);

			const key = `${convertedValue1}-${convertedValue2}-${result}`;
			if (!grouped[key]) {
				grouped[key] = {
					length: convertedValue1,
					breadth: convertedValue2,
					sqft: result,
					pieceNumbers: [],
				};
			}
			grouped[key].pieceNumbers.push(index + 1);
		});
		return Object.values(grouped);
	};

	const groupedData = groupData();
	let totalResult = 0;
	let  sumOfSqft = 0;
	let peiceNumberTotal = 0;
	return (
		<div className="h-screen">
			<div className="flex items-center gap-6 justify-start mb-2" style={{ fontSize: "1rem" }}>
				<div>
					<IoIosArrowRoundBack size={50} onClick={() => navigate("/step1inch")} />
				</div>
				<div className="">
					<p className="font-bold text-2xl text-center my-3">Final Data Records</p>
				</div>
			</div>

			<div className="">
				<Space style={{ width: '100%', padding: "1rem" }} direction="vertical">
					<Select
						mode="multiple"
						allowClear
						style={{ width: '100%' }}
						placeholder="Please select"
						onChange={handleChange}
						options={options}
					/>
				</Space>

				<div className="mx-4 my-4" style={{ marginTop: "0rem !important" }}>
					{data &&
						Object.entries(data)?.map(([key, value]) => {
							if (excludedFields?.includes(key)) return null;
							if (selectedFields?.includes(key)) {
								return (
									<a className="affan-element-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
										<p style={{ color: "black" }}>{camelCaseToReadable(key)}</p>
										<p>{value}</p>
									</a>
								);
							}
							return null;
						})}
				</div>
				<div className="flex justify-between"  style={{
					padding:"1.4rem"
				}}>
					<select name="measurement" id="measurement" onChange={handleMeasurementChange}>
						<option value="mm">MM</option>
						<option value="cm">CM</option>
						<option value="meter">METER</option>
						<option value="inch">INCH</option>
						<option selected value="feet">FEET</option>
					</select>
				<div className="flex gap-2">
					<input 
						type="radio" 
						name="options" 
						value="1" 
						id="option1"
						checked={selectedValue === '1'} 
						onChange={handleRadioChange} 
					/>
					<label htmlFor="option1">Option 1</label>
					
					<input 
					id="option2"
						type="radio" 
						name="options" 
						value="2" 
						checked={selectedValue === '2'} 
						onChange={handleRadioChange} 
					/>
					<label htmlFor="option2">Option 2</label>
				</div>
				</div>
				<div>
				{selectedValue === '1' && (
					<div className="mx-4 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
								<thead className="bg-gray-200">
									<tr>
										<th className="py-2 px-4 text-left uppercase tracking-wider">SR NO</th>
										<th className="py-2 px-4 text-left uppercase tracking-wider">PIECE NO</th>
										<th className="py-2 px-4 text-left uppercase tracking-wider">LENGTH ({measurementUnit})</th>
										<th className="py-2 px-4 text-left uppercase tracking-wider">BREADTH ({measurementUnit})</th>
										<th className="py-2 px-4 text-left uppercase tracking-wider">AREA (SQFT)</th>
									</tr>
								</thead>
								<tbody>
									{data.results.map((item, index) => {
										const value1 = parseValue(item.multiplication.split("X")[0]);
										const value2 = parseValue(item.multiplication.split("X")[1]);

										if (isNaN(value1) || isNaN(value2)) {
											console.error("Invalid values:", value1, value2);
											return null;
										}


										const convertedValue1 = convertValue(value1, measurementUnit).toFixed(2);
										const convertedValue2 = convertValue(value2, measurementUnit).toFixed(2);
										const result = ((convertedValue1 * convertedValue2) / 144).toFixed(2);

										totalResult += parseFloat(result);

										return (
											<tr key={index}>
												<td className="py-2 px-4">{index + 1}</td>
												<td className="py-2 px-4">{index + 1}</td>
												<td className="py-2 px-4">{convertedValue1}</td>
												<td className="py-2 px-4">{convertedValue2}</td>
												<td className="py-2 px-4">{result}</td>
											</tr>
										);
									})}
									<tr>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td className="py-2 px-4 border-2 border-black">{totalResult.toFixed(2)}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)}
				{selectedValue === '2' && (
					<div className="mx-4 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
								<thead className="bg-gray-200">
									<tr>
										<th className="py-2 px-4 text-left uppercase tracking-wider">No.Of Pieces</th>
										<th className="py-2 px-4 text-left uppercase tracking-wider">LENGTH ({measurementUnit})</th>
										<th className="py-2 px-4 text-left uppercase tracking-wider">BREADTH ({measurementUnit})</th>
										<th className="py-2 px-4 text-left uppercase tracking-wider">PIECE NO</th>
										<th className="py-2 px-4 text-left uppercase tracking-wider">AREA (SQFT)</th>
									</tr>
								</thead>
								<tbody>
									{groupedData.map((group, index) => 
									{

										sumOfSqft += Number(group.sqft);
 peiceNumberTotal += group.pieceNumbers.length;

									return(
											<tr key={index}>
											<td className="py-2 px-4">{group.pieceNumbers.length}</td>
											<td className="py-2 px-4">{group.length}</td>
											<td className="py-2 px-4">{group.breadth}</td>
											<td className="py-2 px-4">{group.pieceNumbers.join(", ")}</td>
											<td className="py-2 px-4">{group.sqft}</td>
										</tr>
									)})}
								
									<tr>
										<td className="py-2 px-4 border-2 border-black">{peiceNumberTotal}</td>
										<td></td>
										<td></td>
										<td></td>
										<td className="py-2 px-4 border-2 border-black">{sumOfSqft}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
				<div className="mt-5 flex flex-col gap-3 border-2 p-4 m-3" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
					<Radio.Group value={exportType} onChange={(e) => setExportType(e)}>
						<Space direction="vertical" block className="">
							<Radio value="excel" block>Export as Excel</Radio>
							<Radio value="pdf">Export as PDF</Radio>
						</Space>
					</Radio.Group>
					<Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelButtonProps={{ style: { display: 'none' } }}>
						<div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
							<Progress type="circle" percent={percentageDownload} />
							<p style={{ marginTop: "1rem" }}>{percentageDownload === 100 && "File has been saved in your device"}</p>
						</div>
					</Modal>
					<button
						className="btn-primary"
						onClick={() => {
							if (exportType === "pdf") {
								handleDownloadPDF();
							} else{
								handleDownload();
							}
							setTimeout(() => {
								showModal();
							}, 1000);
							setTimeout(() => {
								setPercentageDownload(100);
							}, 1500);
						}}
						style={{ background: "#4E97F3", color: "white", width: "70%", alignSelf: "center" }}
					>
						Export
					</button>
				</div>
				{exportModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<div className="bg-white text-black p-4 rounded">
							<h2 className="text-lg font-bold">Please Select</h2>
							<p>Choose the type of next measurement</p>
							<div className="flex justify-between mt-4">
								<button
									onClick={() => navigate(`/details/${lotNumberValue}`)}
									className="border-2 border-black py-2 px-4 font-bold text-center" style={{ marginRight: "1rem" }}
								>
									New Lot
								</button>
								<button
									onClick={() => navigate('/')}
									className="border-2 border-black py-2 px-4 font-bold text-center"
								>
									New Client
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FinalResult;
