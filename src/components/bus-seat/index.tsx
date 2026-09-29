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
  const generateBusLayout = (): Array<Array<SeatLayout>> => {
    const allArray: Array<Array<SeatLayout>> = [];

    for (let rowIndex = 0; rowIndex < row; rowIndex += 1) {
      const seatArray =
        rowIndex === 0
          ? generateFirstRow(rowIndex)
          : generateSeatRow(rowIndex);

      allArray.push(seatArray);
    }

    return allArray;
  };

  const getSelectedSeat = (seatNumber: number) => {
    return selectedSeats.find(
      (item) => item.seatNumber === seatNumber
    );
  };

  const getSeatNumber = (
    rowIndex: number,
    columnIndex: number,
    currentSeatNumber: number,
    reverseSeatNumber: number
  ) => {
    return rowIndex % 2 === 0
      ? reverseSeatNumber
      : currentSeatNumber;
  };

  const generateFirstRow = (rowIndex: number): Array<SeatLayout> => {
    const seatArray: Array<SeatLayout> = [];
    const totalColumns = layout.columnOne + layout.columnTwo;

    let columnIndex = 0;

    // Driver / front door
    if (isEntryDoorAtFront) {
      seatArray.push({
        id: `${rowIndex},${columnIndex}`,
        type: driverPosition === 'left' ? 'driver' : 'emptySpace',
      });
    }

    while (columnIndex < totalColumns) {
      const isLastColumn = columnIndex === totalColumns - 1;

      seatArray.push({
        id: `${rowIndex},${columnIndex}`,
        type: isLastColumn
          ? driverPosition === 'left'
            ? 'emptySpace'
            : 'driver'
          : 'emptySpace',
      });

      // Add door/aisle space when the entry door is at the back
      if (
        !isEntryDoorAtFront &&
        columnIndex === layout.columnOne - 1
      ) {
        seatArray.push({
          id: `${rowIndex},${columnIndex}`,
          type: 'emptySpace',
        });
      }

      columnIndex += 1;
    }

    return seatArray;
  };

  const generateSeatRow = (
    rowIndex: number
  ): Array<SeatLayout> => {
    const seatArray: Array<SeatLayout> = [];
    const totalColumns = layout.columnOne + layout.columnTwo;

    let currentSeatNumber = 1;
    let reverseSeatNumber =
      rowIndex * totalColumns;

    // Preserve the original special handling
    // for an odd number of rows.
    if (row % 2 !== 0 && rowIndex === row - 1) {
      reverseSeatNumber += 1;
    }

    let aisleAdded = false;

    for (
      let columnIndex = 0;
      columnIndex < totalColumns;
      columnIndex += 1
    ) {
      const seatNumber = getSeatNumber(
        rowIndex,
        columnIndex,
        currentSeatNumber,
        reverseSeatNumber
      );

      const selectedSeat = getSelectedSeat(seatNumber);

      seatArray.push({
        id: `${rowIndex},${
          aisleAdded ? columnIndex + 1 : columnIndex
        }`,
        type: selectedSeat?.seatType ?? 'available',
        seatNo: seatNumber,
        isSeatSeleced: !!selectedSeat,
      });

      /*
       * Add aisle after columnOne.
       *
       * For the last row, the original implementation
       * creates an additional seat instead of an empty space.
       */
      if (columnIndex === layout.columnOne - 1) {
        let lastRowSeatNumber = 0;

        if (rowIndex === row - 1) {
          if (row % 2 !== 0) {
            reverseSeatNumber -= 1;
            lastRowSeatNumber = reverseSeatNumber;
          } else {
            currentSeatNumber += 1;
            lastRowSeatNumber = currentSeatNumber;
          }
        }

        const isLastRow = rowIndex === row - 1;
        const selectedLastRowSeat =
          isLastRow && lastRowSeatNumber > 0
            ? getSelectedSeat(lastRowSeatNumber)
            : undefined;

        seatArray.push({
          id: `${rowIndex},${columnIndex + 1}`,
          type: isLastRow
            ? selectedLastRowSeat?.seatType ?? 'available'
            : 'emptySpace',
          seatNo: lastRowSeatNumber,
          isSeatSeleced: isLastRow
            ? !!selectedLastRowSeat
            : false,
        });

        aisleAdded = true;
      }

      reverseSeatNumber -= 1;
      currentSeatNumber += 1;
    }

    return seatArray;
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
