import React, { memo, useCallback, useState } from 'react'
import { IndexPath } from "@ui-kitten/components";
import { Text } from 'react-native'
import type { AutocompleteDropdownItem, IAutocompleteDropdownProps } from 'react-native-autocomplete-dropdown'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";

export const VehicleLayoutSuggestions = memo((props: Omit<IAutocompleteDropdownProps, 'ref' | 'dataSet'>& {
  updateParentSelectedDoorSeatsIndexState: any, updateParentSelectedEmptySeatsIndexState: any}) => {
  const [loading, setLoading] = useState(false)
  const [remoteDataSet, setRemoteDataSet] = useState<AutocompleteDropdownItem[] | null>(null)
  const [selectedItem, setSelectedItem] = useState<AutocompleteDropdownItem | null>(null)
  const appStore = useStore(AppStore);
  const [vehicleLayoutSuggestionsList, setVehicleLayoutSuggestionsList] = useState([])


  const client = axios.create({
	  baseURL: 'https://routes.lk:7007'
  });

  const onVehicleLayoutSelect = (value): void => {

    console.log("onVehicleLayoutSelect::");
    console.log(value);
    if(value){
      appStore.vehcleSeatLayout.populate(value);
      var indexPaths=[];
      appStore.vehcleSeatLayout.doorSeatNumbers.forEach(element => {
        indexPaths.push(new IndexPath(element));
      });
      props.updateParentSelectedDoorSeatsIndexState(indexPaths);

      var emptySpaceIndexPaths=[];
      appStore.vehcleSeatLayout.emptySeatNumbers.forEach(element => {
        emptySpaceIndexPaths.push(new IndexPath(element));
      });
      props.updateParentSelectedEmptySeatsIndexState(emptySpaceIndexPaths);
    }
	};

  const onClearPress = useCallback(() => {
    //appStore.searchContext.setTransportServiceName("Any");
   }, [])

  

  const getVehicleLayoutSuggestions = useCallback(async q => {
    const filterToken = q.toLowerCase()
   
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
        const response: AxiosResponse = await client.get(`/vehicleSeatLayouts/transportService/`+appStore.transportService.id+`/title/search/`+q , config);
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