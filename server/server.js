import dotenv from 'dotenv'
import app from './src/app';
import connectDB from './src/config/db';

dotenv.config();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB()

        const server = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });

        // when restart/redeploy app hosting pltfm sends SIGTERM and with this
        // we stop accepting new req and let exisitng ones finish
        server.on("SIGTERM", () => {
            server.close(() => {
                console.log("Process terminated");
                process.exit(0);
            })
        })
    } catch (error) {
        console.error('Failed to start server:', error.message)
        process.exit(1)
    }
}

startServer();