import { Button, Card, Layout, List, Select, SelectItem, Text,Avatar, TopNavigation, TopNavigationAction, Input } from "@ui-kitten/components";
import React,{useState,useEffect,useRef} from "react";
import { useRoute } from "@react-navigation/native";
import { StyleSheet, View ,Text as RNText} from "react-native";
import { Passenger,Owner } from "./extra/data";
import AppStore from "../../../store/AppStore";
import { observer, inject} from "mobx-react";
import { useStore } from "mobx-store-provider";
import { CachedImage } from '@georstat/react-native-image-cache';
import { toJS } from "mobx";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import RBSheet from 'react-native-raw-bottom-sheet';
import { ArrowIosBackIcon } from "../../../components/icons";
import {
	MaterialIcons as MDIcon,
	Ionicons as Ionicons,
} from '@expo/vector-icons';
import { PlusOutlineIcon } from "../../../components/icons";
import AntDesign from '@expo/vector-icons/AntDesign';

import { RoutesValidationService } from "../../../services/routes-validation.service";
import ImageLoad from "../image-load/index";


const BusDriversList = ({ navigation }): React.ReactElement => {

	const route = useRoute();

	const appStore = useStore(AppStore);
	
	
	


	const renderBackAction = (): React.ReactElement => (
		<TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
	);

	const onAddPress = (): void => {
		navigation.navigate("BusDriversAdd");
	};

	const renderAddAction = (): React.ReactElement => (
		<TopNavigationAction icon={PlusOutlineIcon} onPress={onAddPress} />
	);

	


	const onActionsPress = (info): void => {
		//setName(info.name);
		//setMobileNumber(info.mobileNumber);
		//refRBSheetEdit.current.open()
	};

	

	const renderItem = (info): React.ReactElement => (
		<Card key={info.mobileNumber} style={styles.item} onPress={()=>onActionsPress(info)}>
			<View style={{ flexDirection: "row",  justifyContent: 'flex-start', margin: 2}}>
					<View style={{ padding: 5}}>
					<ImageLoad
							style={{ width: 45, height: 45 }}
							loadingStyle={{ size: 'large', color: 'blue' }}
							source={"https://routes.lk:7007/users/"+info.mobileNumber+"/profile-photo.jpg" }
							name={info.name}/>
					</View>
					<View style={{ padding: 5}}>
						<Text>{info.name}</Text>
						<Text>{info.mobileNumber}</Text>
					</View>
				</View>
		</Card>
	);


	return (
		
		<SafeAreaLayout style={styles.container} insets="top">
			{ route.params.readOnly  && (
			<TopNavigation title={props => (
				<RNText {...props} style={{fontWeight: "500", fontSize: 18}}>
				Bus Drivers
				</RNText>)} accessoryLeft={renderBackAction}  />
			)}

			{ !route.params.readOnly  && (
			<TopNavigation title={props => (
				<RNText {...props} style={{fontWeight: "500", fontSize: 18}}>
				Bus Drivers
				</RNText>)} accessoryLeft={renderBackAction} accessoryRight={renderAddAction} />
			)}		
				<View style={{ paddingHorizontal: 10 }}>
				{appStore.bus.drivers.map(function(info, index){
				return renderItem(info);		
				})}	
				</View>
		</SafeAreaLayout>	
		
	);
};

const styles = StyleSheet.create({

	container: {
		flex: 1,
	},
	listContent: {
		paddingHorizontal: 32,
		paddingVertical: 8,
	},
	button: {
		marginVertical: 8,
	},
	addButton: {
		marginVertical: 8,
		alignSelf: "flex-end"
	},

	item: {
		marginVertical: 8,
		padding: 0,

	},
	
	itemContent: {
		marginVertical: 8,
	},
	itemContentIcon: {
		fontSize: 20,
		color: '#666',
	}
	
});

export default observer(BusDriversList);
