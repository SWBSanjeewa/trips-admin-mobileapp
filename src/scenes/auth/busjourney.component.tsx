import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/bus-journey-stoppings";



export const BusJourneyScreen = ({ navigation }): React.ReactElement => {
	

	return (
		<SafeAreaLayout style={styles.container} insets="top">
			<ContentView navigation={navigation} />
		</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});