import dotenv from "dotenv";
import Redis from "ioredis";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

dotenv.config({path:"../.env"});

const redis = new Redis("redis://default:0Sb8qmhpZQLFpVmySwyqRq2eUJIUEqIK@redis-10863.crce179.ap-south-1-1.ec2.redns.redis-cloud.com:10863");

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

sgMail.setApiKey("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");

export const generateOTP = (length: number = 6): string => {
    return crypto.randomInt(100000, 999999).toString();
  }

export const storeOTP = async (email: string, otp: string, expiry: number = 300): Promise<void> => {
    await redis.set(`otp:${email}`, otp, "EX", expiry);
  };

export const sendOTP = async (email: string, otp: string): Promise<void> => {
    const msg = {
      to: email,
      from: "shawkrish418@gmail.com",
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };
  
    await sgMail.send(msg);
  };