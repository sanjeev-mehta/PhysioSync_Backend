import mongoose from "mongoose";

const therapist_Signup_Schema = new mongoose.Schema({
    therapist_name: {type:String, required: true},
    email: {type: String, required: true},
    profile_photo: {type: String, required: true},
    clinic:{
        name:{type: String, required: true},
        address: {type: String, required: true},
        contact_no: {type: String, required: true},
    },
    authentication:{
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false}
    }
})


export const UserModel = mongoose.model('therapist', therapist_Signup_Schema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: String) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionToken: String) => UserModel.findOne({'authentication.sessionToken': sessionToken})
export const getUserById = (id: String) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((therapist) => therapist.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id: id});
export const updatePatientById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)