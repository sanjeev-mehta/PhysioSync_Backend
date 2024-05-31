import { Request, Response } from 'express';
import addExerciseModel from '../../models/exercise/exercises_model';


export const createExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const { therapist_id, category_id, category_name, video_Url, video_title, description } = req.body;
      const newExercise = new addExerciseModel({
        therapist_id,
        category_id,
        category_name,
        video_Url,
        video_title,
        description,
      });
      const savedExercise = await newExercise.save();
      console.log("New exercise added successfully !")
      res.status(201).json(savedExercise);
    } catch (error) {
      console.error('Error creating exercise:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  


export const getAllExercise = async (req: Request, res: Response): Promise<void> => {
  try {
     // Retrieve all exercise categories from the database
     const exercises = await addExerciseModel.find();

     res.status(200).json(exercises);
  } catch (error) {
    console.error('Error retrieving exercise categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





export const updateExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const { exerciseId } = req.params;
    const updateData = req.body;

    // Update the exercise in the database
    const updatedExercise = await addExerciseModel.findByIdAndUpdate(exerciseId, updateData, { new: true });

    if (!updatedExercise) {
      res.status(404).json({ message: 'Exercise not found' });
      return;
    }

    res.status(200).json(updatedExercise);
  } catch (error) {
    console.error('Error updating exercise:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const delete_exercise = async (req: Request, res:Response): Promise<void>=>{
  try{
    const { exerciseId } = req.params;

    const deleted_exercise = await addExerciseModel.findByIdAndDelete(exerciseId);

  if (!deleted_exercise) {
    res.status(404).json({ message: 'Exercise not found' });
    return;
  }

  res.status(200).json(deleted_exercise);
  console.log('Exercise deleted successfully:', deleted_exercise);

} catch (error) {
  console.error('Error deleting exercise:', error);
  res.status(500).json({ message: 'Internal Server Error' });
}}

