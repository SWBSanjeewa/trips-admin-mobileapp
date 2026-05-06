import { TopNavigation, TopNavigationAction,Button } from "@ui-kitten/components";
import React from "react";
import { StyleSheet ,Text} from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/transportservice-owner-list";

export const TransportserviceOwnerListScreen = ({ navigation }): React.ReactElement => {
	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const renderAddAction = (): React.ReactElement => (
		<TopNavigationAction icon={props => (
			<Button style={{ borderRadius:20, backgroundColor: "green"}} size="small" onPress={onAddOwnerPress()}> + Add </Button>
		)}  />
	);

	const onTransportServiceAddPress = (): void => {
		navigation && navigation.navigate("TransportServiceAdd");
	};

	

	return (
		
			<ContentView navigation={navigation} />
		
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});