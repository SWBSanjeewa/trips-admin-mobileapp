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
  seatImage = undefined,
  selectedSeats = [],
}) => {
  const [bookingSeat, setBookingSeat] = useState<Array<Array<SeatLayout>>>([]);

  const isEntryDoorAtFront = true;
  const userSelectedSeats = useRef<Array<SeatLayout>>([]);

  useLayoutEffect(() => {
  const getSelectedSeat = (seatNumber: number) => {
    return selectedSeats.find(
      (item) => item.seatNumber === seatNumber
    );
  };

  /**
   * Generates the first row of the bus.
   *
   * The first row contains the driver and/or empty spaces
   * depending on the door and driver position configuration.
   */
  const generateFirstRow = (
    rowIndex: number
  ): Array<SeatLayout> => {
    const seatArray: Array<SeatLayout> = [];
    const totalColumns =
      layout.columnOne + layout.columnTwo;

    let columnIndex = 0;

    // Add driver/front-door position
    if (isEntryDoorAtFront) {
      seatArray.push({
        id: `${rowIndex},${columnIndex}`,
        type:
          driverPosition === 'left'
            ? 'driver'
            : 'emptySpace',
      });
    }

    while (columnIndex < totalColumns) {
      const isLastColumn =
        columnIndex === totalColumns - 1;

      seatArray.push({
        id: `${rowIndex},${columnIndex}`,
        type: isLastColumn
          ? driverPosition === 'left'
            ? 'emptySpace'
            : 'driver'
          : 'emptySpace',
      });

      /**
       * When the entry door is not at the front,
       * add an additional empty space after columnOne.
       */
      if (
        !isEntryDoorAtFront &&
        columnIndex === layout.columnOne - 1
      ) {
        seatArray.push({
          id: `${rowIndex},${columnIndex + 1}`,
          type: 'emptySpace',
        });
      }

      columnIndex += 1;
    }

    return seatArray;
  };

  /**
   * Generates a normal seat row.
   *
   * Seat numbers are now completely unidirectional:
   *
   * Row 1 -> 1, 2, 3, 4
   * Row 2 -> 5, 6, 7, 8
   * Row 3 -> 9, 10, 11, 12
   *
   * There is no reverse numbering based on odd/even rows.
   */
  const generateSeatRow = (
    rowIndex: number,
    seatNumber: number
  ): {
    seatArray: Array<SeatLayout>;
    nextSeatNumber: number;
  } => {
    const seatArray: Array<SeatLayout> = [];

    const totalColumns =
      layout.columnOne + layout.columnTwo;

    let columnIndex = 0;
    let currentSeatNumber = seatNumber;
    let aisleAdded = false;

    while (columnIndex < totalColumns) {
      const selectedSeat = getSelectedSeat(
        currentSeatNumber
      );

      seatArray.push({
        id: `${rowIndex},${
          aisleAdded ? columnIndex + 1 : columnIndex
        }`,
        type:
          selectedSeat?.seatType ?? 'available',
        seatNo: currentSeatNumber,
        isSeatSeleced: !!selectedSeat,
      });

      /**
       * Add aisle / additional seat after columnOne.
       *
       * On the last row, the original code treats this
       * position as an additional seat rather than an aisle.
       */
      if (columnIndex === layout.columnOne - 1) {
        const isLastRow = rowIndex === row - 1;

        if (isLastRow) {
          currentSeatNumber += 1;

          const selectedLastRowSeat =
            getSelectedSeat(currentSeatNumber);

          seatArray.push({
            id: `${rowIndex},${columnIndex + 1}`,
            type:
              selectedLastRowSeat?.seatType ??
              'available',
            seatNo: currentSeatNumber,
            isSeatSeleced:
              !!selectedLastRowSeat,
          });
        } else {
          seatArray.push({
            id: `${rowIndex},${columnIndex + 1}`,
            type: 'emptySpace',
          });
        }

        aisleAdded = true;
      }

      currentSeatNumber += 1;
      columnIndex += 1;
    }

    return {
      seatArray,
      nextSeatNumber: currentSeatNumber,
    };
  };

  /**
   * Generates the complete bus layout.
   */
  const generateBusLayout = (): Array<
    Array<SeatLayout>
  > => {
    const allArray: Array<Array<SeatLayout>> = [];

    let nextSeatNumber = 1;

    for (
      let rowIndex = 0;
      rowIndex < row;
      rowIndex += 1
    ) {
      // First row is the driver/front area
      if (rowIndex === 0) {
        allArray.push(
          generateFirstRow(rowIndex)
        );
        continue;
      }

      const result = generateSeatRow(
        rowIndex,
        nextSeatNumber
      );

      allArray.push(result.seatArray);

      nextSeatNumber = result.nextSeatNumber;
    }

    return allArray;
  };

  const bookingSeat = generateBusLayout();

  setBookingSeat(bookingSeat);

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
