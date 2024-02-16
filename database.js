// database.js

//--------------------------- BASE DE DATOS AWS --------------------------- //
import AWS from 'aws-sdk';


AWS.config.update({
  region: 'eu-west-3',
  // Añade tus credenciales
  accessKeyId: 'AKIA6GBMDAG7LT2EG2XJ',
  secretAccessKey: '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',
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
async function obtenerTodosLosItemsDeDynamoDB() {
  const params = {
    TableName: 'Usuarios',
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    data.Items.forEach(item => {
      console.log(JSON.stringify(item, null, 2)); // Imprime cada ítem de manera legible
    });
  } catch (error) {
    console.error('Error al obtener datos de DynamoDB:', error);
  }
}





async function añadirItemADynamoDB(nuevoUsuario) {
  const params = {
    TableName: 'Usuarios',
    Item: nuevoUsuario,
  };

  try {
    await dynamoDb.put(params).promise();
    console.log('Usuario añadido con éxito:', nuevoUsuario);
  } catch (error) {
    console.error('Error al añadir datos a DynamoDB:', error);
  }
}



export { añadirItemADynamoDB, dynamoDb , obtenerTodosLosItemsDeDynamoDB};
