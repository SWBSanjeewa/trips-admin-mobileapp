import React, { useState, useCallback } from 'react';
import { View, FlatList, SafeAreaView, TextStyle } from 'react-native';
import type {
  AvaiableSeat,
  BlockedSeat,
  DoorSeatImage,
  DriverPosition,
  DriverSeat,
  Layout,
  SeatLayout,
  SelectedSeats,
} from './types';
import { mainContainerStyle } from './styles';
import SeatContainer from './component/SeatContainer';
import { useLayoutEffect } from 'react';
import { useRef } from 'react';

/*
This are props that require to pass in order to get seat layout
*/
export interface SeatsLayoutProps {
  blockedSeatImage?: BlockedSeat;
  doorSeatImage?: DoorSeatImage;
  driverImage?: DriverSeat;
  driverPosition?: DriverPosition;
  getBookedSeats?: (seats: Array<SeatLayout>) => void;
  isSleeperLayout?: boolean;
  layout: Layout;
  maxSeatToSelect?: number;
  numberTextStyle?: TextStyle;
  row: number;
  noOfFoldableSeats: number;
  seatImage?: AvaiableSeat;
  selectedSeats?: Array<SelectedSeats>;
}
const SeatsLayout: React.FC<SeatsLayoutProps> = ({
  blockedSeatImage = undefined,
  driverImage = undefined,
  doorSeatImage = undefined,
  driverPosition = 'right',
  getBookedSeats,
  isSleeperLayout = false,
  layout = { columnOne: 2, columnTwo: 2 },
  maxSeatToSelect = 7,
  numberTextStyle,
  row = 10,
  noOfFoldableSeats = 0,
  seatImage = undefined,
  selectedSeats = [],
}) => {
  const [bookingSeat, setBookingSeat] = useState<Array<Array<SeatLayout>>>([]);

  const isEntryDoorAtFront = true;
  const userSelectedSeats = useRef<Array<SeatLayout>>([]);




useLayoutEffect(() => {
  let allArray: Array<Array<SeatLayout>> = [];
  let i = 0;

  // Passenger seat numbering starts from 1.
  let seatNumber = 1;

  /**
   * Controls whether the front row should contain
   * one passenger seat at the position furthest
   * from the driver.
   */
  const hasFrontRowPassengerSeat = true;

  while (i < row) {
    let j = 0;

    let seatArray: Array<SeatLayout> = [];

    let seatLayout: SeatLayout = {
      id: '-1',
      type: 'blocked',
    };

    /*
     * FRONT ROW
     */
    if (i === 0 && j === 0) {
      const totalColumns =
        layout.columnOne + layout.columnTwo;

      /*
       * Driver is at the front.
       *
       * The passenger seat, when enabled, is placed
       * at the position furthest from the driver.
       */
      while (j < totalColumns) {
        const isFirstColumn = j === 0;
        const isLastColumn =
          j === totalColumns - 1;

        let type: SeatLayout['type'] = 'emptySpace';

        /*
         * Driver position is on the left.
         *
         * Driver -> left
         * Passenger -> furthest right
         */
        if (driverPosition === 'left') {
          if (isFirstColumn) {
            type = 'driver';
          } else if (
            hasFrontRowPassengerSeat &&
            isLastColumn
          ) {
            type = 'available';
          }
        }

        /*
         * Driver position is on the right.
         *
         * Passenger -> furthest left
         * Driver -> right
         */
        if (driverPosition === 'right') {
          if (isLastColumn) {
            type = 'driver';
          } else if (
            hasFrontRowPassengerSeat &&
            isFirstColumn
          ) {
            type = 'available';
          }
        }

        /*
         * If the front door is not at the front,
         * preserve the empty space after columnOne.
         */
        seatLayout = {
          id: `${i},${j}`,
          type,
        };

        /*
         * Assign seat number to the optional
         * front-row passenger seat.
         */
        if (type === 'available') {
          const selectedSeat = selectedSeats.find(
            (item) =>
              item.seatNumber === seatNumber
          );

          seatLayout = {
            id: `${i},${j}`,
            type:
              selectedSeat?.seatType ?? 'available',
            seatNo: seatNumber,
            isSeatSeleced: !!selectedSeat,
          };

          seatNumber += 1;
        }

        seatArray.push(seatLayout);

        if (
          !isEntryDoorAtFront &&
          j === layout.columnOne - 1
        ) {
          seatArray.push({
            id: `${i},${j + 1}`,
            type: 'emptySpace',
          });
        }

        j += 1;
      }
    } else {
      /*
       * PASSENGER ROWS
       */
      let bSpaceAdded = false;

      while (
        j < layout.columnOne + layout.columnTwo
      ) {
        const selectedSeat = selectedSeats.find(
          (item) =>
            item.seatNumber === seatNumber
        );

        seatLayout = {
          id: `${i},${
            bSpaceAdded ? j + 1 : j
          }`,
          type:
            selectedSeat?.seatType ?? 'available',
          seatNo: seatNumber,
          isSeatSeleced: !!selectedSeat,
        };

        seatArray.push(seatLayout);

        /*
         * Add aisle between the two seat sections.
         *
         * On the last row, the aisle position is
         * still treated as an additional passenger seat.
         */
        if (j === layout.columnOne - 1) {
          var iterations = 0;
          if((noOfFoldableSeats>0)&&(noOfFoldableSeats<row-1)){
            iterations = row - (noOfFoldableSeats+1);
          }else{
            iterations = row - 1;
          }
          if (i >= iterations) {
          //if (i === row - 1) {
            seatNumber += 1;

            const lastRowSelectedSeat =
              selectedSeats.find(
                (item) =>
                  item.seatNumber === seatNumber
              );

            seatLayout = {
              id: `${i},${j + 1}`,
              type:
                lastRowSelectedSeat?.seatType ??
                'available',
              seatNo: seatNumber,
              isSeatSeleced:
                !!lastRowSelectedSeat,
            };
          } else {
            seatLayout = {
              id: `${i},${j + 1}`,
              type: 'emptySpace',
              seatNo: 0,
              isSeatSeleced: false,
            };
          }

          seatArray.push(seatLayout);

          bSpaceAdded = true;
        }

        j += 1;
        seatNumber += 1;
      }
    }

    allArray.push(seatArray);
    i += 1;
  }

  setBookingSeat(allArray);

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);



  useLayoutEffect(() => {
    getBookedSeats && getBookedSeats(userSelectedSeats.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelectedSeats.current]);

  const onSeatSelected = useCallback(
    (seat: SeatLayout) => {
      let allChangedItem: Array<Array<SeatLayout>> = [...bookingSeat];
      const { id } = seat;
      const arrindexs: Array<number> = id
        .split(',')
        .map((item) => Number(item));
      let changeItem = seat;
      changeItem.type =
        changeItem.type === 'available' ? 'booked' : 'available';
      changeItem.isStatusChange = true;
      allChangedItem[arrindexs[0]][arrindexs[1]] = changeItem;

      setBookingSeat([...allChangedItem]);
      getSelectedSeats([...allChangedItem]);
    },
    [bookingSeat]
  );

  const getSelectedSeats = (bookingSeatArg: Array<Array<SeatLayout>>) => {
    let filterSelectedSeats = bookingSeatArg.flatMap((rowSeatArr) => {
      return rowSeatArr.filter((rowSeat) => {
        return rowSeat.type === 'booked' && rowSeat.isStatusChange;
      });
    });
    userSelectedSeats.current = filterSelectedSeats;
    // setUserSelectedSeat(filterSelectedSeats);
  };

  const renderSeatlayout = (item: Array<SeatLayout>, index: number) => {
    return (
      <SeatContainer
        item={item}
        index={index}
        isSleeperLayout={isSleeperLayout}
        seatImage={seatImage}
        driverImage={driverImage}
        blockedSeatImage={blockedSeatImage}
        doorSeatImage={doorSeatImage}
        numberTextStyle={numberTextStyle}
        disableSeat={userSelectedSeats.current.length === maxSeatToSelect}
        onSeatSelected={(seat) => {
          onSeatSelected(seat);
        }}
      />
    );
  };

  return (
    <SafeAreaView>
      <View style={mainContainerStyle}>
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={[...bookingSeat]}
          renderItem={({ item, index }) => {
            return renderSeatlayout(item, index);
          }}
          keyExtractor={(item: SeatLayout[]) => item[0].id}
        />
      </View>
    </SafeAreaView>
  );
};

export default React.memo(SeatsLayout);
