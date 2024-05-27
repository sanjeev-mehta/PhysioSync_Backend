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


