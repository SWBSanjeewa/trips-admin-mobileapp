import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import React,{useRef} from "react";
import { ScrollView, StyleSheet ,Text} from "react-native";

import { BusSearchIcon } from "../../components/icons";
import { PlusOutlineIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import ContentView from "../../layouts/service-bus/vehicle-list";
import AppStore from "../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { ArrowIosBackIcon } from "../../components/icons";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import RBSheet from 'react-native-raw-bottom-sheet';

export const TransportServiceVehicleListScreen = ({ navigation }): React.ReactElement => {
	
	const refFrom = useRef<typeof GooglePlacesAutocomplete>();

	const refTo = useRef<typeof GooglePlacesAutocomplete>();

	const refScrollView = useRef<typeof ScrollView>();

	const ref = useRef<typeof RBSheet>();

	const appStore = useStore(AppStore);
	
	const [search, setSearch] = React.useState<boolean>(false);

	const [add, setAdd] = React.useState<boolean>(false);
	

	const renderAddAction = (): React.ReactElement => (
		<>
		<TopNavigationAction icon={BusSearchIcon} onPress={onBusSearchPress} />
		<TopNavigationAction icon={PlusOutlineIcon} onPress={onVehicleAddPress} />
		</>		
	);

	const setSearchCallback = (localSearch): void => {
		setSearch(localSearch);
	}

	const setAddCallback = (localAdd): void => {
		setAdd(localAdd);
		appStore.vehicle.reset();
	}

	const onVehicleAddPress = () => {
		setAdd(!add);
		appStore.vehicle.reset();
		
		//ref.current?.open();
	};

	

	const onBackrPress = () => {
			appStore.vehicle.reset();
			appStore.vehicles.reset();
			navigation.goBack();
		};
	
		const renderBackAction = (): React.ReactElement => (
			<TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackrPress} />
		);

	const onBusSearchPress = (): void => {
		console.log("Bus Search");
		setSearch(!search);
		console.log("appStore.searchContext.from:"+appStore.searchContext.from);
		refFrom.current?.setAddressText(appStore.searchContext.from);
		refTo.current?.setAddressText(appStore.searchContext.to);
		refScrollView.current?.scrollTo({}); 
		//appStore.searchContext.setClose(false);
	};

	return (
		<SafeAreaLayout style={styles.container} insets="top">
			<SafeAreaLayout style={styles.container} insets="bottom">
			<TopNavigation title={props => (	
				<Text style={{fontWeight: '500', fontSize: 18}}>
					Vehicles
				</Text>)}  accessoryLeft={renderBackAction} accessoryRight={renderAddAction}/>
			<ContentView navigation={navigation} searchCallback={setSearchCallback} search={search} addCallback={setAddCallback} add={add} ref={ref}/>
		</SafeAreaLayout>
		</SafeAreaLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});