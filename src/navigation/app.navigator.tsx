import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@ui-kitten/components";
import React, { useContext } from "react";

import { Theming } from "../services/theme.service";


import { ForgotPasswordScreen } from "../scenes/auth/forgot-password.component";
import { SignInScreen } from "../scenes/auth/sign-in.component";
import { SignUpScreen } from "../scenes/auth/sign-up.component";
import { OTPVerifyScreen } from "../scenes/auth/otp-verify.component";
import { BusListScreen } from "../scenes/auth/bus-list.component";
import { BusScreen } from "../scenes/auth/bus.component";
import { BusEditScreen } from "../scenes/auth/bus-edit.component";
import { LocationAddScreen } from "../scenes/auth/location-add.component";
import { BusPassengersAddScreen } from "../scenes/auth/buspassengers-add.component";
import { BusStoppingAddScreen } from "../scenes/auth/bus-stopping-add.component";
import { BusStoppingEditScreen } from "../scenes/auth/bus-stopping-edit.component";
import { BusPassengerEditScreen } from "../scenes/auth/buspassenger-edit.component";
import { BusPassengerScreen } from "../scenes/auth/buspassenger.component";
import { BusHomeScreen } from "../scenes/auth/bus-home.component";
import { UserProfileScreen } from "../scenes/auth/user-profile.component";
import { BusLiveScreen } from "../scenes/auth/bus-live.component";
import { BusLiveStoppingsScreen } from "../scenes/auth/bus-live-stoppings.component";
import { BusJourneyStoppingsScreen } from "../scenes/auth/bus-journey-stoppings.component";
import { BusReturnJourneyStoppingsScreen } from "../scenes/auth/bus-returnjourney-stoppings.component";
import { TransportServiceListScreen } from "../scenes/auth/transportservice-list.component";
import { TransportServiceAddScreen } from "../scenes/auth/transportservice-add.component";
import { TransportServiceScreen } from "../scenes/auth/transportservice.component";
import { TransportserviceOwnerListScreen } from "../scenes/auth/transportservice-owner-list.component";
import { TransportServiceDriversListScreen } from "../scenes/auth/transportservicedrivers-list.component";

import { BusAddScreen } from "../scenes/auth/bus-add.component";
import { BusJourneyListScreen } from "../scenes/auth/busjourney-list.component";
import { BusReturnJourneyListScreen } from "../scenes/auth/bus-returnjourney-list.component";

import { BusDriversListScreen } from "../scenes/auth/bus-drivers-list.component";
import { BusDriversAddScreen } from "../scenes/auth/bus-drivers-add.component";
import { BusPassengersListScreen } from "../scenes/auth/buspassengers-list.component";
import { BusDetailsScreen } from "../scenes/auth/bus-details.component";
import { BusPassengersWatchersListScreen } from "../scenes/auth/buspassengers-watchers-list.component";


import { RouteBusAddScreen } from "../scenes/route-bus/bus-add.component";
import { RouteBusEditScreen } from "../scenes/route-bus/bus-edit.component";
import { RouteBusListScreen } from "../scenes/route-bus/bus-list.component";
import { RouteBusDetailsScreen } from "../scenes/route-bus/bus-details.component";
import { RouteBusJourneyListScreen } from "../scenes/route-bus/busjourney-list.component";
import { RouteBusJourneyAddScreen } from "../scenes/route-bus/bus-journey-add.component";
import { RouteBusJourneyStoppingsListScreen } from "../scenes/route-bus/bus-journey-stoppings-list.componenet";
import { RouteBusJourneyStoppingsListEditScreen } from "../scenes/route-bus/bus-journey-stoppings-list-edit.component";
import { RouteBusStoppingEditScreen } from "../scenes/route-bus/bus-stopping-edit.component";
import { RouteBusStoppingAddScreen } from "../scenes/route-bus/bus-stopping-add.component";
import { RouteBusStoppingEditEditScreen } from "../scenes/route-bus/bus-stopping-edit-edit.component";
import { RouteBusStoppingAddEditScreen } from "../scenes/route-bus/bus-stopping-add-edit.component";


