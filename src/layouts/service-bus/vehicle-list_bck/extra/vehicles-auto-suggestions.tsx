import React, { memo, useCallback, useState } from 'react'
import { Text } from 'react-native'
import type { AutocompleteDropdownItem, IAutocompleteDropdownProps } from 'react-native-autocomplete-dropdown'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";

export const VehiclesSuggestions = ({ updateParent }) => {
  const [loading, setLoading] = useState(false)
  const [remoteDataSet, setRemoteDataSet] = useState<AutocompleteDropdownItem[] | null>(null)
  const [selectedItem, setSelectedItem] = useState<AutocompleteDropdownItem | null>(null)
  const appStore = useStore(AppStore);
  const [vehicleSuggestionsList, setVehicleSuggestionsList] = useState([
    { id: "1", title: appStore.searchContext.transportServiceName }
    ])


  const client = axios.create({
	  baseURL: 'https://routes.lk:7007'
  });

  const onVehicleSelect = (value): void => {
    console.log("### "+value?.title);
    console.log("### appStore.searchContext.setTransportServiceName:"+appStore.searchContext.transportServiceName);
	//	setSelectedItem(value?.title);
    appStore.searchContext.setTransportServiceName(value?.title);
    //setTransportServiceSuggestionsList([{ id: "1", title: value?.title }]);
	};

  const onClearPress = useCallback(() => {
    //appStore.searchContext.setTransportServiceName("Any");
   }, [])

 


  const getVehicleSuggestions = useCallback(async q => {
    const filterToken = q.toLowerCase()
    console.log('getSuggestions', q)
    if (typeof q !== 'string' || q.length < 3) {
      setVehicleSuggestionsList(null)
      return
    }
    setLoading(true)
    
    const config: AxiosRequestConfig = {
         params: {
				  'q': filterToken
			  },
        headers: {
          'Accept': 'application/json',
          'token': appStore.user.accessToken
        } as RawAxiosRequestHeaders,
      };
      try {	
        console.log(">>"+appStore.transportService.id);
        const response: AxiosResponse = await client.get(`/transportServices/`+appStore.transportService.id+`/vehicles/search` , config);
        setLoading(false);
        console.log(response.status);
        console.log(response.data);  

        console.log(response.data[0]);  
        updateParent(response.data[0].items);
       
        /*
        const items = await response.data;
        const suggestions = items
          .filter(item => item.name.toLowerCase().includes(filterToken))
        .map(item => ({
            id: item._id,
            title: item.name,
        }))
        setVehicleSuggestionsList(suggestions)
        */
        setLoading(false) 
      } catch(err) {
        console.log(err);
        setLoading(false);
      }  
    
    
  }, [])

  return (
    <>
      <AutocompleteDropdown
        dataSet={vehicleSuggestionsList}
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
        onSelectItem={onVehicleSelect}
        loading={loading}
        onChangeText={getVehicleSuggestions}
        suggestionsListTextStyle={{
          color: '#8f3c96',
        }}
      />
     
    </>
  )
}