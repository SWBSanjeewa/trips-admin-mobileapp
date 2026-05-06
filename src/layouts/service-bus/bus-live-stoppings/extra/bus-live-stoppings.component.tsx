import { Avatar, BottomNavigationTab, Divider, Layout, Button, Text, List } from "@ui-kitten/components";
import React,{useRef,useState,useCallback,useEffect} from "react";
import { ImageBackground, ListRenderItemInfo, StyleSheet, View , Alert,ActivityIndicator, TouchableOpacity} from "react-native";
import { useRoute } from "@react-navigation/native"
import { ScrollView } from 'react-native-virtualized-view';

import AppStore from "../../../../store/AppStore";
import { Stopping } from "./data";

import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import { format, fromUnixTime } from "date-fns";

import { observer} from "mobx-react";
import { useStore } from "mobx-store-provider";





const BusLiveStoppings = ({ navigation }): React.ReactElement => {

	const appStore = useStore(AppStore);

	const route = useRoute();

	const BASE_URL = 'https://routes.lk:7007';
	const client = axios.create({
		baseURL: BASE_URL,
		timeout: 500000,
	});

	const refStandard = useRef();

	const [imageUrl, setImageUrl] = useState<string>(BASE_URL+'/profile-photo.png');


	const [pickedImage, setPickedImage] = React.useState<any>(null);

	const [spinner, setSpinner] = React.useState<any>(false);


	const [loading, setLoading] = useState(true);

	const [name, setName] = useState("");

	const [mobileNumber, setMobileNumber] = useState("");

	const [updatestoppings,setUpdatestoppings] = useState([]);

	const [justPassedStoppingIndex,setJustPassedStoppingIndex] = useState(-1);

	const [justPassedStoppings,setJustPassedStoppings] =  useState([]);


	const config: AxiosRequestConfig = {
		headers: {
		  'Accept': 'application/json',
		} as RawAxiosRequestHeaders,
	  };



	const loadBusses = async() => {
		const busId = route.params.id
		const journeyType = "Journey";
		const date = format(new Date(), "yyyy-MM-dd");

		try{
			console.log("url##  /routes/stopping/"+busId+"/"+journeyType+"/"+date);
			const response: AxiosResponse = await client.get('/routes/stopping/'+busId+"/"+journeyType+"/"+date , config);
			console.log("Data:"+response.data);
			
			appStore.bus.journey.stoppings.forEach(function (element,index) {
				console.log("####"+element.place);
				var found = false
				if(response.data){
					
					response.data.stoppings.forEach(element2 => {
						if(element.place ==element2.place){
							console.log("$$ pushing:"+element.place);
							updatestoppings.push({place: element.place, time: element2.time, live: true});
							found=true;
						}
					});
				}
				if(!found){
					//console.log("$$$$ pushing:"+element.place);
					updatestoppings.push({place: element.place, time: element.time});
				}
				if(response.data.stopping){
					const justPassedStoppingPlace=response.data.stoppings[response.data.stoppings.length-1].place;
					if(element.place ==justPassedStoppingPlace){
						setJustPassedStoppingIndex(index);
						//setJustPassedStoppings(justPassedStoppings.push({element.place}));
						justPassedStoppings.push({place: element.place});
						//console.log("#### just passed index "+index);
					}
				}

			});		
		} catch(err) {
			console.log(err);
		}  
	}

	useEffect(() => {
		loadBusses()
		.then(fetchedData => {
			setLoading(false);
	    });
		//setTimeout(() => setLoading(false), 5000);
	}, []);


	const renderItem = (info: ListRenderItemInfo<Stopping>): React.ReactElement => (
		
		<View>
				<TouchableOpacity pointerEvents="none" style={{ flexDirection: "row", justifyContent: "space-even", padding: 0, margin: 2, backgroundColor: "#eee", borderWidth: 1, borderColor: '#bbb'}}>
					<View style={{ paddingHorizontal: 5}}>
						{info.index==0 && (
						<View  style={{  paddingTop: 15, margin: 0}}>
							<MaterialIcons name="circle" size={20} color="green" />
							<Feather name="more-vertical" size={20} color="green" />
						</View>
						)}
						{info.index==updatestoppings.length-1 && (
						<View style={{  padding: 0, margin: 0}}>
							<Feather name="more-vertical" size={20} color="green" />
							<MaterialIcons name="circle" size={20} color="red" />
						</View>
						)}

						{!(info.index==updatestoppings.length-1 || info.index==0) && (
						<View style={{  padding: 0, margin: 0}}>
							<Feather name="more-vertical" size={20} color="green" />
							<Entypo name="circle" size={20} color="green" />
							<Feather name="more-vertical" size={20} color="green" />
						</View>
						)}
					</View>
					
					
						{info.item.live && (
							<View style={{ paddingHorizontal: 5}}>	
								<Text>{info.item.place}</Text>
								<Text>{info.item.time}</Text>
							</View>	
						)}
						{!info.item.live && (
							<View style={{ paddingHorizontal: 5}}>	
								<Text style={{  color: "grey"}}>{info.item.place}</Text>
								<Text style={{  color: "grey"}}>{info.item.time}</Text>
							</View>	
						)}
					
				</TouchableOpacity>
			
		</View>
	);

	return (
		<ScrollView>
			
			<View >		
					<List
						contentContainerStyle={styles.listContent}
						data={updatestoppings}
						renderItem={renderItem}
						keyExtractor={item => item.place}/>
			</View>
		</ScrollView>
		
		
		
	);
	
};

const styles = StyleSheet.create({

	parentContainer: {
		flexWrap: "wrap",
		alignSelf: "center",
	},
	itemHeader: {
		fontWeight: "500",
		fontSize: 18
	},
	listContainer: {
		flex: 1,
		padding: 25,
	},
	  listTitle: {
		fontSize: 16,
		marginBottom: 20,
		color: 'black',
	  },
	  listButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
	  },
	  listIcon: {
		fontSize: 26,
		color: '#666',
		width: 60,
	  },
	  listDeleteIcon: {
		fontSize: 26,
		color: 'red',
		width: 60,
	  },
	  listLabel: {
		fontSize: 16,
	  },
	  item: {
		marginVertical: 8,
	  },
	  itemContentIcon: {
		fontSize: 26,
		color: '#666',
	  },

	  
	
});

export default observer(BusLiveStoppings);
