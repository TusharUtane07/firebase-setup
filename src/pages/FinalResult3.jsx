import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import loader from "../assests/loader.png";
import {  Space } from "antd-mobile";
import {  Radio } from "antd";
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

	const [measurements, setMeasurements] = useState("");
	const [measurementUnit, setMeasurementUnit] = useState("feet");

	const [selectedValue, setSelectedValue] = useState('1');
	const [pieceNumbers, setPieceNumbers] = useState([]);

	const [totalArea, setTotalArea] = useState(0);

	const showModal = () => {
	  setIsModalOpen(true);
	};

	const handleRadioChange = ({ target: { value } }) => {
		setSelectedValue(value);
	};
	const handleExcelChange = ({ target: { value } }) => {
		setExportType(value);
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
		downloadExcel(data, groupedData , "measurements.xlsx", measurementUnit, selectedValue);
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
				console.log(docSnapshot?.data()?.["Measurement Type"] || "")
				setMeasurements(docSnapshot?.data()?.["Measurement Type"] || "");
			} else {
			}
		} catch (error) {
			console.error("Error getting document:", error);
		} finally {
			setLoading(false);
		}
	};
	const handleDownloadPDF = () => {
		downloadPDF(data, groupedData , "measurements.pdf", measurementUnit, selectedValue);
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

	const convertValue = (value, fromUnit, toUnit) => {
		// Conversion factors to feet
		const conversionToFeet = {
			cm: value => value * 0.0328084,
			meter: value => value * 3.28084,
			inches: value => value * 0.0833333,
			feet: value => value, // 1 feet = 1 feet
			mm: value => value * 0.00328084
		};
	
		// Conversion factors from feet to other units
		const conversionFromFeet = {
			cm: value => value / 0.0328084,
			meter: value => value / 3.28084,
			inch: value => value / 0.0833333,
			feet: value => value, // 1 feet = 1 feet
			mm: value => value / 0.00328084
		};
	
		// First convert from the source unit to feet
		const valueInFeet = conversionToFeet[fromUnit](value);
	
		// Then convert from feet to the target unit
		return conversionFromFeet[toUnit](valueInFeet);
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

			const convertedValue1 = convertValue(value1, measurements,measurementUnit).toFixed(2);
			const convertedValue2 = convertValue(value2, measurements,measurementUnit).toFixed(2);
			let result = ""

			if(measurementUnit == "feet"){
				result = ((convertedValue1 * convertedValue2) / 144).toFixed(2);
			}
			else{
				result = (convertedValue1 * convertedValue2).toFixed(2);
			}

			const key = `${convertedValue1}-${convertedValue2}-${result}`;
			if (!grouped[key]) {
				grouped[key] = {
					length: convertedValue1,
					breadth: convertedValue2,
					sqft: parseFloat(result),
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
					<IoIosArrowRoundBack size={50} onClick={() => navigate("/step3inch")} />
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
									<a className="affan-element-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border:"1px solid black" }}>
										<p style={{ color: "black", margin:"0rem" }}>{camelCaseToReadable(key)}</p>
										<p style={{
											margin:"0rem"
										}}>{value}</p>
									</a>
								);
							}
							return null;
						})}
				</div>
				<div className="flex justify-between"  style={{
					padding:"1.4rem",
					paddingBottom:"0.3rem",
					paddingTop:"0rem"
				}}>
				
					<select name="measurement" id="measurement" onChange={handleMeasurementChange}>
						<option value="mm">MM</option>
						<option value="cm">CM</option>
						<option value="meter">METER</option>
						<option value="inch">INCH</option>
						<option selected value="feet">FEET</option>
					</select>
					</div>
					<div className="row" style={{
						paddingLeft:"1.2rem",
						paddingTop:"0.1rem",
						paddingBottom:"1rem"
					}}>
				<div className="flex gap-2">
				<Radio.Group
        options={[{
			label: 'Regular view',
			value: '1',
		  },
		  {
			label: 'Cumulative view',
			value: '2',
		  },]}
		  value={selectedValue}
        onChange={handleRadioChange}
        optionType="button"
        buttonStyle="solid"
      />
				
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


										const convertedValue1 = convertValue(value1,measurements, measurementUnit).toFixed(2);
										const convertedValue2 = convertValue(value2,measurements, measurementUnit).toFixed(2);
										let result = ""

										if(measurementUnit == "feet"){
											result = ((convertedValue1 * convertedValue2) / 144).toFixed(2);
										}
										else{
											result = (convertedValue1 * convertedValue2).toFixed(2);
										}

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

										sumOfSqft += parseFloat(group.sqft) * group.pieceNumbers.length;
 peiceNumberTotal += group.pieceNumbers.length;

									return(
											<tr key={index}>
											<td className="py-2 px-4">{group.pieceNumbers.length}</td>
											<td className="py-2 px-4">{group.length}</td>
											<td className="py-2 px-4">{group.breadth}</td>
											<td className="py-2 px-4">{group.pieceNumbers.join(", ")}</td>
											<td className="py-2 px-4">{parseFloat(group.sqft) * group.pieceNumbers.length}</td>
										</tr>
									)})}
								
									<tr>
										<td className="py-2 px-4 border-2 border-black">{peiceNumberTotal}</td>
										<td></td>
										<td></td>
										<td></td>
										<td className="py-2 px-4 border-2 border-black">{sumOfSqft.toFixed(2)}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
				<div className="mt-5 flex flex-col gap-3 border-2 p-4 m-3 margintopcheck" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop:"1rem" }}>
					
				<Radio.Group
        options={[{
			label: 'Export as Excel',
			value: 'excel',
		  },
		  {
			label: 'Export as PDF',
			value: 'pdf',
		  },]}
		  value={exportType}
        onChange={handleExcelChange}
        optionType="button"
        buttonStyle="solid"
      />
					
					
					<Modal open={isModalOpen} okText={"NEXT"} onOk={handleOk} onCancel={handleCancel} cancelButtonProps={{ style: { display: 'none' } }}>
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
						style={{ background: "#4E97F3", color: "white", width: "80%", alignSelf: "center", height:"3rem" }}
					>
						Download
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
