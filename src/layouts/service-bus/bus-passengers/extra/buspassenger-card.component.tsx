import { List, Card, CardElement, CardProps, Text ,Divider, Avatar} from "@ui-kitten/components";
import React,{useRef, useState} from "react";
import { Image,View, SafeAreaView, TouchableOpacity, StyleSheet,ListRenderItemInfo} from "react-native";

import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { DayPicker } from '@routeslk/react-native-picker-weekday'
import { CachedImage } from '@georstat/react-native-image-cache';

import {
	MaterialIcons as MDIcon,
	FontAwesome as FAIcon,
} from '@expo/vector-icons';

import { useSafeAreaInsets } from "react-native-safe-area-context";


export const BusPassengerCard = ({ navigation }): CardElement => {

	const insetsConfig = useSafeAreaInsets();

	const appStore = useStore(AppStore);

	const [passenger, setPassenger] = useState(null);

	const [name, setName] = useState(null);

	const [journeyWeekdays, setJourneyWeekdays] = React.useState([2,3,4,5,6])

	const [returnJourneyWeekdays, setReturnJourneyWeekdays] = React.useState([2,3,4,5,6])



	const onPassengerPress = (info): void => {
		console.log("## onPassengerPress"+info.item.mobileNumber);
		
		//appStore.wipPassenger.addPassenger(info.item.name, info.item.mobileNumber, info.item.journeyStart, info.item.journeyStartLatitude, info.item.journeyStartLongitude,info.item.journeyEnd,info.item.journeyEndLatitude, info.item.journeyEndLongitude,info.item.returnJourneyStart, info.item.returnJourneyStartLatitude, info.item.returnJourneyStartLongitude,info.item.returnJourneyEnd,info.item.returnJourneyEndLatitude, info.item.returnJourneyEndLongitude,info.item.journeyWeekdays,info.item.returnJourneyWeekdays);
		//navigation && navigation.navigate("BusPassengerEditScreen", {id: "passenger-edit", mobileNumber: info.item.mobileNumber, index: info.index});
	};

	const ExpandableItem = ({ name, mobileNumber , journeyStart, journeyEnd, returnJourneyStart,returnJourneyEnd, journeyWeekdays, returnJourneyWeekdays}) => {
		const [expanded, setExpanded] = useState(false);
	  
		return (
			<Card>
			<View style={{ flexDirection: "row",  justifyContent: 'space-between', margin: 2}}>
				<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
					<View style={{ padding: 5}}>
					<Avatar {...{source:"https://routes.lk:7007/users/"+mobileNumber+"/profile-photo.jpg", maxAge: 1}} key={"profile_photo_"+mobileNumber} style={{ borderWidth: 2, borderColor: "grey"}}  ImageComponent={CachedImage} size="large"/>
					</View>
					<View style={{ padding: 5}}>
						<Text>{name}</Text>
						<Text>{mobileNumber}</Text>
					</View>
				</View>
				<View></View>
				<View style={{ flex: 1,  justifyContent: 'center',  alignItems: 'flex-end'}} >
				{!expanded && 
					<MDIcon name="arrow-forward" style={styles.itemContentIcon} onPress={() => setExpanded(!expanded)}></MDIcon>
				}
				{expanded && 
					<MDIcon name="arrow-back" style={styles.itemContentIcon} onPress={() => setExpanded(!expanded)}></MDIcon>
				}
				</View>
			</View>
			{expanded && 
			<View>
				<Divider></Divider>
				<View>
					<View>
						<Text style={{ flex: 1 , margin: 5}} category="h6">Journey</Text>
					</View>
					<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
						<Text style={{ flex: 1 , margin: 5, color: 'green'}} >START</Text>
						<Text style={{ flex: 1 , margin: 5}} >{journeyStart}</Text>
					</View>
					<View style={{flex: 1 ,flexDirection: "row", justifyContent: "space-between"}}>
						<Text style={{ flex: 1 , margin: 5, color: 'red'}}>END</Text>
						<Text style={{ flex: 1 , margin: 5}}>{journeyEnd}</Text>
					</View>
					<DayPicker
						weekdays={
							journeyWeekdays.split(',').map(function(item) {
								return parseInt(item, 10);
						})}
						setWeekdays={setJourneyWeekdays}
						activeColor='#142169'
						textColor='white'
						inactiveColor='grey'
						wrapperStyles={{ marginTop: 0}}
						/>
				</View>
			<View>
			<Divider></Divider>
				<View>
					<Text style={{ flex: 1 , margin: 5}} category="h6">Return</Text>
				</View>
				<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
					<Text style={{ flex: 1 , margin: 5, color: 'green'}} >START</Text>
					<Text style={{ flex: 1 , margin: 5}} >{returnJourneyStart}</Text>
				</View>
				<View style={{flex: 1 ,flexDirection: "row", justifyContent: "space-between"}}>
					<Text style={{ flex: 1 , margin: 5, color: 'red'}}>END</Text>
					<Text style={{ flex: 1 , margin: 5}}>{returnJourneyEnd}</Text>
				</View>
				<DayPicker
					weekdays={
						returnJourneyWeekdays.split(',').map(function(item) {
							return parseInt(item, 10);
					})}
					setWeekdays={setReturnJourneyWeekdays}
					activeColor='#142169'
					textColor='white'
					inactiveColor='grey'
					wrapperStyles={{ marginTop: 0}}
					/>
			</View>
			</View>
			
			}
		</Card>

		  
		);
	  };


	return (
		<SafeAreaView style={{ flex: 1,marginTop: 0-insetsConfig.top}}>
			<View style={styles.routeStoppingContainer}>
				<List style={styles.routeStoppingListContainer} 
				data={appStore.bus.passengers} 
				renderItem={({ item }) => <ExpandableItem name={item.name} mobileNumber={item.mobileNumber} journeyStart={item.journeyStart} journeyEnd={item.journeyEnd} returnJourneyStart={item.returnJourneyStart} returnJourneyEnd={item.returnJourneyEnd} journeyWeekdays={item.journeyWeekdays} returnJourneyWeekdays={item.returnJourneyWeekdays} />}
				/>
			</View>
			
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: -40,
	},
	item: {
		marginVertical: 8,
		flexDirection: "row",  
		justifyContent: 'space-between'
	},
	itemHeader: {
		height: 220,
	},
	itemContent: {
		marginVertical: 8,
	},
	itemFooter: {
		flexDirection: "row",
		marginHorizontal: -8,
	},
	iconButton: {
		paddingHorizontal: 0,
	},
	itemAuthoringContainer: {
		flex: 1,
		justifyContent: "center",
		marginHorizontal: 16,
	},
	
	routeContainer: {
		flexDirection: "row",
		justifyContent: 'flex-start',
		margin: 3,
		alignItems: "center",
		alignContent: 'flex-start',	
	},

	routeStoppingContainer: {
		flexDirection: "row",
		justifyContent: 'flex-start',	
		alignItems: "center",
		alignContent: 'flex-start',	
	},

	routeStoppingListContainer: {
		backgroundColor: 'white',
	},

	busStartIcon: {
		width: 15,
		height: 22,	
		marginLeft: 8,
		marginRight: 8,	
		marginTop: 10,
	},

	busEndIcon: {
		width: 15,
		height: 22,	
		marginLeft: 8,
		marginRight: 8,	
		marginBottom: 5,
		
	},
	itemContentIcon: {
		fontSize: 26,
		color: '#bbb',
	  },
});
