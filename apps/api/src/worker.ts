import dotenv from "dotenv";
import Redis from "ioredis";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL as string);

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

sgMail.setApiKey(process.env.SEND_GRID_API_KEY as string);

export const generateOTP = (length: number = 6): string => {
    return crypto.randomInt(100000, 999999).toString();
  }

export const storeOTP = async (email: string, otp: string, expiry: number = 300): Promise<void> => {
    await redis.set(`otp:${email}`, otp, "EX", expiry);
  };

export const sendOTP = async (email: string, otp: string): Promise<void> => {
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL as string,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };
  
    await sgMail.send(msg);
  };