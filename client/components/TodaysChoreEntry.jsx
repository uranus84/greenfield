import React from 'react';
import moment from 'moment';

function TodaysChoreEntry({ chore, index, handleCompletion, editChore }) {
  const choreFreq = `${chore.frequency.charAt(0).toUpperCase()}${chore.frequency.slice(1)}`;
  let lastCompleted;
  if (chore.last_date_completed !== null) {
    lastCompleted = 'Last completed ';
    lastCompleted += moment(chore.last_date_completed)
      .calendar(null, {
        lastDay: '[Yesterday]',
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        lastWeek: '[last] dddd',
        nextWeek: 'dddd',
        sameElse: 'L',
      });
  } else {
    lastCompleted = 'Never completed';
  }
  return (
    <div className="row today-chore-entry">
      <input
        className="done"
        type="checkbox"
        checked={chore.completed === '1'}
        onChange={() => handleCompletion(index)}
      />
      <span onClick={() => editChore(index)}>
        <span className="chore-name">{chore.chore_name}</span>
        <span className="chore-freq">{choreFreq}</span>
        <span className="chore-last-done">
          {lastCompleted}
        </span>
      </span>
    </div>
  );
}

export default TodaysChoreEntry;
