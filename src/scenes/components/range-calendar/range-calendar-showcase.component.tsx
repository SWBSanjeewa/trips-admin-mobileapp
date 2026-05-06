import { RangeCalendar, RangeCalendarElement, RangeCalendarProps } from "@ui-kitten/components";
import React from "react";

export const RangeCalendarShowcase = (props: RangeCalendarProps): RangeCalendarElement => {
	const [range, setRange] = React.useState({});

	return <RangeCalendar {...props} range={range} onSelect={setRange} />;
};
