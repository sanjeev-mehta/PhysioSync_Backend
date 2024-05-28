import mongoose, { Document, Schema } from 'mongoose';

export interface ExerciseCategoryDocument extends Document {
  name: string;
  image_link: string;
}

const ExerciseCategorySchema = new Schema({
  name: { type: String, required: true },
  image_link: { type: String, required: true }
});

const ExerciseCategoryModel = mongoose.model<ExerciseCategoryDocument>('Exercise_Category', ExerciseCategorySchema);

export default ExerciseCategoryModel;
