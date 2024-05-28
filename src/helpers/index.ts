require('dotenv').config();
import crypto from 'crypto';
import admin from '../config/firebaseAdmin'; 

const SECRET = 'PHYSIOSYNC-SRG-REST-API';

export const random =() => crypto.randomBytes(128).toString('base64');

export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}


export async function sendVerificationEmail(uid: any) {
    try {
      const user = await admin.auth().getUser(uid);
      const idToken = await admin.auth().createCustomToken(uid);
  

      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.firebae_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestType: 'VERIFY_EMAIL',
          idToken: idToken
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Verification email sent.');
      } else {
        console.error('Error sending verification email:', data.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }