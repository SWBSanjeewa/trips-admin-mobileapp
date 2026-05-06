import React from "react";

import {TourScheduleCard}  from "./extra/tourschedule-card.component";

export default React.forwardRef(({ navigation },ref) => {

	return (
		<TourScheduleCard navigation={navigation} ref={ref}/>
	);
});