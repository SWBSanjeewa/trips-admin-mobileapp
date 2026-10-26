import { ImageSourcePropType } from "react-native";

export class Bus {
	constructor(
		readonly title: string,
		readonly description: string,
		readonly image: ImageSourcePropType,
		readonly journey: Route,
		readonly returnJourney: Route ,
	) {}

	static bus1(): Bus {
		return new Bus(
			"NC-2882 Warakapola to Bambalapitiya",
			"Warakapola-Nittambuwa-Kadawatha Interchange-Peliyagoda Interchange-Fort-Kolpety-Bambalapitiya",
			require("../assets/image-bus.jpg"),
			Route.journey(),
			Route.returnJourney(),
		);
	}
}

export class Route {
	constructor(
		readonly start: string,
		readonly startTime: string,
		readonly end: string,
		readonly endTime: string,

	) {}

	static journey(): Route {
		return new Route(
			"Warakapola",
			"6.30AM",
			"Bambalapitiya",
			"8.00AM",
		);
	}

	static returnJourney(): Route {
		return new Route(
			"Bambalapitiya",
			"5.00PM",
			"Warakapola",
			"7.00PM",
		);
	}
}
