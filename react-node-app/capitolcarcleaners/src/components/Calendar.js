/*
 |  React-calendar - A pure, vanilla JavaScript DateTime Picker
 |  @author        krissnawat <https://github.com/krissnawat/react-calendar>
 |                 Mosh Hamedani <https://programmingwithmosh.com/react/build-a-react-calendar-component-from-scratch/>
 |
 |  @license       N/A
 |  @copyright     2015 - Programming with Mosh
 |                 
 */

import React from "react";
import moment from "moment";
import "../css/calendar.css";

// ran npm i moment
// ran npm i tail.datetime

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {      
        showCalendarTable: true,
        showMonthTable: false,
        dateObject: moment(),
        allmonths: moment.months(),
        showYearNav: false,
    };
    this.clickedDate = React.createRef(); // I don't think I need this
  } 

  // Rename this function to make more sense and update line 252
  sendData(date) { 
    this.props.callBackFromCalendar(date); // the props call must match the state in parent class
  }

  weekdayshort = moment.weekdaysShort();

  daysInMonth = () => {
    return this.state.dateObject.daysInMonth();
  };
  year = () => {
    return this.state.dateObject.format("Y");
  };
  currentDay = () => {
    return this.state.dateObject.format("D");
  };
  currentMonth = () => {
    return this.state.dateObject.format("M")
  }
  firstDayOfMonth = () => {
    let dateObject = this.state.dateObject;
    let firstDay = moment(dateObject)
      .startOf("month")
      .format("d"); // Day of week 0...1..5...6
    return firstDay;
  };
  month = () => {
    return this.state.dateObject.format("MMMM");
  };
  showMonth = (e, month) => {
    this.setState({
      showMonthTable: !this.state.showMonthTable,
      showCalendarTable: !this.state.showCalendarTable
    });
  };
  setMonth = month => {
    let monthNo = this.state.allmonths.indexOf(month);
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set("month", monthNo);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showCalendarTable: !this.state.showCalendarTable
    });
  };
  MonthList = props => {
    let months = [];
    props.data.map(data => {
      months.push(
        <td
          key={data}
          className="calendar-month"
          onClick={e => {
            this.setMonth(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let monthlist = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    return (
      <table className="calendar-month">
        <thead>
          <tr>
            <th colSpan="4">Select a Month</th>
          </tr>
        </thead>
        <tbody>{monthlist}</tbody>
      </table>
    );
  };
  showYearEditor = () => {
    this.setState({
      showYearNav: true,
      showCalendarTable: !this.state.showCalendarTable
    });
  };

  onPrev = () => {
    let curr = "";
    if (this.state.showMonthTable == true) {
      curr = "year";
    } else {
      curr = "month";
    }
    this.setState({
      dateObject: this.state.dateObject.subtract(1, curr)
    });
  };
  onNext = () => {
    let curr = "";
    if (this.state.showMonthTable == true) {
      curr = "year";
    } else {
      curr = "month";
    }
    this.setState({
      dateObject: this.state.dateObject.add(1, curr)
    });
  };
  setYear = year => {
    // alert(year)
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set("year", year);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showYearNav: !this.state.showYearNav,
    });
  };
  onYearChange = e => {
    this.setYear(e.target.value);
  };
  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate2 = moment(stopDate);
    while (currentDate <= stopDate2) {
      dateArray.push(moment(currentDate).format("YYYY"));
      currentDate = moment(currentDate).add(1, "year");
    }
    return dateArray;
  }
  YearTable = props => {
    let months = [];
    let nextten = moment()
      .set("year", props)
      .add("year", 12)
      .format("Y");

    let tenyear = this.getDates(props, nextten);

    tenyear.map(data => {
      months.push(
        <td
          key={data}
          className="calendar-month"
          onClick={e => {
            this.setYear(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let yearlist = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    return (
      <table className="calendar-month">
        <thead>
          <tr>
            <th colSpan="4">Select a Year</th>
          </tr>
        </thead>
        <tbody>{yearlist}</tbody>
      </table>
    );
  };

  // ** NEW ADDITION ** \\
  // This entire method has been modified to return the select Day of the week,
  // Day, Month, and Year. It previously only capurted the day ie. number that was 
  // clicked.
  // TODO: remove console.logs
  onDayClick = (e, d) => {
    
    const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
    const dayOfWeekArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    // console.log("E: " + e)
    // console.log("D: " + d)
    // console.log("This Month: " + this.month())
    // console.log("This Year: " + this.year())
    //console.log("Day of week test: "+ moment().weekday(d))
    var month = this.month();
    var monthNumber = (monthArray.indexOf(month) + 1)
    if(monthNumber.toString().length < 2) {
      monthNumber = "0" + monthNumber;
    }
    //console.log("Month NUM: " + monthNumber)
    var year = this.year();

    // Format the clicked date to a moment readable string
    var computedDate = year.toString() + "-" + monthNumber + "-" + d
    var date = moment(computedDate)
    
    // Get the correct day of the week
    var dayOfWeek = date.day()
    //console.log("DOW: "+dayOfWeek)

    // string value = "DOW YEAR-DAY-MONTH"
    var selectedDate = ("" + dayOfWeekArray[dayOfWeek] + " " + computedDate.toString())
    //console.log(clickedDate)

    // change condition to clickedDate
    //if((month !== null) && (year !== null) && (d !== null)) {
      // would want these as props
      // this.setState(
      //   {
      //     selectedDay: d,
      //     selectedWeekDay: dayOfWeekArray[dayOfWeek],
      //     selectedMonth: month,
      //     selectedYear: year
      //   },
      //   () => {
      //     console.log("SELECTED DAY: ", this.state.selectedDay);
      //   }
      // );

      // Process CallBack?
    this.sendData(selectedDate)
    //}
    
  };
  render() {
    let weekdayshortname = this.weekdayshort.map(day => {
      return <th key={day}>{day}</th>;
    });
    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(<td className="calendar-day empty">{""}</td>);
    }
    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      // this logic doesn't make sense because it makes the day of today 'TODAY' for every month. ie 
      // if it's actually NOV 4th. DEC 4th will also be highlighted.
      // need to check if the current month in calendar is accurate and if not then don't assign "today"
      let currentDay = d == this.currentDay() ? "today" : "";
      // let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
      daysInMonth.push(
        // ** NEW ADDITION ** \\
        // Adding onClick inside the <td> makes more sense becuase if the user doesn't click the exact number
        // the selection does not regitser. Placing here will encompass the entire box the number is surrounded by.
        // ** NEW ADDITION ** \\
        <td key={d} className={`calendar-day ${currentDay}`} onClick={e => {this.onDayClick(e,d);}}> 
          {/* <span
            onClick={e => {
              this.onDayClick(e, d);
            }}
          >
            {d}
          </span> */}
          {d}
        </td>
      );
    }
    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        // let insertRow = cells.slice();
        rows.push(cells);
      }
    });

    let daysinmonth = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    return (
      <div className="tail-datetime-calendar">
        <div className="calendar-navi">
          <span
            onClick={e => {
              this.onPrev();
            }}
            class="calendar-button button-prev"
          />
          {!this.state.showMonthTable && !this.state.showYearEditor && (
            <span
              onClick={e => {
                this.showMonth();
              }}
              class="calendar-label"
            >
              {this.month()},
            </span>
          )}
          <span
            className="calendar-label"
            onClick={e => {
              this.showYearEditor();
            }}
          >
            {this.year()}
          </span>

          <span
            onClick={e => {
              this.onNext();
            }}
            className="calendar-button button-next"
          />
        </div>
        <div className="calendar-date">
          {this.state.showYearNav && <this.YearTable props={this.year()} />}
          {this.state.showMonthTable && (
            <this.MonthList data={moment.months()} />
          )}
        </div>

        {this.state.showCalendarTable && (
          <div className="calendar-date">
            <table className="calendar-day">
              <thead>
                <tr>{weekdayshortname}</tr>
              </thead>
              <tbody>{daysinmonth}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default Calendar;
