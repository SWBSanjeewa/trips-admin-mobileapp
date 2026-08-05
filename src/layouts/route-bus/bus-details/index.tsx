import React from "react";

import BusDetailsCard  from "./extra/busdetails-card.component";
import { observer, inject} from "mobx-react";

const BusDetails = React.forwardRef(({ navigation }, ref) => {

	return (
		<BusDetailsCard navigation={navigation} ref={ref}/>
	);
});

export default observer(BusDetails);
