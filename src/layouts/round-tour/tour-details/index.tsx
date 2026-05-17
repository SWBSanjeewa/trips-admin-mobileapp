import React from "react";

import {TourDetailsCard}  from "./extra/tour-details-card.component";

export default React.forwardRef(({ navigation },ref) => {

	return (
		<TourDetailsCard navigation={navigation} ref={ref}/>
	);
});
