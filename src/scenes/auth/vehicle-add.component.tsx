import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import { StyleSheet ,Text} from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/vehicle-add";
import AppStore from "../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";

export const VehicleAddScreen = ({ navigation }): React.ReactElement => {

	const appStore = useStore(AppStore);

	const onAddDriverPress = () => {
		appStore.bus.reset();	
		navigation.popTo('BusList', {reload: false});
	};

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onAddDriverPress} />
	);


	return (
		<SafeAreaLayout style={styles.container} insets="top">
			<TopNavigation title={props => (
				<Text {...props} style={{fontWeight: "500", fontSize: 18}}>
				Add Vehicle
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