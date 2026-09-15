import { Button, Icon, CardElement, CardProps, Text ,Divider,Input} from "@ui-kitten/components";
import React,{ useRef ,useEffect, useCallback} from "react";
import { Alert,View, ScrollView, StyleSheet,Image, TouchableOpacity} from "react-native";

import AppStore from "../../../../store/AppStore";
import { toJS } from "mobx";
import { observer, inject} from "mobx-react";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';



const AutoComplete = () => {

	
	const refAutoComplete = useRef(null);

	useEffect(() => {
	

	}, []);
	
	

	return (
		<View>
			
			<GooglePlacesAutocomplete
				ref={refAutoComplete}
				styles={{
					container:{
						
						borderColor: "grey",
						borderWidth: 1
					},
					textInputContainer: {
						marginTop: 0,
						borderColor: 'grey',
						borderWidth: 1
					},
					textInput: {
						height: 38,
						color: 'grey',
						fontSize: 16
					}
				}}
				
				  renderRow={(rowData) => {
					const title = rowData.structured_formatting.main_text;
					var address=""
					if(rowData.structured_formatting.secondary_text){
						var lastIndex=rowData.structured_formatting.secondary_text.lastIndexOf(",");
						if(lastIndex>0)
				    		address = rowData.structured_formatting.secondary_text.slice(0,lastIndex);
					}
					
					return (
					 <View style={{ padding: 0 }}>
					  
					  <Text style={{ fontSize: 14 }}>{title}</Text>
					  <Text style={{ fontSize: 14, color: '#777777',}}>{address}</Text>
					 </View>
					 );
					}}
				  placeholder='Enter Location'
				  textInputProps={{
					selectionColor:"#142169",
					cursorColor:"#142169"
				 }}
				  minLength={2}
				  onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					console.log(data);
					console.log("*****");
					console.log(data.description)
				}}

				fetchDetails={true}

				onFail={(error) => console.error(error)}
			
				query={{
					key: 'AIzaSyBkNB1ivtCIuocCyLouDqAScIa755yctxs',
					language: 'en',
					components: 'country:lk',
					componentRestrictions:'country:lk',
				}}
			/>
		 
		</View>
	);
};

const styles = StyleSheet.create({
	errorLabel: {
		color: "#8B0000", 
		fontSize:12,
		padding: 10
	},
	spinnerTextStyle: {
		color: '#FFF'
	},
	container: {
		
	},
	nextButton: {
		marginVertical: 8,
		borderRadius:50, 
		margin: 10
	},
	logo: {
		width: 400,
		height: 300,
		
	},
	deletePhoto: {
		//backgroundColor: 'red',
		//width: 30,
		//height: 30,
		right: 60,
		marginLeft: 30,
		marginTop: 30,
		position: 'absolute',	
	},
	prevPhoto: {
		left: 30,
		top: '45%',
		marginLeft: 30,
		marginTop: 30,
		position: 'absolute',	
	},
	nextPhoto: {
		right: 60,
		top: '45%',
		marginLeft: 30,
		marginTop: 30,
		position: 'absolute',	
	}

	
});

export default observer(AutoComplete);
