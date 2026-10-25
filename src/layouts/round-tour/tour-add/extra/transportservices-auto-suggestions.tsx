import React, { useEffect, memo, useCallback, useState,useRef } from 'react'
import { IndexPath } from "@ui-kitten/components";
import { Text } from 'react-native'
import type { AutocompleteDropdownItem, IAutocompleteDropdownProps } from 'react-native-autocomplete-dropdown'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";

export const TransportServicesSuggestions = memo((props: Omit<IAutocompleteDropdownProps, 'ref' | 'dataSet'>& {vehicleSeatLayoutDropdownControllerRef : useRef}) => {
  const [loading, setLoading] = useState(false)
  const [remoteDataSet, setRemoteDataSet] = useState<AutocompleteDropdownItem[] | null>(null)
  const [selectedItem, setSelectedItem] = useState<AutocompleteDropdownItem | null>(null)
  const appStore = useStore(AppStore);
  const [transportServicesSuggestionsList, setTransportServicesSuggestionsList] = useState([]);

  const [transportServicesSuggestionsInitialValue, setTransportServicesSuggestionsInitialValue] = useState({id: appStore.user.defaultTransportServiceId});

  const [transportServiceErrorMessage, setTransportServiceErrorMessage] = React.useState<string>("");

  const dropdownControllerRef = useRef(null);


  const client = axios.create({
	  baseURL: 'https://routes.lk:7007'
  });

  const loadTransportServices = async() => {
        console.log("Load transport services...");
        const config: AxiosRequestConfig = {
          headers: {
            'Accept': 'application/json',
            'token': appStore.user.accessToken
          } as RawAxiosRequestHeaders,
          };
          try {	
          const response: AxiosResponse = await client.get(`/transportServices/list` , config);
          setLoading(false);
          console.log(response.status);
          console.log(response.data);
          if(response.data !=null && response.data.length > 0 ) {
            //setTransportServices(response.data);  
             const formattedData = response.data.map(item => ({
              ...item,
              title: item.name // Maps 'name' to 'title'
            }));
            setTransportServicesSuggestionsList(formattedData);
            
            console.log("Name::"+response.data[0].name);
            console.log("Id::"+response.data[0]._id);
           
            //appStore.tour.setTransportServiceId(response.data[0]._id);
            //appStore.tour.setTransportServiceName(response.data[0].name);
            //appStore.tour.setTransportServiceThemeColor(response.data[0].themeColor);
          }else{
            setTransportServiceErrorMessage("Please create Transport Service first.");
          }
          } catch(err) {
          console.log(err);
          setLoading(false);
          }  
        
      };

   const loadDefaultTransportService = async() => {
        console.log("Load transport services...");
        const config: AxiosRequestConfig = {
          headers: {
            'Accept': 'application/json',
            'token': appStore.user.accessToken
          } as RawAxiosRequestHeaders,
          };
          try {	
          const response: AxiosResponse = await client.get(`/transportServices/defaultlist/`+appStore.user.defaultTransportServiceId , config);
          setLoading(false);
          console.log(response.status);
          console.log(response.data);
          if(response.data !=null && response.data.length > 0 ) {
            //setTransportServices(response.data);  
             const formattedData = response.data.map(item => ({
              ...item,
              title: item.name, // Maps 'name' to 'title'
              id: item._id
            }));
            setTransportServicesSuggestionsList(formattedData);
           // setTransportServicesSuggestionsInitialValue({"id": appStore.user.defaultTransportServiceId });
           console.log(response.data[0]);
           console.log(dropdownControllerRef.current);
            if (dropdownControllerRef.current) {
              dropdownControllerRef.current.setItem(formattedData[0]);
              appStore.tour.setTransportServiceId(formattedData[0]?._id);
            }

            


            
           // transportServicesSuggestionsList.push({title: response.data.name});
            
           // console.log("Name::"+response.data[0].name);
           // console.log("Id::"+response.data[0]._id);
            //appStore.tour.setTransportServiceId(response.data[0]._id);
            //appStore.tour.setTransportServiceName(response.data[0].name);
            //appStore.tour.setTransportServiceThemeColor(response.data[0].themeColor);
          }else{
            setTransportServiceErrorMessage("Please create Transport Service first.");
          }
          } catch(err) {
            console.log(err);
            setLoading(false);
          }  
        
      };

  const onTransportServicesSelect = async(value) =>{
    if(value){

      console.log(value);
      appStore.tour.setTransportServiceId(value?._id);
      console.log(props.vehicleSeatLayoutDropdownControllerRef.current);
      if (props.vehicleSeatLayoutDropdownControllerRef.current) {
        props.vehicleSeatLayoutDropdownControllerRef.current.setItem({});
        appStore.tour.setVehicleSeatLayoutId("");
      }

      /*
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
      */
     
    }
	}

  const onClearPress = useCallback(() => {
     loadTransportServices();
   }, [])


   useEffect(() => {
      const fetch = async ()=>{
        await loadDefaultTransportService();
        setLoading(false);
      }
  
      fetch();	
  
    }, []);

  

  const getTransportSerivcesSuggestions = useCallback(async q => {
    const filterToken = q.toLowerCase()

    if (typeof q !== 'string' || q.length == 0) {
      loadTransportServices()
      return
    }
   
    if (typeof q !== 'string' || q.length < 3) {
      setTransportServicesSuggestionsList(null)
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
        const response: AxiosResponse = await client.get(`/transportServices/name/search/`+q , config);
        setLoading(false);
       
        console.log("##"+response.data);  
        const items = await response.data;

        const formattedData = response.data.map(item => ({
        ...item,
        title: item.name // Maps 'name' to 'title'
      }));
      
         console.log("## suggestions:"+items);  
         console.log(items);  
        setTransportServicesSuggestionsList(formattedData)
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
          dropdownControllerRef.current = instance;
        }}
        dataSet={transportServicesSuggestionsList}
        closeOnBlur={false}
        useFilter={false}
        initialValue={transportServicesSuggestionsInitialValue}
        onClear={onClearPress}
        clearOnFocus={false}
        textInputProps={{
          //placeholder: appStore.searchContext.transportServiceName,
        }}
        inputContainerStyle={{
          backgroundColor: '#eee',
          borderRadius: 25,
        }}
        onSelectItem={onTransportServicesSelect}
        loading={loading}
        onChangeText={getTransportSerivcesSuggestions}
        suggestionsListTextStyle={{
          color: '#210be1',
        }}
        {...props}
      />
     
    </>
  )
})