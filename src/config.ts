import mongoose from "mongoose";


const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/todoapp`
    );
    console.log(
      `\n MONGODB conneted !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log("MONGODB connection Failed:", err);
    process.exit(1);
  }
};

export default connectDB;