import { remove } from "mobx";
import { types } from "mobx-state-tree";
import { cast } from "mobx-state-tree"


const Booking = types.model({
  id: types.optional(types.string, ""),  
  noOfAdults: types.optional(types.number, 0),
  noOfChildren: types.optional(types.number, 0),
  getInPlace: types.optional(types.string, ""),  
  getOffPlace: types.optional(types.string, "")
})
.actions((self) => ({
  reset() {
      self.id = "";
  }
})
);

const Schedule = types.model({
  id: types.optional(types.string, ""), 
  remarks: types.optional(types.string, ""),  
  status: types.optional(types.string, ""),   // BOOKING, CONFIRMING, TRAVELLING, CANCELLED
  tourStartDate: types.optional(types.string, ""),
  tourStartTime: types.optional(types.string, ""),
  confirmationStartTime: types.optional(types.string, ""), 
  confirmationEndTime: types.optional(types.string, ""),  
  vehicleId: types.optional(types.string, ""),  
  bookings: types.array(Booking),
})
.actions((self) => ({
  reset() {
      console.log("self::"+self);
      self.id = "";
      self.tourStartDate = "";
  }
})
);

export default Schedule;