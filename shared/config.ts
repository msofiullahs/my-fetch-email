'use server'
import mysql from 'mysql2/promise'
import moment from 'moment-timezone'

export interface IDBSettings {
  host: string
  port: number
  user: string
  password: string
  database: string
}

export interface Contact {
  id: number
  source: string
  first_name: string
  last_name: string
  title: string
  linkedin: string
  date_added: string
}

export interface NewContact {
  source: string
  first_name: string
  last_name: string
  title: string | null
  linkedin: string | null
}

export const GetDBSettings = async (): Promise<IDBSettings> => {
  return {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  }
}

export const insertData = async (data: NewContact) => {
  const connectionParams = await GetDBSettings();
  const connection = await mysql.createConnection(connectionParams);
  const checkQuery = `SELECT * FROM contacts WHERE first_name LIKE ${data.first_name} AND last_name LIKE ${data.last_name} AND linkedin LIKE ${data.linkedin} LIMIT 1`;
  const checkVal = {};
  const checkResult = await connection.execute(checkQuery, checkVal);

  if (!checkResult) {
    const now = moment().format('YYYY-MM-DD hh:mm:ss')
    const query = `INSERT INTO contacts (source, first_name, last_name, title, linkedin, date_added)
    VALUES (${data.source}, ${data.first_name}, ${data.last_name}, ${data.title}, ${data.linkedin}, ${now})`
    const values = {};
    const results = await connection.execute(query, values);
    return JSON.stringify(results);
  }
  connection.end();

  return JSON.stringify(checkResult);
}
