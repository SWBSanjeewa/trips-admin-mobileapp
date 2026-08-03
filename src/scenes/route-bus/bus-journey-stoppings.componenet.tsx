import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet ,Text} from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/route-bus/bus-journey-stoppings";
import { useRoute } from "@react-navigation/native";
import AppStore from "../../store/AppStore";
import { useStore } from "mobx-store-provider";

export const RouteBusJourneyStoppingsScreen = ({ navigation }): React.ReactElement => {
	
	const route = useRoute();
	const appStore = useStore(AppStore);

	const onBackPress = (): void => {
		//console.log(" RouteBusJourneyStoppingsScreen appStore.routeBus.objectId::"+appStore.routeBus.objectId);
		navigation && navigation.navigate("RouteBusDetails", { id: appStore.routeBus.objectId,reload: false });
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