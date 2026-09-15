import React, { memo, useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import type { AutocompleteDropdownItem, IAutocompleteDropdownProps } from 'react-native-autocomplete-dropdown'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";

export const RouteBusSuggestions = memo((props: Omit<IAutocompleteDropdownProps, 'ref' | 'dataSet'>) => {
  const [loading, setLoading] = useState(false)
  const [remoteDataSet, setRemoteDataSet] = useState<AutocompleteDropdownItem[] | null>(null)
  const [selectedItem, setSelectedItem] = useState<AutocompleteDropdownItem | null>(null)
  const appStore = useStore(AppStore);
  const [stoppingsSuggestionsList, setStoppingsSuggestionsList] = useState([])


  const client = axios.create({
	  baseURL: 'https://routes.lk:7007'
  });

  const onStoppingSelect = (value): void => {
    console.log("### "+value?.id+" "+value?.title+" "+value?.routeNo);
    
    //appStore.searchContext.setTo(value?.title);
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

    const suggestions = items.map(item => ({
        id: item.id || '0',
        title: item.routeNo+' - '+item.title || '',
      }))

    setRemoteDataSet(suggestions)
    setLoading(false)
  }, [])


  const getStoppingSuggestions = useCallback(async q => {
    const filterToken = q.toLowerCase()
    console.log('getStoppingSuggestions', q)
    if (typeof q !== 'string' || q.length < 3) {
      setStoppingsSuggestionsList(null)
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
       
        const response: AxiosResponse = await client.get(`/routebuses/search/titles/`+q , config);
        setLoading(false);
        console.log(response.status);
        console.log(response.data);  
        const items = await response.data;

        const suggestions = items
        .map(item => ({
            id: item._id,
            title: item.title,
            routeNo: item.routeNo,
            transportAuthority: item.transportAuthority,
            typeOfService: item.typeOfService
        }))
         console.log(suggestions);  
        setStoppingsSuggestionsList(suggestions)
        setLoading(false) 
      } catch(err) {
        console.log(err);
        setLoading(false);
      }  
    
    
  }, [])

  return (
    <>
      <AutocompleteDropdown
        dataSet={stoppingsSuggestionsList}
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
        onSelectItem={onStoppingSelect}
        loading={loading}
        renderItem={(item, searchText) => (
          <View>
            <View>
              <Text style={{fontSize: 16,fontWeight: '500'}}>{item.title}</Text>
              <Text style={{fontSize: 12, color: '#888', marginTop: 2,}}>{item.transportAuthority}-{item.typeOfService}</Text>
            </View>
          </View>
        )}
        onChangeText={getStoppingSuggestions}
        suggestionsListTextStyle={{
          color: '#210be1',
        }}
        {...props}
      />
     
    </>
	);
});