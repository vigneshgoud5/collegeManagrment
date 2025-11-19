import { env } from './config/env.js';
import { app, initializeApp } from './app.js';

// Start server
export const startServer = async () => {
  try {
    await initializeApp();
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
startServer();
}

export default app;

