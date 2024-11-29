import { GetDBSettings } from '@/shared/config'
import mysql from 'mysql2/promise'

const connectionParams = GetDBSettings();

export async function getServerSideProps() {
  const connection = await mysql.createConnection(connectionParams);
  const getQuery = 'SELECT * FROM contacts';
  const values: unknown[] = [];

  const [results] = await connection.execute(getQuery, values);
  connection.end();
  const data = JSON.stringify(results)

  return data;
}