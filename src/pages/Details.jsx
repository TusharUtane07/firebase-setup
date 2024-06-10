import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setLotNumber } from "../redux/actions/lotActions";

const Details = () => {
	const [clientName, setClientName] = useState("");
	const [vehicleNumber, setVehicleNumber] = useState("");
	const [lotNumberValue, setLotNumberValue] = useState("");
	const [quantityNumber, setQuantityNumber] = useState("");
	const [errors, setErrors] = useState({});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSubmit = async () => {
		const newErrors = {};

		if (!clientName) {
			newErrors.clientName = "Client Name is required";
		}
		if (!vehicleNumber) {
			newErrors.vehicleNumber = "Vehicle Number is required";
		}
		if (!lotNumberValue) {
			newErrors.lotNumberValue = "Lot Number is required";
		}
		if (!quantityNumber) {
			newErrors.quantityNumber = "Quantity Number is required";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
		} else {
			setErrors({});
			dispatch(setLotNumber(lotNumberValue));
			const docRef = doc(database, "Data", "lot number: " + lotNumberValue);
			await setDoc(docRef, {
				clientName,
				lotNumberValue,
				vehicleNumber,
				quantityNumber,
			});
			console.log("Document Added: ", docRef.id);
			navigate("/measurement-type");
		}
	};

	return (
		<div
			style={{
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontFamily: "initial",
			}}>
			{/* background */}
			<div className="ls-bg">
				<img className="ls-bg-inner" src="assets/images/bg.png" alt="" />
			</div>
			<main className="overflow-hidden" style={{ width: "90%" }}>
				<div className="wrapper">
					<div className="main-inner">
						{/* logo */}
						<div className="row h-100 align-content-center">
							<div className="col-md-6 tab-100">
								{/* form */}
								<div className="form">
									<h2
										className="login-form form-title"
										style={{ fontFamily: "emoji" }}>
										Raghu Marbles
									</h2>
									<form
										id="step1"
										className="login-form"
										method="post"
										style={{ marginTop: "-0.6rem" }}>
										<div>
											<label>Client Name</label>
											<input
												className="form-control form-control"
												type="text"
												placeholder=""
												value={clientName}
												onChange={(e) => setClientName(e.target.value)}
											/>
											{errors.clientName && (
												<span className="" style={{ color: "red" }}>
													{errors.clientName}
												</span>
											)}
										</div>
										<div>
											<label className="mt-3">Vehicle Number</label>
											<input
												className="form-control form-control"
												type="text"
												placeholder=""
												value={vehicleNumber}
												onChange={(e) => setVehicleNumber(e.target.value)}
											/>
											{errors.vehicleNumber && (
												<span style={{ color: "red" }}>
													{errors.vehicleNumber}
												</span>
											)}
										</div>
										<div>
											<label className="mt-3">Lot Number</label>
											<input
												className="form-control form-control"
												type="text"
												placeholder=""
												value={lotNumberValue}
												onChange={(e) => setLotNumberValue(e.target.value)}
											/>
											{errors.lotNumberValue && (
												<span style={{ color: "red" }}>
													{errors.lotNumberValue}
												</span>
											)}
										</div>
										<div>
											<label className="mt-3">Quantity Number</label>
											<input
												className="form-control form-control"
												type="number"
												placeholder=""
												value={quantityNumber}
												onChange={(e) => setQuantityNumber(e.target.value)}
											/>
											{errors.quantityNumber && (
												<span style={{ color: "red" }}>
													{errors.quantityNumber}
												</span>
											)}
										</div>
										<div
											className="d-flex justify-content-between flex-wrap"
											style={{ marginTop: "2rem" }}></div>
										<div className="login-btn">
											<button
												type="button"
												className="login"
												onClick={handleSubmit}>
												Start Measuring
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			<div id="error"></div>
			{/* Bootstrap-5 */}
			{/* Jquery */}
			{/* My js */}
		</div>
	);
};

export default Details;
