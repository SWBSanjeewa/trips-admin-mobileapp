import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet,Text } from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/round-tour/tour-stopping-add";
import AppStore from "../../store/AppStore";
import { useStore } from "mobx-store-provider";



export const TourStoppingAddScreen = ({ navigation }): React.ReactElement => {
	
	const appStore = useStore(AppStore);

	const onBackPress = () => {
		//appStore.bus.reset();	
		//appStore.bus.setRouteType("tour");
		appStore.stopping.reset();
		navigation.navigate("TourList", {reload: false});
		
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackPress} />
	);
	
	
		return (
			<SafeAreaLayout style={styles.container} insets="top">
				<TopNavigation title={props => (
					<Text {...props} style={{fontWeight: "500", fontSize: 18}}>
					Add Tour Stopping
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