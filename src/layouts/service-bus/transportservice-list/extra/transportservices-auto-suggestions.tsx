import React, { memo, useCallback, useState } from 'react'
import { Text } from 'react-native'
import type { AutocompleteDropdownItem, IAutocompleteDropdownProps } from 'react-native-autocomplete-dropdown'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { useRoute } from "@react-navigation/native";

//const Child = ({ updateParent }) => {
// memo(({ onUpdate }) => {
//export const TranportServiceSuggestions = memo(({ onUpdate, props: Omit<IAutocompleteDropdownProps, 'ref' | 'dataSet'>}) => {
export const TranportServiceSuggestions = ({ updateParent }) => {
  const [loading, setLoading] = useState(false)
  const [remoteDataSet, setRemoteDataSet] = useState<AutocompleteDropdownItem[] | null>(null)
  const [selectedItem, setSelectedItem] = useState<AutocompleteDropdownItem | null>(null)
  const appStore = useStore(AppStore);
  const route = useRoute();

  const [transportServiceSuggestionsList, setTransportServiceSuggestionsList] = useState([
    { id: "1", title: appStore.searchContext.transportServiceName }
    ])


  const client = axios.create({
	  baseURL: 'https://routes.lk:7007'
  });

  const onTransportServiceSelect = (value): void => {
    console.log("### "+value?.title);
    console.log("### appStore.searchContext.setTransportServiceName:"+appStore.searchContext.transportServiceName);
	//	setSelectedItem(value?.title);
    appStore.searchContext.setTransportServiceName(value?.title);

    console.log("Value::"+value);
    console.log("Index::"+route.params?.index);
    if(route.params?.viewFrom == "tour-schedule"){
      appStore.tour.schedules[route.params?.index].setTransportServiceId(value?.id);
    }
    //setTransportServiceSuggestionsList([{ id: "1", title: value?.title }]);
	};

  const onClearPress = useCallback(() => {
    //appStore.searchContext.setTransportServiceName("Any");
   }, [])

  const getSuggestions = useCallback(async (q: string) => {
    const filterToken = q.toLowerCase()
    console.log('getSuggestions', filterToken)
    if (typeof q !== 'string' || q.length < 3) {
      setRemoteDataSet(null)
      return
    }
    setLoading(true)
    const response = await fetch('https://jsonplaceholder.typicode.com/posts').then(
      data =>
        new Promise(res => {
          setTimeout(() => res(data.json()), 2000) // imitate of a long response
        }),
    )
    const items = (await response) as Record<string, string>[]

    const suggestions = items
      .filter(item => item.title?.toLowerCase().includes(filterToken))
      .map(item => ({
        id: item.id || '0',
        title: item.title || '',
      }))

    setRemoteDataSet(suggestions)
    setLoading(false)
  }, [])


  const getTransportServiceSuggestions = useCallback(async q => {
    const filterToken = q.toLowerCase()
    console.log('getSuggestions', q)
    if (typeof q !== 'string' || q.length < 3) {
      setTransportServiceSuggestionsList(null)
      return
    }
    setLoading(true)
    
    const config: AxiosRequestConfig = {
        params: {
				  'q': filterToken
			  },
        headers: {
          'Accept': 'application/json',
          'token': appStore.user.accessToken,
          'query': filterToken
        } as RawAxiosRequestHeaders,
      };
      try {	
        console.log("config::"+JSON.stringify(config));
        console.log("query::"+q);
        const response: AxiosResponse = await client.get(`/transportServices/list` , config);
        setLoading(false);
        console.log(response.status);
        console.log(response.data);  
        updateParent(response.data);
        //setTransportServices(response.data); 
        const items = await response.data;
        const suggestions = items
          .filter(item => item.name.toLowerCase().includes(filterToken))
        .map(item => ({
            id: item._id,
            title: item.name,
        }))
        setTransportServiceSuggestionsList(suggestions)
        setLoading(false) 
      } catch(err) {
        console.log(err);
        setLoading(false);
      }  
    
    
  }, [])

  return (
    <>
      <AutocompleteDropdown
        dataSet={transportServiceSuggestionsList}
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
        renderItem={(item, text) => null}
        onSelectItem={onTransportServiceSelect}
        loading={loading}
        onChangeText={getTransportServiceSuggestions}
        suggestionsListTextStyle={{
          color: '#8f3c96',
        }}
       
      />
     
    </>
  )
}