import { remove } from "mobx";
import { types } from "mobx-state-tree";
import { cast } from "mobx-state-tree"


const VehcileSeatLayout = types.model({
  id: types.optional(types.string, ""), 
  tranportServiceId: types.optional(types.string, ""), 
  title: types.optional(types.string, ""),  
  noOfRows: types.optional(types.number, 10),   // BOOKING, CONFIRMING, TRAVELLING, CANCELLED
  noOfColumnsLeft: types.optional(types.number, 2),
  noOfColumnsRight: types.optional(types.number, 2),
  hasFrontRowPassengerSeat: types.optional(types.boolean, false),
  noOfFoldableSeats: types.optional(types.number, 0),
  doorSeatNumbers: types.array(types.number),
  emptySeatNumbers: types.array(types.number),

})
.actions((self) => ({
  reset(){
    self.id="";
    self.title="";
    self.noOfRows=10;
    self.noOfColumnsLeft=2;
    self.noOfColumnsRight=2;
    self.noOfFoldableSeats=0;
    self.hasFrontRowPassengerSeat=false;
  },
  populate(vehcleSeatLayout){
    self.id=vehcleSeatLayout?.id;
    self.title=vehcleSeatLayout?.title;
    self.noOfRows=Number(vehcleSeatLayout?.noOfRows);
    self.noOfColumnsLeft=Number(vehcleSeatLayout?.noOfColumnsLeft);
    self.noOfColumnsRight=Number(vehcleSeatLayout?.noOfColumnsRight);
    self.hasFrontRowPassengerSeat=(vehcleSeatLayout?.hasFrontRowPassengerSeat?.toLowerCase() === "true");
    self.noOfFoldableSeats=Number(vehcleSeatLayout?.noOfFoldableSeats);
    self.doorSeatNumbers=vehcleSeatLayout?.doorSeatNumbers.map(Number);;
    self.emptySeatNumbers=vehcleSeatLayout?.emptySeatNumbers.map(Number);;
  },
  setTransportServiceId(transportServiceId) {
      self.transportServiceId = transportServiceId;
  },
  setTitle(title) {
      self.title = title;
  },
  setNoOfRows(noOfRows) {
    self.noOfRows = noOfRows;
  },
  setNoOfColumnsLeft(noOfColumnsLeft) {
    self.noOfColumnsLeft = noOfColumnsLeft;
  },
  setNoOfColumnsRight(noOfColumnsRight) {
    self.noOfColumnsRight = noOfColumnsRight;
  },
  setHasFrontRowPassengerSeat(hasFrontRowPassengerSeat) {
      self.hasFrontRowPassengerSeat = hasFrontRowPassengerSeat;
  },
  setNoOfFoldableSeats(noOfFoldableSeats) {
    self.noOfFoldableSeats = noOfFoldableSeats;
  },
  setDoorSeatNumbers(doorSeatNumbers) {
    self.doorSeatNumbers = [];
    doorSeatNumbers.forEach(element => {
      self.doorSeatNumbers.push(element?.row+1);
    }); 
  },
  setEmptySeatNumbers(emptySeatNumbers) {
    self.emptySeatNumbers = [];
    emptySeatNumbers.forEach(element => {
      self.emptySeatNumbers.push(element?.row+1);
    }); 
  }
})
);

export default VehcileSeatLayout;