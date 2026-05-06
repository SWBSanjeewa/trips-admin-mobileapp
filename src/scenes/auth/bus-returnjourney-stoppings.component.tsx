import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet,Text,SafeAreaView} from "react-native";
import { ArrowIosBackIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/bus-returnjourney-stoppings";

export const BusReturnJourneyStoppingsScreen = ({ navigation }): React.ReactElement => {

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	return (		
		<SafeAreaLayout style={{ flex: 1}} insets="top">
			<SafeAreaLayout style={{ flex: 1}} insets="bottom">
			<TopNavigation title={props => (
				<Text {...props} style={{fontWeight: "500", fontSize: 18}}>
					Return Journey Stoppings
				</Text>)} accessoryLeft={renderBackAction}  />
				<ContentView navigation={navigation}/>
		</SafeAreaLayout>
	</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});