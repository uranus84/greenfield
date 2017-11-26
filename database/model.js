const db = require('./index.js');
const Promise = require('bluebird');
// const slice = require('array-slice');
const moment = require('moment');


// response to client in the JSON data format {todayChores:[ ], futureChores: [ ] }

const getChores = (req, res, userId) => {
  console.log('im getchores');
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM chores WHERE user_id = ${userId}`, (err, result) => {
      if (err) {
        return reject(err);
      }
      const data = {
        todayChores: [],
        futureChores: [],
      };
      const currDate = moment().format('YYYY-MM-DD');
      console.log('currdate', currDate);
      for (let i = 0; i < result.length; i += 1) {
        let obj = {
          id: result[i].id,
          chore_name: result[i].chore_name,
          next_date: JSON.stringify(result[i].next_date).slice(1, 11),
          frequency: result[i].frequency,
          last_date_completed: result[i].last_date_completed,
          completed: result[i].completed,
        };
        if (JSON.stringify(currDate) === `${JSON.stringify(result[i].next_date).slice(0, 11)}"`) {
          data.todayChores.push(obj);
        } else {
          data.futureChores.push(obj);
        }
        obj = {};
      }
      res.json(data);
      // console.log('data', data);
      return resolve(result);
    });
  });
};

const postChores = (req, res, dataToBeInserted, userId) => {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT INTO chores (chore_name,next_date,frequency,last_date_completed,completed,user_id) VALUES ('${dataToBeInserted.chore_name}', '${dataToBeInserted.next_date}', '${dataToBeInserted.frequency}', NULL, false, '${userId}')`;
    db.query(insertQuery, (err, result) => {
      if (err) {
        return reject(err);
      }
      res.send('successful post chore');
      return resolve(result);
    });
  });
};

const deleteChores = (req, res) => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE FROM chores WHERE id = '${req.body.id}'`;
    db.query(deleteQuery, (err, result) => {
      if (err) {
        return reject(err);
      }
      res.json('deleted the requested chores');
      return resolve(result);
    });
  });
};

const updateChores = (req, res) => {
  console.log('im update inside updatechores', req.body);
  return new Promise((resolve, reject) => {
    let freq = '';
    // const date = null;
    const selectQuery = `SELECT next_date, frequency FROM chores WHERE id = '${req.body.id}'`;
    db.query(selectQuery, (err, result) => {
      if (err) {
        return reject(err);
      }
      console.log(result, 'result');
      freq = result[0].frequency;
      const formattedDate = (JSON.stringify(result[0].next_date).slice(1, 11));
      let dateToBeUpdated = null;
      if (freq === 'daily') {
        dateToBeUpdated = moment(formattedDate).add(1, 'days').format('YYYY-MM-DD');
      } else if (freq === 'weekly') {
        console.log(formattedDate, 'formattedDate');
        dateToBeUpdated = moment(formattedDate).add(7, 'days').format('YYYY-MM-DD');
        console.log('dateToBeUpdated', dateToBeUpdated);
      } else if (freq === 'bi-weekly') {
        dateToBeUpdated = moment(formattedDate).add(14, 'days').format('YYYY-MM-DD');
      } else if (freq === 'monthly') {
        dateToBeUpdated = moment(formattedDate).add(1, 'month').format('YYYY-MM-DD');
      }
      const updateQuery = `UPDATE chores SET next_date = '${dateToBeUpdated}', last_date_completed = '${moment().format('YYYY-MM-DD')}' WHERE id = '${req.body.id}'`;
      db.query(updateQuery, (error, results) => {
        if (err) {
          return reject(err);
        }
        res.json('data Updated Successfully');
        return resolve(results);
      });
    });
  });
};

const editChores = (req, res) => {
  const chore = req.body;
  return new Promise((resolve, reject) => {
    const updateQuery = `UPDATE chores SET next_date = '${chore.next_date}', chore_name = '${chore.chore_name}', frequency = '${chore.frequency}' WHERE id = '${req.body.id}'`;
    db.query(updateQuery, (error, results) => {
      if (error) {
        return reject(error);
      }
      res.json('data edited Successfully');
      return resolve(results);
    });
  });
};


module.exports.postChores = postChores;
module.exports.getChores = getChores;
module.exports.deleteChores = deleteChores;
module.exports.updateChores = updateChores;
module.exports.editChores = editChores;

