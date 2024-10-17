const { v4: uuidv4 } = require('uuid');

// In-memory database (replace with a proper database in production)
let patients = [];

exports.handler = async (event, context) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '');
  const method = event.httpMethod;

  try {
    switch (true) {
      case method === 'GET' && path === '/patients':
        return {
          statusCode: 200,
          body: JSON.stringify(patients),
        };

      case method === 'POST' && path === '/patients':
        const newPatient = JSON.parse(event.body);
        newPatient.id = uuidv4();
        patients.push(newPatient);
        return {
          statusCode: 201,
          body: JSON.stringify(newPatient),
        };

      case method === 'PUT' && path.match(/^\/patients\/[\w-]+$/):
        const patientId = path.split('/')[2];
        const updatedPatient = JSON.parse(event.body);
        const index = patients.findIndex(p => p.id === patientId);
        if (index !== -1) {
          patients[index] = { ...patients[index], ...updatedPatient };
          return {
            statusCode: 200,
            body: JSON.stringify(patients[index]),
          };
        }
        return { statusCode: 404, body: 'Patient not found' };

      case method === 'GET' && path.match(/^\/patients\/[\w-]+\/notes$/):
        // Implement get notes logic here
        return { statusCode: 200, body: JSON.stringify([]) };

      case method === 'POST' && path === '/notes':
        // Implement add note logic here
        return { statusCode: 201, body: JSON.stringify({}) };

      default:
        return { statusCode: 404, body: 'Not Found' };
    }
  } catch (error) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};