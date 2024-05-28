import admin from '../../config/firebaseAdmin'; 
import Therapist,  { ITherapist } from './therapistSignupSchema';
import { random, authentication } from '../../helpers/index';
import { sendVerificationEmail } from '../../helpers/index';

interface TherapistData {
  therapist_name: string;
  email: string;
  profile_photo: string;
  clinic_name: string;
  clinic_address: string;
  clinic_contact_no: string;
  password: string;
}

export async function createTherapist (data: TherapistData)  {
  console.log("Received Data:", data);

  try {
    const {
      therapist_name,
      email,
      profile_photo,
      clinic_name,
      clinic_address,
      clinic_contact_no,
      password
    } = data;

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // await sendVerificationEmail(userRecord.uid);

    console.log("Firebase user created with UID:", userRecord.uid);

    const user = await admin.auth().getUser(userRecord.uid);
    const isEmailVerified = user.emailVerified; // initially it will be false

    const salt = random();
    const hashedPassword = authentication(salt, password);

    const newTherapist = new Therapist({
      therapist_name,
      email,
      profile_photo,
      clinic: {
        name: clinic_name,
        address: clinic_address,
        contact_no: clinic_contact_no,
      },
      firebase_uid: userRecord.uid,
      is_authenticated: isEmailVerified, 
      authentication: {
        salt,
        password: hashedPassword,
      },
    });

    await newTherapist.save(); 

    console.log("Therapist created successfully in MongoDB.");

    return { success: true, message: 'Therapist created successfully', data: newTherapist};

  } catch (error: any) {

    console.error("Error creating therapist:", error.message);
    
    return { success: false, message: 'Failed to create therapist' };
  }
};

export async function editTherapist(sessionToken: string, newData: Partial<TherapistData>) {
  console.log("Received Data for Editing Therapist:", newData);

  try {
    const query = { sessionToken: sessionToken };
    const therapist = await Therapist.findOne(query);

    if (!therapist) {
      console.error("Therapist not found");
      return { success: false, message: 'Therapist not found' };
    }

    therapist.therapist_name = newData.therapist_name;
    therapist.email = newData.email;
    therapist.profile_photo = newData.profile_photo;
    therapist.clinic.address = newData.clinic_address;
    therapist.clinic.contact_no = newData.clinic_contact_no;
    therapist.clinic.name = newData.clinic_name;
   
    await therapist.save();

    console.log("Therapist updated successfully in MongoDB.");

    return { success: true, message: 'Therapist updated successfully', data: therapist};

  } catch (error: any) {

    console.error("Error editing therapist:", error.message);

    return { success: false, message: 'Failed to edit therapist' };
  }
};

export async function getSingleTherapist(sessionToken: string) {
  console.log("Received therapist ID for getting Therapist:", sessionToken);

  try {
    const query = { sessionToken: sessionToken };
    const therapist = await Therapist.findOne(query);

    if (!therapist) {
      console.error("Therapist not found");
      return { success: false, message: 'Therapist not found' };
    }

    return { success: true, message: 'Therapist found successfully', data: therapist};

  } catch (error: any) {

    console.error("Error editing therapist:", error.message);

    return { success: false, message: 'Failed to edit therapist' };
  }
};
