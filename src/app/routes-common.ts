

export const routeTypes = [
		{name: "staff-service", themeColor: "#483248"},
		{name: "school-service", themeColor: "#8B8000"},
		{name: "route", themeColor: "#00008B"},
		{name: "tour", themeColor: "#2a8b00ff"},
		{name: "other", themeColor: "#A9A9A9"}
	]

export const routeBusTypes = [
		{name: "Highway", themeColor: "#483248"},
		{name: "Luxury", themeColor: "#00008B"},
		{name: "Semi-Luxury", themeColor: "#A9A9A9"},
		{name: "Normal", themeColor: "#A9A9A9"}
	]

export const getRouteColor = (routeType) => {
	const rType = routeTypes.find(p => p.name === routeType);
	//console.log("routeType"+routeType+" "+rType?.themeColor);
	return rType?.themeColor;
}

export const vehcileTypes = [
	{name: "Luxury Bus", details: "A/C Toyota Coaster/ Mitsubishi Rosa Bus", themeColor: "#013220"},
	{name: "Super Luxury Bus", details: "A/C Kinglong/Yutong Coach", themeColor: "#00008B"},
	{name: "Normal Bus", details: "Leyland,Tata Bus", themeColor: "#FAD5A5"}
]


export const getVehicleColor = (vehicleType) => {
	const vType = vehcileTypes.find(p => p.name === vehicleType);
	return vType.themeColor;
}

export const getTourTypeColor = (tourType) => {
	const tType = tourTypes.find(p => p.name === tourType);
	return tType.themeColor;
}

