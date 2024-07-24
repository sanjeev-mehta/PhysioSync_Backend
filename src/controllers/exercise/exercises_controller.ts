import { Request, Response } from 'express';
import addExerciseModel from '../../models/exercise/exercises_model';
import Therapist from '../../models/Therapist/therapistSignupSchema';
import messages from 'router/messages/messages';

export const createExercise = async (req: Request, res: Response): Promise<void> => {
    try {

      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
         res.status(401).json({ status: false, message: "Authorization header not found" });
         return
      }

      const [bearer, sessionToken] = authorizationHeader.split(' ');

    if (!sessionToken || bearer !== 'Bearer') {
       res.status(401).json({ status: false, message: "Session token not found or invalid format" });
       return
    }

      const therapist = await Therapist.findOne({ 'authentication.sessionToken': sessionToken });

      console.log(therapist)

      if (!therapist) {
         res.status(404).json({ success: false, message: 'Therapist not found please login again ' });
         return
      }

      const { category_id, category_name, video_Url, video_title, description, video_thumbnail } = req.body;
      const newExercise = new addExerciseModel({
        therapist_id: therapist._id,
        category_id,
        category_name,
        video_Url,
        video_title,
        description,
        video_thumbnail
      });

      const savedExercise = await newExercise.save();

      res.status(201).json({ message: 'Exercise has been added', success: true, data: savedExercise });
    
    } catch (error) {
      console.error('Error creating exercise:', error);
      res.status(500).json({ message: 'Internal Server Error', success: false});
    }
  };

export const getAllExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization;
    const {name} = req.query;

    if (!authorizationHeader) {
       res.status(401).json({ status: false, message: "Authorization header not found" });
       return
    }

    const [bearer, sessionToken] = authorizationHeader.split(' ');

  if (!sessionToken || bearer !== 'Bearer') {
     res.status(401).json({ status: false, message: "Session token not found or invalid format" });
     return
  }
   
    const therapist = await Therapist.findOne({ 'authentication.sessionToken': sessionToken });

    if (!therapist) {
         res.status(404).json({ success: false, message: 'Therapist not found please login again ' });
         return
    }
    
    if (!name) {
      res.status(400).json({ message: 'Name query parameter is required' });
      return;
    }
    
    const finalToken = therapist._id as string;
  
    const query = {therapist_id: finalToken, category_name: name as string}
    
    const exercises = await addExerciseModel.find(query);

    res.status(200).json({success: true,message: "All exercise fetched successfuly",  data: exercises});
 
  } catch (error) {
    console.error('Error retrieving exercise categories:', error);
    res.status(500).json({ message: 'Internal Server Error' , success: false});
  }
};

export const updateExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization;
    const { exerciseId } = req.params;
    const { category_id, category_name, video_Url, video_title, description, video_thumbnail } = req.body;

    console.log("here is auth", authorizationHeader)

    if (!authorizationHeader) {
      res.status(401).json({ status: false, message: "Authorization header not found" });
      return
   }

   const [bearer, sessionToken] = authorizationHeader.split(' ');

 if (!sessionToken || bearer !== 'Bearer') {
    res.status(401).json({ status: false, message: "Session token not found or invalid format" });
    return
 }
  console.log("here is your session token", sessionToken);

    const therapist = await Therapist.findOne({ 'authentication.sessionToken': sessionToken });

    console.log("here is your therapist", therapist);

    if (!therapist) {
      res.status(404).json({ success: false, message: 'Therapist not found, please login again' });
      return;
    }

    const updateData = {
      therapist_id: therapist._id,
      category_id,
      category_name,
      video_Url,
      video_title,
      description,
      video_thumbnail
    };

    const updatedExercise = await addExerciseModel.findByIdAndUpdate(exerciseId, updateData, { new: true });

    if (!updatedExercise) {
      res.status(404).json({ message: 'Exercise not found', success: false });
      return;
    }

    res.status(200).json({ message: 'Exercise has been updated', success: true, data: updatedExercise });

  } catch (error) {
    console.error('Error updating exercise:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

export const delete_exercise = async (req: Request, res:Response): Promise<void>=>{
  
  try{
    const { exerciseId } = req.params;
    const deleted_exercise = await addExerciseModel.findByIdAndDelete(exerciseId);
  
    if (!deleted_exercise) {
    res.status(404).json({ message: 'Exercise Not Found', success: false });
    return;
  }

  res.status(200).json({message: 'Exercise has been deleted', success: true});
  
} catch (error) {
  console.error('Error deleting exercise:', error);
  res.status(500).json({ message: 'Internal Server Error', success: false });
}}