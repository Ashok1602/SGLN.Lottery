import SQLite from 'react-native-sqlite-storage';
import {dbName} from '../constants/constants';

export const createConnection = () => {
  var db = SQLite.openDatabase(
    {name: dbName, location: 'default'},
    () => {
    //   console.log('DB connected');
    },
    error => {
      console.log('Error while connecting DB : ', error);
    },
  );
  return db;
};
