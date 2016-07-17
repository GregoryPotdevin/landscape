import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

export class Calendar extends React.Component {
  render(){
    return <BigCalendar
      events={[]}
      startAccessor='startDate'
      endAccessor='endDate'
    />
  }
}