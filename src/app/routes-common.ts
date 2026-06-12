

export const routeTypes = [
		{name: "staff-service", themeColor: "#483248"},
		{name: "school-service", themeColor: "#8B8000"},
		{name: "route", themeColor: "#00008B"},
		{name: "tour", themeColor: "#2a8b00ff"},
		{name: "other", themeColor: "#A9A9A9"}
	]

export const routeBusTypes = [
		{name: "Super Luxury", themeColor: "#483248", ac: true, details: "Kinglong/ Yutong Coach"},
		{name: "Luxury", themeColor: "#00008B", ac: true, details: "Toyota Coaster/ Mitsubishi Rosa Bus"},
		{name: "Normal", themeColor: "#A9A9A9", ac: false, details: "Leyland/ Tata Bus"}
]

export const transportAuthorityTypes = [
		{name: "NTC", themeColor: "#483248", details: "National Transport Commission"},
		{name: "CP-TSA", themeColor: "#00008B", details: "Central Province Transport Service Authority"},
		{name: "SP-RPTA", themeColor: "#A9A9A9", ac: false, details: "Southern Province Road Passenger Transport Authority"}
]

export const operatorTypes = [
		{name: "SLTB", themeColor: "#483248"},
		{name: "Private", themeColor: "#00008B"},
		{name: "Combined", themeColor: "#A9A9A9"}
]

export const busThemePhoto = [
		{operator: "Combined", typeOfService: "Super Luxury", url: "combined_super_luxury.png"},
		{operator: "Combined", typeOfService: "Normal", url: "combined_normal.png"},
		{operator: "Private", typeOfService: "Super Luxury", url: "private_super_luxury.png"},
		{operator: "Private", typeOfService: "Luxury", url: "private_luxury.png"},
		{operator: "Private", typeOfService: "Normal", url: "private_normal.png"},
		{operator: "SLTB", typeOfService: "Super Luxury", url: "sltb_super_luxury.png"},
		{operator: "SLTB", typeOfService: "Normal", url: "sltb_normal.png"},
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

export const getRouteBusThemePhotoUrl = (operator,typeOfService) => {
	const vType = busThemePhoto.find(p => p.operator === operator && p.typeOfService === typeOfService);
	return vType.url;
}