import { RouteBusJourneyTimetablesListScreen } from "../scenes/route-bus/bus-journey-timetables-list.component";
import { RouteBusJourneyDetailsScreen } from "../scenes/route-bus/bus-journey-details.component";
import { RouteBusJourneyTimetablesScreen } from "../scenes/route-bus/bus-journey-timetables.component";
import { RouteBusJourneyTimetablesEditScreen } from "../scenes/route-bus/bus-journey-timetables-edit.component";
import { RouteBusTimetableDetailsScreen } from "../scenes/route-bus/bus-timetable-details.component";
import { RouteBusJourneyTurnEditScreen } from "../scenes/route-bus/bus-journey-turn-edit.component";
import { JourneyTurnCustomDurationsListScreen } from "../scenes/route-bus/journey-turn-custom-duration-list.component";
import { ReturnJourneyTurnCustomDurationsListScreen } from "../scenes/route-bus/return-journey-turn-custom-duration-list.component";
import { RouteBusAllowedBusesListScreen } from "../scenes/route-bus/bus-allowed-buses-list.component";
import { RouteBusRotationBusesListScreen } from "../scenes/route-bus/bus-rotation-buses-list.component";
import { RouteBusTurnUpdateScreen } from "../scenes/route-bus/bus-turn-update.component";
import { RouteBusTurnDetailsScreen } from "../scenes/route-bus/bus-turn-details.component";



import { RouteBusJourneyStoppingsScreen } from "../scenes/route-bus/bus-journey-stoppings.componenet";


import { TourAddScreen } from "../scenes/round-tour/tour-add.component";
import { TourListScreen } from "../scenes/round-tour/tour-list.component";
import { TourStoppingsScreen } from "../scenes/round-tour/tour-stoppings.component";
import { TourStoppingAddScreen } from "../scenes/round-tour/tour-stopping-add.component";
import { TourStoppingEditScreen } from "../scenes/round-tour/tour-stopping-edit.component";
import { TourSchedulesScreen } from "../scenes/round-tour/tour-schedules.component";
import { TourScheduleScreen } from "../scenes/round-tour/tour-schedule.component";
import { TourDetailsScreen } from "../scenes/round-tour/tour-details.component";

import { VehicleAddScreen } from "../scenes/auth/vehicle-add.component";
import { VehicleScreen } from "../scenes/auth/vehicle.component";
import { TransportServiceVehicleListScreen } from "../scenes/auth/transportservice-vehicle-list.component";

import { TransportServiceVehicleSelectScreen } from "../scenes/round-tour/transportservice-vehicle-select.component";



const Stack = createNativeStackNavigator();

