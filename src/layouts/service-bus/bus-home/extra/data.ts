import { ImageSourcePropType } from "react-native";

export class Bus {
	constructor(
		readonly _id: string,
		readonly title: string,
		readonly description: string,
		readonly image: ImageSourcePropType,
		readonly photos: string[],
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
