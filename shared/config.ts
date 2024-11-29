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

export const GetDBSettings = (): IDBSettings => {
  return {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  }
}

export const insertData = async (data: NewContact) => {
  const connectionParams = GetDBSettings();
  const connection = await mysql.createConnection(connectionParams);
  const now = moment().format('YYYY-MM-DD hh:mm:ss')
  const query = `INSERT INTO contacts (source, first_name, last_name, title, linkedin, date_added)
  VALUES (${data.source}, ${data.first_name}, ${data.last_name}, ${data.title}, ${data.linkedin}, ${now})`
  const values = {};
  const results = await connection.execute(query, values);
  connection.end();

  return JSON.stringify(results);
}

export const prospeoFinder = async (formData: {
  fullname?: string | null | undefined;
  domain?: string | null | undefined;
  linkedin?: string | null | undefined;
}) => {
  const fullname = formData.fullname;
  const linkedin = formData.linkedin;
  const url = "https://api.prospeo.io/email-finder";
  const apiKey = "e84555ef3fb53549a8adcc4f17d85d6c";

  let data = {};
  if (fullname) {
    data = {
      full_name: fullname
    };
  }
  if (linkedin) {
    data = {
      url: linkedin
    }
  }

  const requiredHeaders = {
    "Content-Type": "application/json",
    "X-KEY": apiKey
  };

  if (Object.keys(data).length != 0) {
    try {
      const response = await fetch(url, {
          method: 'POST',
          headers: requiredHeaders,
          body: JSON.stringify(data)
        })
        .then(response => response.json());
      
      if (!response.error) {
        const respData = response.response
        const dbData: NewContact = {
          source: 'Prospeo',
          first_name: respData.first_name,
          last_name: respData.last_name,
          title: respData.title,
          linkedin: null,
        }
        await insertData(dbData);
      }
      
    } catch (error) {
      return error
    }
  }
}

export const hunterFinder = async (formData: {
  fullname?: string | null | undefined;
  domain?: string | null | undefined;
  linkedin?: string | null | undefined;
}) => {
  const fullname = formData.fullname;
  const domain = formData.domain;
  const baseUrl = "https://api.hunter.io/v2/email-finder";
  const apiKey = process.env.HUNTER_KEY;

  if (fullname) {
    const nameLength = fullname.split(' ').length;
    const firstName = fullname.split(' ')[0];
    let lastName = '';
    if (nameLength > 1){
      lastName = fullname.split(' ')[nameLength - 1];
    }

    const url = `${baseUrl}?domain=${domain}first_name=${firstName}&last_name=${lastName}&api_key=${apiKey}`
    try {
      const response = await fetch(url)
        .then(response => response.json());
      if (!response.errors) {
        const respData = response.data
        const dbData: NewContact = {
          source: 'Hunter',
          first_name: respData.first_name,
          last_name: respData.last_name,
          title: null,
          linkedin: respData.linkedin_url,
        }
        await insertData(dbData);
      }
    } catch (error) {
      return error
    }
  }
}

export const findymailFinder = async (formData: {
  fullname?: string | null | undefined;
  domain?: string | null | undefined;
  linkedin?: string | null | undefined;
}) => {
  const fullname = formData.fullname;
  const linkedin = formData.linkedin;
  const domain = formData.domain;
  const apiKey = "qodXVXRAMNRDP2KpGMTCuWgJ0CctSSeLld11G7rK68e533dc";
  let url = "https://app.findymail.com/api/search/name";

  const requiredHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };

  let data = {};
  if (fullname) {
    data = {
      name: fullname,
      domain: domain
    }
  }
  if (linkedin) {
    url = "https://app.findymail.com/api/search/linkedin";
    data = {
      linkedin_url: linkedin
    }
  }

  try {
    const response = await fetch(url, {
        method: 'POST',
        headers: requiredHeaders,
        body: JSON.stringify(data)
      })
      .then(response => response.json());

    if (!response.error) {
      const respData = response.contact
      const nameLength = respData.name.split(' ').length;
      const firstName = respData.name.split(' ')[0];
      let lastName = '';
      if (nameLength > 1) {
        lastName = respData.name.split(' ')[nameLength - 1]
      }
      const dbData: NewContact = {
        source: 'Hunter',
        first_name: firstName,
        last_name: lastName,
        title: respData.job_title,
        linkedin: respData.linkedin_url,
      }
      await insertData(dbData);
    }
  } catch (error) {
    return error
  }
}
