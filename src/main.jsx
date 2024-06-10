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
import ViewRecords3 from "./pages/ViewRecords3.jsx";
import EditPage1Inch from "./pages/EditPage1Inch.jsx";
import FinalResult3 from "./pages/FinalResult3.jsx";
import EditPage3Inch from "./pages/EditPage3Inch.jsx";

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
				path: "final-result3",
				element: <FinalResult3 />,
			},
			{
				path: "view-records",
				element: <ViewRecords />,
			},
			{
				path: "view-records3",
				element: <ViewRecords3 />,
			},
			{
				path: "edit-1inch/:id",
				element: <EditPage1Inch />,
			},
			{
				path: "edit-3inch/:id",
				element: <EditPage3Inch />,
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
