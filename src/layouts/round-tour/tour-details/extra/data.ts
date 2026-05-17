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

