import { TopNavigation, TopNavigationAction ,OverflowMenu, MenuItem , Icon, IconElement } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";



import ContentView from "../../layouts/service-bus/location-add";



export const LocationAddScreen = ({ navigation }): React.ReactElement => (
	<ContentView navigation={navigation} />
);