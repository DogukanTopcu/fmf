import { AppDataSource } from './config/database.config';


const ConnectDB = async () => {
  // Initialize database connection
  await AppDataSource.initialize()
    .then(() => {
      console.log('Database connection established successfully');
    })
    .catch((error) => {
      console.error('Error connecting to the database:', error);
    }); 
}

export default ConnectDB;