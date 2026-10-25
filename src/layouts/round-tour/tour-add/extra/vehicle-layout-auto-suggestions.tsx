import React, { memo, useCallback, useState, useEffect,useRef } from 'react'
import { IndexPath } from "@ui-kitten/components";
import { Text } from 'react-native'
import type { AutocompleteDropdownItem, IAutocompleteDropdownProps } from 'react-native-autocomplete-dropdown'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";

export const VehicleLayoutSuggestions = memo((props: Omit<IAutocompleteDropdownProps, 'ref' | 'dataSet'>& {vehicleSeatLayoutDropdownControllerRef : useRef}) => {
  const [loading, setLoading] = useState(false)
  const [remoteDataSet, setRemoteDataSet] = useState<AutocompleteDropdownItem[] | null>(null)
  const [selectedItem, setSelectedItem] = useState<AutocompleteDropdownItem | null>(null)
  const appStore = useStore(AppStore);
  const [vehicleLayoutSuggestionsList, setVehicleLayoutSuggestionsList] = useState([])
  const dropdownControllerRef = useRef(null);

  const client = axios.create({
	  baseURL: 'https://routes.lk:7007'
  });

  const onVehicleLayoutSelect = async(value) =>{
    if(value){

      const config: AxiosRequestConfig = {
        headers: {
          'Accept': 'application/json',
          'token': appStore.user.accessToken
        } as RawAxiosRequestHeaders,
      };
  
  
      try {
        
       // console.log("/transportServices/"+appStore.transportService.id+"/vehicles/"+props.vehicleIndex+"/seatLayout/edit");
        const response: AxiosResponse = await client.put("/transportServices/"+appStore.transportService.id+"/vehicles/"+props.vehicleIndex+"/seatLayout/edit", appStore.vehicle, config);
        if(response.status == 200){
          appStore.vehcleSeatLayout.populate(value);
          appStore.vehicle.setVehicleSeatLayoutId(value.id);
        }
        
        
      } catch(err) {
        console.log(err);
      }
     
    }
	}

  const onClearPress = useCallback(() => {
    //appStore.searchContext.setTransportServiceName("Any");
   }, [])

  
  const loadSeatLayouts = async() => {
   
    const config: AxiosRequestConfig = {
      headers: {
        'Accept': 'application/json',
        'token': appStore.user.accessToken
      } as RawAxiosRequestHeaders,
      };
      try {	
        console.log(`/vehicleSeatLayouts/transportService/`+appStore.tour.transportServiceId+`/title/list`);
      const response: AxiosResponse = await client.get(`/vehicleSeatLayouts/transportService/`+appStore.tour.transportServiceId+`/title/list` , config);
      setLoading(false);
      console.log(response.status);
      console.log(response.data);
      if(response.data !=null && response.data.length > 0 ) {
        setVehicleLayoutSuggestionsList(response.data);
       // console.log("Name::"+response.data[0].name);
        //console.log("Id::"+response.data[0]._id);
       // appStore.tour.setTransportServiceId(response.data[0]._id);
       // appStore.tour.setTransportServiceName(response.data[0].name);
       // appStore.tour.setTransportServiceThemeColor(response.data[0].themeColor);
      }else{
        setVehicleLayoutSuggestionsList("Please create Transport Service first.");
      }
      } catch(err) {
      console.log(err);
      setLoading(false);
      }  
    
  };

  useEffect(() => {
        const fetch = async ()=>{
          
          await loadSeatLayouts();
          setLoading(false);
        }
    
        fetch();	
    
      }, []);


  const getVehicleLayoutSuggestions = useCallback(async q => {
    const filterToken = q.toLowerCase()
   
    if (typeof q !== 'string' || q.length == 0) {
      setVehicleLayoutSuggestionsList(null);
      loadSeatLayouts()
      return
    }

    if (typeof q !== 'string' || q.length < 3) {
      setVehicleLayoutSuggestionsList(null)
      return
    }
    setLoading(true)
    
    const config: AxiosRequestConfig = {
        headers: {
          'Accept': 'application/json',
          'token': appStore.user.accessToken
        } as RawAxiosRequestHeaders,
      };
      try {	
        const response: AxiosResponse = await client.get(`/vehicleSeatLayouts/transportService/`+appStore.tour.transportServiceId+`/title/search/`+q , config);
        setLoading(false);
       
        console.log("##"+response.data);  
        const items = await response.data;
      
        console.log("## suggestions:"+items);  
        console.log(items);  
        setVehicleLayoutSuggestionsList(items)
        setLoading(false) 
      } catch(err) {
        console.log(err);
        setLoading(false);
      }  
    
    
  }, [])

  return (
    <>
      <AutocompleteDropdown
        controller={(instance) => {
          props.vehicleSeatLayoutDropdownControllerRef.current = instance;
        }}
        dataSet={vehicleLayoutSuggestionsList}
        closeOnBlur={false}
        useFilter={false}
        initialValue='1'
        onClear={onClearPress}
        clearOnFocus={false}
        textInputProps={{
          //placeholder: appStore.searchContext.transportServiceName,
        }}
        inputContainerStyle={{
          backgroundColor: '#eee',
          borderRadius: 25,
        }}
        onSelectItem={onVehicleLayoutSelect}
        loading={loading}
        onChangeText={getVehicleLayoutSuggestions}
        suggestionsListTextStyle={{
          color: '#210be1',
        }}
        {...props}
      />
     
    </>
  )
})