import { insertData, NewContact } from "./config";

const prospeoKey = "e84555ef3fb53549a8adcc4f17d85d6c";
const hunterKey = "bb5136c242f0f32c3823cc49bb436bc3298becbc";
const findymailKey = "qodXVXRAMNRDP2KpGMTCuWgJ0CctSSeLld11G7rK68e533dc";

export const prospeoFinder = async (formData: {
  fullname?: string | null | undefined;
  domain?: string | null | undefined;
  linkedin?: string | null | undefined;
}) => {
  const fullname = formData.fullname;
  const linkedin = formData.linkedin;
  const url = "https://api.prospeo.io/email-finder";

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
    "X-KEY": prospeoKey
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

  if (fullname) {
    const nameLength = fullname.split(' ').length;
    const firstName = fullname.split(' ')[0];
    let lastName = '';
    if (nameLength > 1){
      lastName = fullname.split(' ')[nameLength - 1];
    }

    const url = `${baseUrl}?domain=${domain}first_name=${firstName}&last_name=${lastName}&api_key=${hunterKey}`
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
  let url = "https://app.findymail.com/api/search/name";

  const requiredHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${findymailKey}`,
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

export const prospeoCredit = async () => {
  const url = "https://api.prospeo.io/account-information";
  
  const requiredHeaders = {
    "Content-Type": "application/json",
    "X-KEY": prospeoKey
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: requiredHeaders
    })
    .then(response => response.json());
    if (response.error) {
      return response.message
    }
    return response.response;
  } catch (error) {
    return error
  }
}

export const hunterCredit = async () => {
  const baseUrl = "https://api.hunter.io/v2/account";
  
  const url = `${baseUrl}?api_key=${hunterKey}`

  try {
    const response = await fetch(url)
      .then(response => response.json());
    if (response.errors) {
      return response.errors[0]
    }
    return response.data.requests.searches;
  } catch (error) {
    return error
  }
}

export const findymailCredit = async () => {
  const url = "https://app.findymail.com/api/credits"
  const requiredHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${findymailKey}`,
  };

  try {
    const response = await fetch(url, {
          method: "GET",
          headers: requiredHeaders,
      }).then(response => response.json());
    if (response.error) {
      return response
    }
    return response;
  } catch (error) {
    return error
  }
}
