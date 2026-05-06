import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet ,Text} from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/bus-journey-list";

export const BusJourneyListScreen = ({ navigation }): React.ReactElement => {
	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);


	return (
		<SafeAreaLayout style={styles.container} insets="top">
		<TopNavigation title={props => (
			<Text {...props} style={{fontWeight: "500", fontSize: 18}}>
			Journey
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