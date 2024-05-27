import { Request, Response } from 'express';
import ExerciseCategoryModel from '../../models/exercise/exercise_category_model';

export const createExerciseCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoriesData = [
      { name: 'neck', image_link: 'neck_image_url' },
      { name: 'arm', image_link: 'arm_image_url' },
      { name: 'legs', image_link: 'legs_image_url' },
      { name: 'shoulder', image_link: 'shoulder_image_url'}
    ];

    await ExerciseCategoryModel.insertMany(categoriesData);
    res.status(201).json({ message: 'Exercise categories created successfully' });
  } catch (error) {
    console.error('Error creating exercise categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





export const getAllExerciseCategories = async (req: Request, res: Response): Promise<void> => {
  try {
     // Retrieve all exercise categories from the database
     const categories = await ExerciseCategoryModel.find();

     // Map categories to include ID
     const categoriesWithIds = categories.map(category => ({
       id: category._id,
       name: category.name,
       image_link: category.image_link
     }));
 
     // Send the categories with IDs in the response
     res.status(200).json(categoriesWithIds);
  } catch (error) {
    console.error('Error retrieving exercise categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


