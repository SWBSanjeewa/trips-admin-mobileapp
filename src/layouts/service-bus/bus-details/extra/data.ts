import { ImageSourcePropType } from "react-native";

export class Bus {
	constructor(
		readonly _id: string,
		readonly title: string,
		readonly description: string,
		readonly image: ImageSourcePropType,
		readonly photos: string[],
	) {}
}

export class Passenger {
	constructor(
		readonly name: string,
		readonly mobileNumber: string
	) {}
}

export class Owner {
	constructor(
		readonly name: string,
		readonly mobileNumber: string
	) {}

}

routeTypestaff-service #483248
 LOG  routeTypestaff-service #483248
 LOG  id:::[object Object]
 LOG  routeTypestaff-service #483248
 LOG  routeTypestaff-service #483248
 LOG  params.id:67b87b24ec66973283e5f393
 LOG  {"key":"BusDetails-1JIpj-CeFMfFpGRlKd13T","name":"BusDetails","params":{"id":"67b87b24ec66973283e5f393","journeyStartLatitude":"6.032904","journeyStartLongitude":"80.215757","returnJourneyStartLatitude":"6.933668","returnJourneyStartLongitude":"79.850047"}}
 LOG  200
 LOG  ##### appStore.user.mobileNumber::0772149179
 LOG  Bus from id:[object Object]
 LOG  {"_id":"67b87b24ec66973283e5f393","id":"c0d7a7fe-0af9-4b89-b272-aae7eef41ed0","registrationNumber":"","title":"Galle to Colombo","description":"Galle-Highway-Kottawa-Maharagama-Colombo","vehicleType":"Bus","routeType":"staff-service","noOfSeats":"35","drivers":[{"name":"Daniel 