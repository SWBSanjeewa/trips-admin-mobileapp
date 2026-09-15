

import { ImageSourcePropType } from "react-native";


export class Tour {
	constructor(
		readonly _id: string,
		readonly title: string,
		readonly remarks: string,
		readonly tourType: string,
		readonly vehicleType: string,
		readonly noOfDays: string,
		readonly image: ImageSourcePropType,
		readonly photos: string[],
		readonly stoppings: string[],
		readonly stoppingsPlaces: string[],
		
	) {}

	/*
	static bus1(): Bus {
		return new Bus(
			"NC-2882 Warakapola to bambalapitiya",
			"Warakapola-Nittambuwa-Kadawatha Interchange-Peliyagoda Interchange-Fort-Kolpety-Bambalapitiya",
			require("../assets/image-bus.jpg"),
		);
	}
	*/
}
