import { TopNavigation, TopNavigationAction ,OverflowMenu, MenuItem , Icon, IconElement } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
//import ContentView from "../../layouts/auth/bus";


import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { BusDetailsAddScreen } from "../auth/busdetails-add.component";
import { BusPhotosAddScreen } from "../auth/busphotos-add.component";
import { BusJourneyListScreen } from "../auth/busjourney-list.component";
import { BusReturnJourneyListScreen } from "../auth/bus-returnjourney-list.component";
import { BusPassengersListScreen } from "../auth/buspassengers-list.component";



const TopTab = createMaterialTopTabNavigator();

//export const SearchStatus = inject('store')( observer(({ store }) => {
//	const { status, term } = store;
//export const BusAddScreen = inject('store')( observer(({ store }): React.ReactElement => {
export const BusAddScreen = ({ navigation }): React.ReactElement => {

	//const { text, updateText, data, searchImages } = props.store;

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	return (
		
		<SafeAreaLayout style={styles.container} insets="top">
			
			<TopNavigation title="Bus Add" accessoryLeft={renderBackAction}/>
			<TopTab.Navigator
			   screenOptions={{
				tabBarLabelStyle: { fontSize: 12 , textTransform: 'none'},
				tabBarActiveTintColor:'#142169',
				tabBarInactiveTintColor: "black",
				tabBarIndicatorStyle: { backgroundColor:"#142169" }
			  }}
			  >
				<TopTab.Screen name="Details"  component={BusDetailsAddScreen} />
				<TopTab.Screen name="Journey" component={BusJourneyListScreen} />
				<TopTab.Screen name="Return" component={BusReturnJourneyListScreen} />
				<TopTab.Screen name="Passengers" component={BusPassengersListScreen} />
			</TopTab.Navigator>
			
		</SafeAreaLayout>
		
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

//export default inject("store")(observer(BusAddScreen));

