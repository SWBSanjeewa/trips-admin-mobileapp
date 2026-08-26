import { ImageSourcePropType } from "react-native";

class StopppingPlace {
	constructor(
		readonly place: string,
		readonly latitude: string,
		readonly longitude: string,
	) {}
}

export class RouteBus {
	constructor(
		readonly _id: string,
		readonly title: string,
		readonly routeNo: string,
		readonly operator: string,
		readonly transportAuthority: string,
		readonly typeOfService: string,
		readonly stoppingPlaces: StopppingPlace[],
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
