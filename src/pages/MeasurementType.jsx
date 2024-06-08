import React from "react";
import { NavLink } from "react-router-dom";

const MeasurementType = () => {
	return (
		<div className="mt-32">
			<div className="flex flex-col gap-10 mx-10 border-2 border-black p-8 items-center">
				<NavLink to={"/step1inch"}>
					<button>
						Step over 1 Inch
					</button>
				</NavLink>
				<NavLink to={"/step2inch"}>
					<button >
						Step over 3 Inch
					</button>
				</NavLink>
			</div>
		</div>
	);
};

export default MeasurementType;
