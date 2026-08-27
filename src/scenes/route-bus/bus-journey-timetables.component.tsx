import { TopNavigation, TopNavigationAction ,IconElement} from "@ui-kitten/components";
import React,{useRef} from "react";
import { RefreshIcon } from "../../components/icons";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import { StyleSheet, Text as RNText } from "react-native";
import { ArrowIosBackIcon } from "../../components/icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AppStore from "../../store/AppStore";
import { useStore } from "mobx-store-provider";
import RBSheet from 'react-native-raw-bottom-sheet';
import { useRoute } from "@react-navigation/native";
import ContentView from "../../layouts/route-bus/bus-journey-timetables";
import { PlusOutlineIcon } from "../../components/icons";


export const RouteBusJourneyTimetablesScreen = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const appStore = useStore(AppStore);

	const [add, setAdd] = React.useState<boolean>(false);

	const ref = useRef<typeof RBSheet>();

	const onBackPress = (): void => {
		//console.log(" RouteBusJourneyStoppingsScreen appStore.routeBus.objectId::"+appStore.routeBus.objectId);
		navigation && navigation.navigate("RouteBusDetails", { id: appStore.routeBus.objectId,reload: false });
	};


	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={onBackPress} />
	);

	const setAddCallback = (localAdd): void => {
		setAdd(localAdd);
		appStore.routeBusTimetable.reset();
	}
	

	const onBusAddPress = () => {
		setAdd(!add);
		appStore.routeBusTimetable.reset();
		ref.current?.open();
	};

	return (
		<SafeAreaLayout style={styles.container} insets="top">
			<TopNavigation title={props => (
				<RNText {...props} style={{fontWeight: "500", fontSize: 18}}>
					{route.params?.journeyType == "RouteBusReturnJourney" && (
						<>Route Bus Return Journey Timetables </>
					)}
					{route.params?.journeyType == "RouteBusJourney" && (
						<>Route Bus Journey Timetables </>
					)}
					
				</RNText>)} accessoryLeft={renderBackAction}/>
				<ContentView navigation={navigation} addCallback={setAddCallback} add={add} ref={ref}/>
			
		</SafeAreaLayout>	
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
