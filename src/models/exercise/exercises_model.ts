import mongoose, { Document, Schema } from 'mongoose';


export interface addExercise extends Document{
    
    therapist_id:String;
    category_id: String;
    category_name:String;
    video_Url: String;
    video_title: String;
    description: String;
   

}

const addExerciseSchema = new Schema({
    therapist_id: { type: String, required: true },
    category_id: { type: String, required: true },
    category_name: { type: String, required: true },
    video_Url: { type: String, required: true },
    video_title: { type: String, required: true },
    description: { type: String, required: true },
  });

  const addExerciseModel = mongoose.model<addExercise>('exercises', addExerciseSchema);


  export default addExerciseModel;
