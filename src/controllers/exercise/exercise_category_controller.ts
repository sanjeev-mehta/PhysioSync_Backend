import { Request, Response } from 'express';
import ExerciseCategoryModel from '../../models/exercise/exercise_category_model';

export const createExerciseCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoriesData = [
      { name: 'neck', image_link: 'neck_image_url' },
      { name: 'Elbow', image_link: 'arm_image_url' },
      { name: 'Knee', image_link: 'legs_image_url' },
      { name: 'shoulder', image_link: 'shoulder_image_url'},
      { name: 'Back', image_link: 'shoulder_image_url'},
      { name: 'Ankle', image_link: 'shoulder_image_url'}
    ];

    await ExerciseCategoryModel.insertMany(categoriesData);
    
    res.status(201).json({ success: true, message: 'Exercise categories added successfully' });
  
  } catch (error) {
    console.error('Error creating exercise categories:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getAllExerciseCategories = async (req: Request, res: Response): Promise<void> => {
  try {
     const categories = await ExerciseCategoryModel.find();
    
     if (!res.headersSent) {
      res.status(200).json({ success: true, message: 'Exercise categories retrieved successfully', data: categories });
    }
    
  } catch (error) {
    console.error('Error retrieving exercise categories:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};