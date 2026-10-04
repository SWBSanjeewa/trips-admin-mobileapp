import { remove } from "mobx";
import { types } from "mobx-state-tree";
import { cast } from "mobx-state-tree"


const VehcileSeatLayout = types.model({
  id: types.optional(types.string, ""), 
  title: types.optional(types.string, ""),  
  noOfRows: types.optional(types.number, 20),   // BOOKING, CONFIRMING, TRAVELLING, CANCELLED
  noOfColumnsLeft: types.optional(types.number, 2),
  noOfColumnsRight: types.optional(types.number, 2),
  hasFrontRowPassengerSeat: types.optional(types.boolean, false),
  noOfFoldableSeats: types.optional(types.number, 0),
  doorSeatNumbers: types.array(types.number),
  emptySeatNumbers: types.array(types.number)
})
.actions((self) => ({
  reset(){
    self.id="";
    self.title="";
    self.noOfRows=20;
    self.noOfColumnsLeft=2;
    self.noOfColumnsRight=2;
    self.hasFrontRowPassengerSeat=false;
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
    self.doorSeatNumbers = doorSeatNumbers;
  },
  setEmptySeatNumbers(emptySeatNumbers) {
    self.emptySeatNumbers = emptySeatNumbers;
  },
})
);

export default VehcileSeatLayout;