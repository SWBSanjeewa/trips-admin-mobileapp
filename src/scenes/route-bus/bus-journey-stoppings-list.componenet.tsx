import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet ,Text} from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/route-bus/bus-journey-stoppings-list";

export const RouteBusJourneyStoppingsListScreen = ({ navigation }): React.ReactElement => {
	
	const onBackPress = (): void => {
		navigation && navigation.navigate("RouteBusJourneyAdd");
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackPress} />
	);


	return (
		<SafeAreaLayout style={styles.container} insets="top">
		<TopNavigation title={props => (
			<Text {...props} style={{fontWeight: "500", fontSize: 18}}>
			Route Bus Journey Stoppings
			</Text>)} accessoryLeft={renderBackAction} />
		<ContentView navigation={navigation} />
	</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});