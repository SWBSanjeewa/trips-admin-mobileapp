import { CalendarElement, CalendarProps } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { CalendarShowcase } from "./calendar-showcase.component";
import { calendarShowcase } from "./type";

export const CalendarScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: CalendarProps): CalendarElement => <CalendarShowcase {...props} />;

	return (
		<ShowcaseContainer
			showcase={calendarShowcase}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
