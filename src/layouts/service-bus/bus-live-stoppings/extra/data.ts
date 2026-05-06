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
			"NC-2882 Warakapola to bambalapitiya",
			"Warakapola-Nittambuwa-Kadawatha Interchange-Peliyagoda Interchange-Fort-Kolpety-Bambalapitiya",
			require("../assets/image-bus.jpg"),
			Route.journey(),
			Route.returnJourney(),
			
		);
	}
}

export class Location {
	constructor(
		readonly googlePlaceId: string,
		readonly lat: number,
		readonly lng: number,

	) {}
}

export class Stopping {
	constructor(
		readonly place: string,
		readonly time: string,
		readonly location: Location,

	) {}
}

export class Passenger {
	constructor(
		readonly name: string,
		readonly phone: string,
		readonly journeyPickuplocation: Location,
		readonly journeyDropLocation: Location,
		readonly journeyDaysInWeek: string[],
		readonly retunJourneyPickuplocation: Location,
		readonly retunJourneyDropLocation: Location,
		readonly returnJourneyDaysInWeek: string[],

	) {}
}

export class Route {
	constructor(
		readonly start: string,
		readonly startTime: string,
		readonly end: string,
		readonly endTime: string,
		readonly stoppings: Stopping[],	
		readonly passengers: Passenger[],

	) {}

	static journey(): Route {
		return new Route(
			"Warakapola",
			"6.30AM",
			"Bambalapitiya",
			"8.00AM",
			[new Stopping("Kajugama","6.40AM",new Location("1",7.183527, 80.132246)),
			 new Stopping("Pasyala","6.50AM",new Location("2",7.168153, 80.124101)),
			 new Stopping("Nittambuwa","7.00AM",new Location("3",7.143362, 80.095629)),
			 new Stopping("Kalagedihena","7.10AM",new Location("4",7.118276, 80.059730))
			],
			[
			 new Passenger("Buddhika", "+94772149179",new Location("1",7.183527, 80.132246),new Location("1",6.895643, 79.855813),["Mon","Tue","Wed","Thu","Fri"],new Location("1",6.895643, 79.855813),new Location("1",7.183527, 80.132246),["Mon","Tue","Wed","Thu","Fri"]),
			 new Passenger("Buddhika", "+94772149179",new Location("1",7.183527, 80.132246),new Location("1",6.895643, 79.855813),["Mon","Tue","Wed","Thu","Fri"],new Location("1",6.895643, 79.855813),new Location("1",7.183527, 80.132246),["Mon","Tue","Wed","Thu","Fri"]),
		    ],
		);
	}

	static returnJourney(): Route {
		return new Route(
			"Bambalapitiya",
			"5.00PM",
			"Warakapola",
			"7.00PM",
			[],
			[],
		);
	}
}