

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
	{name: "A/C Small Bus (Rosa/Coaster)", themeColor: "#013220"},
	{name: "Non A/C Bus (Leyland)", themeColor: "#FAD5A5"},
	{name: "A/C Luxury Bus (KingLong, Yutong)", themeColor: "#00008B"},
	{name: "A/C Van (KDH)", themeColor: "#808080"}
]

export const getVehicleColor = (vehicleType) => {
	const vType = vehcileTypes.find(p => p.name === vehicleType);
	return vType.themeColor;
}

