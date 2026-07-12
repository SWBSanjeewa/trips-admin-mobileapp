import { TopNavigationAction,Input, Button, Card, Avatar, Text ,Divider, IconElement} from "@ui-kitten/components";
import React,{useState,useEffect,useRef,forwardRef,useImperativeHandle} from "react";
import { View, ScrollView, TouchableOpacity, Text as RNText, StyleSheet, ActivityIndicator, Alert,ListRenderItemInfo} from "react-native";
import { useRoute } from "@react-navigation/native";
import AppStore from "../../../../store/AppStore";
import { useStore } from "mobx-store-provider";
import { RouteBus } from "./data";

import { CachedImage } from '@georstat/react-native-image-cache';

import {routeBusTypes, operatorTypes, getRouteBusThemePhotoUrl}  from "../../../../app/routes-common";

import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import { useSafeAreaInsets } from "react-native-safe-area-context";
import RBSheet from 'react-native-raw-bottom-sheet';

import { DayPicker } from '@routeslk/react-native-picker-weekday';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Image } from 'expo-image';


import { SafeAreaLayout } from "../../../../components/safe-area-layout.component";

const client = axios.create({
	baseURL: 'https://routes.lk:7007'
});

import { toJS } from "mobx";

import {
	MaterialIcons as MDIcon,
} from '@expo/vector-icons';

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import {routeTypes, getRouteColor, vehcileTypes, getVehicleColor}  from "../../../../app/routes-common";

import EvilIcons from '@expo/vector-icons/EvilIcons';

import { useFocusEffect } from '@react-navigation/native';

// forwardRef(function MyInput(props, ref) {
// const MyInput = forwardRef(function MyInput(props, ref) {
   // const FancyButton = React.forwardRef((props, ref) => (
//const BusDetailsCard =  forwardRef(function(navigation,ref){
	//React.forwardRef<View, IButton>((props, ref) => {
//const BusDetailsCard =  forwardRef((navigation,ref) => {
//	const BusDetailsAddCard = ({ navigation }): React.ReactElement => {
//	https://github.com/gorhom/react-native-bottom-sheet/issues/742
//const BusDetailsCard =  React.forwardRef<BottomSheet>({navigation, bottomSheetRef} => {
//const BusDetailsCard =  React.forwardRef<BottomSheet>(({navigation},bottomSheetRef): React.ReactElement => {
// Type 'ForwardedRef<unknown>' is not assignable to type 'Ref<BottomSheetMethods>'.

//const BusDetailsCard = forwardRef(({ navigation }, bottomSheetRef) => {
//	React.forwardRef(({ name }, ref) => {
const MyInput = ({ value, onChange }) => (
  <input value={value} onChange={onChange}/>
);

export default MyInput;