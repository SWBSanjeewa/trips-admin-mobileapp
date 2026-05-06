import { List, Card, CardElement, CardProps, Text ,Divider, Button} from "@ui-kitten/components";
import React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";


export const BusCarouselCard = ({ item, index }) => {
	
	return (
		<Card style={styles.container} key={index}>
			<Text>{item.place}</Text>
			<Text>{item.time}</Text>
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	
});
