import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet ,Text} from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/route-bus/bus-journey-stoppings-list";
import { useRoute } from "@react-navigation/native";

export const RouteBusJourneyStoppingsListScreen = ({ navigation }): React.ReactElement => {
	
	const route = useRoute();

	const onBackPress = (): void => {
		navigation && navigation.navigate("RouteBusJourneyAdd",{"journeyType":route.params?.journeyType});
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackPress} />
	);


	return (
		<SafeAreaLayout style={styles.container} insets="top">
		<TopNavigation title={props => (
			<Text {...props} style={{fontWeight: "500", fontSize: 18}}>
				{route.params?.journeyType == "RouteBusReturnJourney" && (
					<>Route Bus Return Journey Stoppings</>
				)}
				{route.params?.journeyType == "RouteBusJourney" && (
					<>Route Bus Journey Stoppings</>
				)}
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