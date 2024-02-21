import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  AntDesign,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import ReservationStep from './ReservationStep';
import CalendarScreen from './Calendar';
import TableBooking from './TableBooking';
import { TouchableHighlight } from 'react-native-gesture-handler';
import moment from 'moment';
import TimeSelect from './TimeSelect';
import Guests from './Guests';

const menuStep = [
  {
    icon: <Fontisto name='date' size={24} color='white' />,
    label: 'Day'
  },
  {
    icon: <AntDesign name='clockcircleo' size={24} color='white' />,
    label: 'Time'
  },
  {
    icon: <Ionicons name='people-sharp' size={24} color='white' />,
    label: 'Guests'
  },
  {
    icon: <MaterialCommunityIcons name='table-chair' size={24} color='white' />,
    label: 'Table'
  }
];

const Reservation = ({ data }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [historyStep, setHistoryStep] = useState([0]);
  const [dataBooking, setDataBooking] = useState([]);

  useEffect(() => {
    console.log('dataBooking', dataBooking);
  }, [dataBooking]);

  // State of each step
  const [day, setDay] = useState(moment().format('YYYY-MM-DD'));
  const [time, setTime] = useState();
  const [guests, setGuests] = useState({ adults: 0, children: 0 });

  const updateDataBooking = useCallback((step, data) => {
    setDataBooking((prevDataBooking) => {
      const newDataBooking = prevDataBooking.map((item) =>
        item.step === step ? { step, data } : item
      );
      if (!prevDataBooking.some((item) => item.step === step)) {
        newDataBooking.push({ step, data });
      }
      return newDataBooking;
    });
  }, []);

  const renderMenu = useMemo(() => {
    let component;
    switch (currentStep) {
      case 0:
        component = <CalendarScreen day={day} onChange={setDay} />;
        break;
      case 1:
        component = (
          <TimeSelect
            time={time}
            onChange={setTime}
            openHours={data.openHours}
            closeHours={data.closeHours}
          />
        );
        break;
      case 2:
        // Add your component for the third step
        component = <Guests guests={guests} onChange={setGuests} />; // Placeholder for the third step component
        break;
      case 3:
        component = (
          <TableBooking
            dataBooking={dataBooking}
            restaurantFloors={data?.restaurantFloors}
          />
        );
        break;
      default:
        component = null;
    }
    return (
      <>
        <View>{component}</View>
      </>
    );
  }, [
    currentStep,
    day,
    time,
    guests,
    data.openHours,
    data.closeHours,
    data.restaurantFloors
  ]);

  const handleNext = () => {
    if (currentStep < menuStep.length - 1) {
      setCurrentStep((prevCurrentStep) => {
        const newStep = prevCurrentStep + 1;

        // Check if newStep already exists in historyStep
        if (!historyStep.includes(newStep)) {
          setHistoryStep((prevHistoryStep) => [...prevHistoryStep, newStep]);
        }

        // Save data of the current step
        if (prevCurrentStep == 0) updateDataBooking(prevCurrentStep, day);
        if (prevCurrentStep == 1) updateDataBooking(prevCurrentStep, time);
        if (prevCurrentStep == 2) updateDataBooking(prevCurrentStep, guests);

        return newStep;
      });
    }
  };

  useEffect(() => {
    console.log('day');
    if (day) {
      updateDataBooking(currentStep, day);
    }
  }, [day]);

  useEffect(() => {
    console.log('time');
    if (time) {
      updateDataBooking(currentStep, time);
    }
  }, [time]);

  useEffect(() => {
    if (guests.adults + guests.children !== 0) {
      updateDataBooking(currentStep, guests);
    }
  }, [guests]);

  const isLastStep = useMemo(
    () => currentStep === menuStep.length - 1,
    [currentStep, menuStep.length]
  );
  console.log('------------------');

  return (
    <View className='flex-[1]'>
      <View className='flex-[1.5] reservation-step flex flex-row justify-around mt-4'>
        {menuStep.map((menu, index) => (
          <ReservationStep
            key={index}
            isActive={currentStep === index}
            classNameLabel={'mt-1'}
            icon={menu.icon}
            label={menu.label}
            onPress={() => {
              if (historyStep.includes(index) || currentStep + 1 === index) {
                setHistoryStep((prevHistoryStep) =>
                  prevHistoryStep.concat(index)
                );
                setCurrentStep(index);
              }
            }}
          />
        ))}
      </View>
      <ScrollView className='flex-[8.5] mb-16 reservation-detail px-2 mt-2'>
        {renderMenu}
      </ScrollView>
      <View className='absolute px-2 bottom-5 left-0 w-full'>
        {isLastStep ? (
          <TouchableHighlight
            style={{ borderRadius: 6 }}
            underlayColor={'#fff'}>
            <View className=' bg-primary1 h-10 rounded-md flex justify-center items-center'>
              <Text className=' font-roboto-black text-md text-center text-white'>
                Book Table
              </Text>
            </View>
          </TouchableHighlight>
        ) : (
          <TouchableHighlight
            style={{ borderRadius: 6 }}
            underlayColor={'#fff'}
            onPress={handleNext}>
            <View className=' bg-primary1 h-10 rounded-md flex justify-center items-center'>
              <Text className=' font-roboto-black text-md text-center text-white'>
                Next
              </Text>
            </View>
          </TouchableHighlight>
        )}
      </View>
    </View>
  );
};

export default Reservation;
