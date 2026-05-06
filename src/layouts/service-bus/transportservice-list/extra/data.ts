import { ImageSourcePropType } from "react-native";

export class TransportService {
	constructor(
		readonly id: string,
		readonly name: string,
		readonly address: string,
		readonly officeNumber: string,
		readonly themeColor: string,
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
