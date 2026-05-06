import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet,Text,SafeAreaView} from "react-native";
import { ArrowIosBackIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/round-tour/tour-schedules";

export const TourSchedulesScreen = ({ navigation }): React.ReactElement => {

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	return (		
		
		<ContentView navigation={navigation} />
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});