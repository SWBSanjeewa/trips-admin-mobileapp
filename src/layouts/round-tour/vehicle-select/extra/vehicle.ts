import { ImageSourcePropType } from "react-native";

export class Vehicle {
	constructor(
		readonly id: string,
		readonly title: string,
		readonly vehicleType: string,
		readonly regNumber: string,
		readonly noOfSeats: string,
		readonly photos: string[],
	) {}

	/*
	vehicleType: types.optional(types.string, "Van"),
	  id: types.optional(types.string, ""),
	  title: types.optional(types.string, ""),
	  regNumber: types.optional(types.string, ""),
	  noOfSeats: types.optional(types.string, ""),
	  photos: types.array(types.string),
	*/
}