export const AppNavigator = (): React.ReactElement => {
	const theme = useTheme();
	const themeContext = useContext(Theming.ThemeContext);


	return (
		<NavigationContainer
			theme={{
				...DefaultTheme,
				colors: {
					...DefaultTheme.colors,
					background:
						themeContext.currentTheme === "dark"
							? theme["color-basic-800"]
							: theme["color-basic-100"],
				},
			}}
		>
			<Stack.Navigator screenOptions={{ headerShown: false }}>	
				
				<Stack.Screen name="SignIn" component={SignInScreen} />
				<Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
				<Stack.Screen name="SignUp" component={SignUpScreen}/>
				<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
				<Stack.Screen name="BusList" component={BusListScreen} />
				<Stack.Screen name="BusHome" component={BusHomeScreen} />
				<Stack.Screen name="Bus" component={BusScreen} />
				<Stack.Screen name="BusEdit" component={BusEditScreen} />
				<Stack.Screen name="BusAdd" component={BusAddScreen} />
				<Stack.Screen name="BusJourneyList" component={BusJourneyListScreen} />
				<Stack.Screen name="BusReturnJourneyList" component={BusReturnJourneyListScreen} />
				<Stack.Screen name="LocationAdd" component={LocationAddScreen} />
				<Stack.Screen name="BusPassengersAddScreen" component={BusPassengersAddScreen} />
				<Stack.Screen name="BusStoppingAddScreen" component={BusStoppingAddScreen} />
				<Stack.Screen name="BusStoppingEditScreen" component={BusStoppingEditScreen} />
				<Stack.Screen name="BusPassengerEditScreen" component={BusPassengerEditScreen} />
				<Stack.Screen name="BusPassenger" component={BusPassengerScreen} />
				<Stack.Screen name="UserProfile" component={UserProfileScreen} />
				<Stack.Screen name="BusLive" component={BusLiveScreen} />
				<Stack.Screen name="BusJourneyStoppings" component={BusJourneyStoppingsScreen} />
				<Stack.Screen name="BusReturnJourneyStoppings" component={BusReturnJourneyStoppingsScreen} />
				<Stack.Screen name="BusLiveStoppings" component={BusLiveStoppingsScreen} />
				<Stack.Screen name="TransportServiceList" component={TransportServiceListScreen} />
				<Stack.Screen name="TransportServiceAdd" component={TransportServiceAddScreen} />
				<Stack.Screen name="TransportService" component={TransportServiceScreen} />
				<Stack.Screen name="TransportserviceOwners" component={TransportserviceOwnerListScreen} />
				<Stack.Screen name="TransportServiceDrivers" component={TransportServiceDriversListScreen} />
				<Stack.Screen name="BusDriversList" component={BusDriversListScreen} />

				<Stack.Screen name="BusDriversAdd" component={BusDriversAddScreen} />
				<Stack.Screen name="BusPassengers" component={BusPassengersListScreen} />
				<Stack.Screen name="BusPassengersWatchers" component={BusPassengersWatchersListScreen} />
				
				<Stack.Screen name="BusDetails" component={BusDetailsScreen} />

				<Stack.Screen name="RouteBusAdd" component={RouteBusAddScreen} />
				<Stack.Screen name="RouteBusEdit" component={RouteBusEditScreen} />
				<Stack.Screen name="RouteBusList" component={RouteBusListScreen} />
				<Stack.Screen name="RouteBusJourneyList" component={RouteBusJourneyListScreen} />
				<Stack.Screen name="RouteBusJourneyAdd" component={RouteBusJourneyAddScreen} />
				<Stack.Screen name="RouteBusJourneyStoppingsList" component={RouteBusJourneyStoppingsListScreen} />
				<Stack.Screen name="RouteBusJourneyStoppingsListEdit" component={RouteBusJourneyStoppingsListEditScreen} />
				<Stack.Screen name="RouteBusDetails" component={RouteBusDetailsScreen} />
				<Stack.Screen name="RouteBusJourneyTimetablesList" component={RouteBusJourneyTimetablesListScreen} />
				<Stack.Screen name="RouteBusJourneyDetails" component={RouteBusJourneyDetailsScreen} />
				<Stack.Screen name="RouteBusJourneyTimetables" component={RouteBusJourneyTimetablesScreen} />
				<Stack.Screen name="RouteBusJourneyTurnEdit" component={RouteBusJourneyTurnEditScreen} />
				<Stack.Screen name="RouteBusTimetableDetails" component={RouteBusTimetableDetailsScreen} />
				<Stack.Screen name="RouteBusStoppingEditScreen" component={RouteBusStoppingEditScreen} />
				<Stack.Screen name="RouteBusStoppingAddEditScreen" component={RouteBusStoppingAddEditScreen} />
				<Stack.Screen name="RouteBusStoppingEditEditScreen" component={RouteBusStoppingEditEditScreen} />
				<Stack.Screen name="RouteBusStoppingAddScreen" component={RouteBusStoppingAddScreen} />
				<Stack.Screen name="RouteBusJourneyTurnCustomDurationsList" component={JourneyTurnCustomDurationsListScreen} />
				<Stack.Screen name="RouteBusReturnJourneyTurnCustomDurationsList" component={ReturnJourneyTurnCustomDurationsListScreen} />
				<Stack.Screen name="RouteBusAllowedBusesList" component={RouteBusAllowedBusesListScreen} />
				<Stack.Screen name="RouteBusRotationBusesList" component={RouteBusRotationBusesListScreen} />
				<Stack.Screen name="RouteBusJourneyStoppings" component={RouteBusJourneyStoppingsScreen} />
				<Stack.Screen name="RouteBusJourneyTimetablesEdit" component={RouteBusJourneyTimetablesEditScreen} />
				<Stack.Screen name="RouteBusTurnUpdate" component={RouteBusTurnUpdateScreen} />
				<Stack.Screen name="RouteBusTurnDetails" component={RouteBusTurnDetailsScreen} />


				<Stack.Screen name="TourAdd" component={TourAddScreen} />
				<Stack.Screen name="TourList" component={TourListScreen} />
				<Stack.Screen name="TourStoppingsScreen" component={TourStoppingsScreen} />
				<Stack.Screen name="TourStoppingAddScreen" component={TourStoppingAddScreen} />
				<Stack.Screen name="TourStoppingEdit" component={TourStoppingEditScreen} />
				<Stack.Screen name="TourSchedules" component={TourSchedulesScreen} />
				<Stack.Screen name="TourSchedule" component={TourScheduleScreen} />
				<Stack.Screen name="TourDetails" component={TourDetailsScreen} />

				<Stack.Screen name="VehicleAdd" component={VehicleAddScreen} />
				<Stack.Screen name="Vehicle" component={VehicleScreen} />
				<Stack.Screen name="TransportServiceVehicles" component={TransportServiceVehicleListScreen} />

				<Stack.Screen name="TransportServiceVehicleSelect" component={TransportServiceVehicleSelectScreen} />

				
			</Stack.Navigator>
		</NavigationContainer>
	);
};
