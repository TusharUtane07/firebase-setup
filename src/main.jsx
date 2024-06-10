import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import FinalResult from "./pages/FinalResult.jsx";
import MeasurementType from "./pages/MeasurementType.jsx";
import Details from "./pages/Details.jsx";
import Step3Inch from "./pages/Step3Inch.jsx";
import Step1Inch from "./pages/Step1Inch.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewRecords from "./pages/ViewRecords.jsx";
import EditPage1Inch from "./pages/EditPage1Inch.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		children: [
			{
				path: "",
				element: <Details />,
			},
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "signup",
				element: <Signup />,
			},
			{
				path: "details",
				element: <Details />,
			},
			{
				path: "measurement-type",
				element: <MeasurementType />,
			},
			{
				path: "step1inch",
				element: <Step1Inch />,
			},
			{
				path: "step3inch",
				element: <Step3Inch />,
			},
			{
				path: "final-result",
				element: <FinalResult />,
			},
			{
				path: "view-records",
				element: <ViewRecords />,
			},
			{
				path: "edit-1inch",
				element: <EditPage1Inch />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<RouterProvider router={router}>
				<App />
			</RouterProvider>
		</PersistGate>
	</Provider>
);
