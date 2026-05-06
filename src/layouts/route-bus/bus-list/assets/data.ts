import { ImageSourcePropType } from "react-native";

export class Bus {
	constructor(
		readonly title: string,
		readonly description: string,
		readonly image: ImageSourcePropType,
		readonly route: Route,
	) {}

	static bus1(): Bus {
		return new Bus(
			"NC-2882 Warakapola to bambalapitiya",
			"Warakapola-Nittambuwa-Kadawatha Interchange-Peliyagoda Interchange-Fort-Kolpety-Bambalapitiya",
			require("../assets/image-bus.jpg"),
			Route.warakapolaToBambalapitiyaRoute(),
		);
	}
}

export class Route{
	constructor(
		readonly start: Stopping, 
		readonly stop: Stopping, 
		readonly stoppings: Stopping[],
	) {}

	static warakapolaToBambalapitiyaRoute(): Route {
		return new Route(new Stopping("Warakapola",6.5, 80.8,"6.00 AM"),new Stopping("Bambalapitiya",6.5, 80.8,"8.00 AM"),[new Stopping("Kajugama",7.5, 81.8,"6.20 AM"),new Stopping("Pasyala",7.5, 81.8,"6.30 AM")]);
	}

}

export class Stopping {
	constructor(
		readonly name: string, 
		readonly lat: number, 
		readonly lng: number,
		readonly time: string,
	) {}
}
