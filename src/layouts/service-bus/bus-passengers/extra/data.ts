import { ImageSourcePropType } from "react-native";

export class Bus {
	constructor(
		readonly title: string,
		readonly description: string,
		readonly image: ImageSourcePropType,
		readonly journey: Route,
		readonly returnJourney: Route ,
		readonly passengers: Passenger[] ,
		
	) {}

	static bus1(): Bus {
		return new Bus(
			"NC-2882 Warakapola to bambalapitiya",
			"Warakapola-Nittambuwa-Kadawatha Interchange-Peliyagoda Interchange-Fort-Kolpety-Bambalapitiya",
			require("../assets/image-bus.jpg"),
			Route.journey(),
			Route.returnJourney(),
			Passenger.pasengers(),
			
		);
	}
}

export class Passenger {
	constructor(
		readonly name: string,
		readonly mobileNumber: string,
		readonly journeyStartPlace: string,
		readonly journeyEndPlace: string,
		readonly journeyDays: string,
		readonly returnStartPlace: string,
		readonly returnEndPlace: string,
		readonly returnDays: string,

	) {}

	static pasengers(): Passenger[] {
		return [ new Passenger("Buddhika","0772149179","Kalagedihena Glasgow Hotel","Bambalapitiya Dialog Arcade","Tue,Thu",
		"Bambalapitiya Cargils Bank","Kalagedihena Glasgow Hotel","Tue,Thu"),
		new Passenger("Ishan","0772189881","Tracmo Junction","Bambalapitiya Dialog Arcade","Tue,Thu",
		"Bambalapitiya Cargils Bank","Tracmo Junction","Tue,Thu")
	    ];
	}
}

export class Stopping {
	constructor(
		readonly place: string,
		readonly time: string,

	) {}
}

export class Route {
	constructor(
		readonly start: string,
		readonly startTime: string,
		readonly end: string,
		readonly endTime: string,
		readonly stoppings: Stopping[],	

	) {}

	static journey(): Route {
		return new Route(
			"Warakapola",
			"6.30AM",
			"Bambalapitiya",
			"8.00AM",
			[new Stopping("Kajugama","6.40AM"),new Stopping("Pasyala","6.50AM"),new Stopping("Nittambuwa","7.00AM"),new Stopping("Kalagedihena","7.10AM")],
		);
	}

	static returnJourney(): Route {
		return new Route(
			"Bambalapitiya",
			"5.00PM",
			"Warakapola",
			"7.00PM",
			[]
		);
	}
}
