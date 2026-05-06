import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React from "react";
import {  Text as RNText,StyleSheet} from "react-native";

import { ArrowIosBackIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/transportservice-list";
import AppStore from "../../store/AppStore";
import { useStore } from "mobx-store-provider";

export const TransportServiceListScreen = ({ navigation }): React.ReactElement => {

	const appStore = useStore(AppStore);

	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const renderAddAction = (): React.ReactElement => (
		<TopNavigationAction icon={PlusOutlineIcon} onPress={onTransportServiceAddPress} />
	);

	const onTransportServiceAddPress = (): void => {
		appStore.transportService.addOwner(appStore.user.name, appStore.user.mobileNumber);
		console.log("#### countryCode"+appStore.user.countryCode);
		appStore.transportService.setCountryCode(appStore.user.countryCode);
		navigation && navigation.navigate("TransportServiceAdd");
	};

	

	return (
		<SafeAreaLayout style={styles.container} insets="top">
			<TopNavigation title={props => (
				<RNText {...props} style={{fontWeight: 'bold', fontSize: 18}}>
				Transport Services
				</RNText>)} accessoryLeft={renderBackAction} accessoryRight={renderAddAction} />
			<ContentView navigation={navigation} />
		</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});