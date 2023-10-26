import PropTypes from 'prop-types';

const msInDay = 24 * 3_600_000;

function* calendarGenerator(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstMonthDate = new Date(year, month, 1);
  const firstWeekOffset = msInDay * ((firstMonthDate.getDay() + 6) % 7);
  const beginFrom = firstMonthDate.getTime() - firstWeekOffset;

  const nextMonth = (month + 1) % 12;
  const lastMonthDate = new Date(new Date(nextMonth ? year : year + 1, nextMonth, 1) - 1);
  const lastWeekOffset = msInDay * (6 - ((lastMonthDate.getDay() + 6) % 7));
  const endAt = lastMonthDate.getTime() + lastWeekOffset;

  for (let timestamp = beginFrom; timestamp < endAt; timestamp += msInDay) {
    yield new Date(timestamp);
  }
}

const Calendar = ({ date }) => {
  let dayName = date.toLocaleString('ru-RU', { weekday: 'long' });
  dayName = `${dayName[0].toUpperCase()}${dayName.substr(1,)}`;
  let monthName = date.toLocaleString('ru-RU', { month: 'long' });
  monthName = `${monthName[0].toUpperCase()}${monthName.substr(1,)}`;
  const monthNameNumeral = date.toLocaleString('ru', { month: 'long', day: 'numeric' }).split(' ')[1];

  const month = date.getMonth();
  const weeks = [];
  for (const calendarDate of calendarGenerator(date)) {
    const dateNumber = calendarDate.getDate();
    if (!weeks.length || calendarDate.getDay() === 1) weeks.push([]);
    const className = calendarDate.getMonth() !== month ? 'ui-datepicker-other-month' : dateNumber === date.getDate() ? 'ui-datepicker-today' : '';
    weeks[weeks.length - 1].push({ date: dateNumber, className, timestamp: calendarDate.getTime() });
  }

  return (
    <div className="ui-datepicker">
      <div className="ui-datepicker-material-header">
        <div className="ui-datepicker-material-day">
          {dayName}
        </div>
        <div className="ui-datepicker-material-date">
          <div className="ui-datepicker-material-day-num">
            {date.getDate()}
          </div>
          <div className="ui-datepicker-material-month">
            {monthNameNumeral}
          </div>
          <div className="ui-datepicker-material-year">
            {date.getFullYear()}
          </div>
        </div>
      </div>
      <div className="ui-datepicker-header">
        <div className="ui-datepicker-title">
          <span className="ui-datepicker-month">
            {monthName}
          </span>
          &nbsp;
          <span className="ui-datepicker-year">
            {date.getFullYear()}
          </span>
        </div>
      </div>
      <table className="ui-datepicker-calendar">
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
          <col className="ui-datepicker-week-end" />
          <col className="ui-datepicker-week-end" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" title="Понедельник">Пн</th>
            <th scope="col" title="Вторник">Вт</th>
            <th scope="col" title="Среда">Ср</th>
            <th scope="col" title="Четверг">Чт</th>
            <th scope="col" title="Пятница">Пт</th>
            <th scope="col" title="Суббота">Сб</th>
            <th scope="col" title="Воскресенье">Вс</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={`week${weekIndex}`}>
              {week.map((day) => (
                <td key={day.timestamp} className={day.className}>
                  {day.date}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};

export { Calendar };
