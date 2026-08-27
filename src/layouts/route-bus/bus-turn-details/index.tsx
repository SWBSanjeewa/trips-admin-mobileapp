import React from "react";

import BusTurnDetailsCard  from "./extra/busturndetails-card.component"
import { observer, inject} from "mobx-react";

const BusTurnUpdate = React.forwardRef(({ navigation }, ref) => {

	return (
		<BusTurnDetailsCard navigation={navigation} ref={ref}/>
	);
});

export default observer(BusTurnUpdate);
