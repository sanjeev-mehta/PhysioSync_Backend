import mongoose, { Document, Schema, Types } from 'mongoose';

export interface AddExercise extends Document {
    therapist_id: string;
    category_id: Types.ObjectId[];
    category_name: [string];
    video_Url: string;
    video_title: string;
    description: string;
    video_thumbnail: string;
}

const addExerciseSchema = new Schema({
    therapist_id: { type: String, required: true },
    category_id: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
    category_name: [{ type: String, required: true }],
    video_Url: { type: String, required: true },
    video_title: { type: String, required: true },
    description: { type: String, required: true },
    video_thumbnail: {type: String, required: true}
});

const addExerciseModel = mongoose.model<AddExercise>('exercises', addExerciseSchema);

export default addExerciseModel;
