import { List, Card, CardElement, CardProps, Text ,Avatar, Button, Divider} from "@ui-kitten/components";
import React from "react";
import { View, StyleSheet, Dimensions, ImageBackground } from "react-native";
import { CachedImage } from '@georstat/react-native-image-cache';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Linking} from 'react-native'


export const PassengerInfoCard = ({ name, mobileNumber,journeyStart, journeyEnd }) => {
	
	return (
		
		<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
			<View style={{ padding: 5}}>
				<Avatar {...{source:"https://routes.lk:7007/users/"+mobileNumber+"/profile-photo.jpg"}} key={"profile_photo_"+mobileNumber} style={{ borderWidth: 2, borderColor: "grey"}}  ImageComponent={CachedImage} size="large"/>
			</View>
			<View style={{ padding: 5}}>
				<Text style={{ margin: 5}} category="h6">{name}</Text>
				
				<View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5}}>
					<Text>{mobileNumber}</Text>
					<Ionicons name="call" size={24} color="green" onPress={()=>{Linking.openURL('tel:'+mobileNumber);}}/>
				</View>
				<Divider></Divider>
				<View>
					<Text style={{ margin: 5}} category="h6">Journey</Text>
				</View>
				<View style={{ flexDirection: "row", justifyContent: "space-between"}}>
					<Text style={{  margin: 5, color: 'green'}} >START</Text>
					<Text style={{  margin: 5}} >{journeyStart}</Text>
				</View>
				<View style={{flexDirection: "row", justifyContent: "space-between"}}>
					<Text style={{  margin: 5, color: 'red'}}>END</Text>
					<Text style={{  margin: 5}}>{journeyEnd}</Text>
				</View>
			</View>
			<View>
				
			</View>

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	iconButton: {
		paddingHorizontal: 0,
	},
	
});
