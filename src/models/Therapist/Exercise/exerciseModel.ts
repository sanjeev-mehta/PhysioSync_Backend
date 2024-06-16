import Assignment, { IAssignment } from './exerciseSchema'; 
import mongoose from 'mongoose';

interface AssignExerciseData {
  exercise_id: mongoose.Types.ObjectId;
  patient_id: mongoose.Types.ObjectId;
  start_date: Date;
  end_date: Date;
  status?: 'assigned' | 'completed';
  is_awaiting_reviews?: boolean;
  patient_video_url?: string;
  patient_exercise_completion_date_time?: Date;
}

interface EditAssignExerciseData {
  exercise_id?: mongoose.Types.ObjectId;
  start_date?: Date;
  end_date?: Date;
  status?: 'assigned' | 'completed';
  is_awaiting_reviews?: boolean;
  patient_video_url?: string;
  patient_exercise_completion_date_time?: Date;
}

export async function addassignExercise(data: AssignExerciseData) {
  console.log("Received Data:", data);

  try {
    const {
      exercise_id,
      patient_id,
      start_date,
      end_date,
      status = 'assigned',
      is_awaiting_reviews = false,
      patient_video_url,
      patient_exercise_completion_date_time
    } = data;

    const newAssignment = new Assignment({
      exercise_id,
      patient_id,
      start_date,
      end_date,
      status,
      is_awaiting_reviews,
      patient_video_url,
      patient_exercise_completion_date_time
    });

    await newAssignment.save();

    console.log("Exercise assigned successfully in MongoDB.");

    return { success: true, message: 'Exercise assigned successfully', data: newAssignment };

  } catch (error: any) {
    console.error("Error assigning exercise:", error.message);
    return { success: false, message: 'Failed to assign exercise' };
  }
}

export async function editAssignExercise(id: string, newData: EditAssignExerciseData) {
  console.log("Received Data for Editing Assignment:", newData);

  try {
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      console.error("Assignment not found");
      return { success: false, message: 'Assignment not found' };
    }

    if (newData.exercise_id) assignment.exercise_id = newData.exercise_id;
    if (newData.start_date) assignment.start_date = newData.start_date;
    if (newData.end_date) assignment.end_date = newData.end_date;
    if (newData.status) assignment.status = newData.status;
    if (newData.is_awaiting_reviews !== undefined) assignment.is_awaiting_reviews = newData.is_awaiting_reviews;
    if (newData.patient_video_url) assignment.patient_video_url = newData.patient_video_url;
    if (newData.patient_exercise_completion_date_time) assignment.patient_exercise_completion_date_time = newData.patient_exercise_completion_date_time;

    await assignment.save();

    console.log("Assignment updated successfully in MongoDB.");

    return { success: true, message: 'Assignment updated successfully', data: assignment };

  } catch (error: any) {
    console.error("Error editing assignment:", error.message);
    return { success: false, message: 'Failed to edit assignment' };
  }
}

export async function getAssignedExercise(id: string) {
  console.log("Received Assignment ID for getting Assignment:", id);

  try {
    const assignment = await Assignment.find({patient_id: id, is_awaiting_reviews: false})
    .populate('exercise_id')
    .populate('patient_id');

    if (!assignment) {
      console.error("Assignment not found");
      return { success: false, message: 'Assignment not found' };
    }

    return { success: true, message: 'Assignment found successfully', data: assignment };

  } catch (error: any) {
    console.error("Error getting assignment:", error.message);
    return { success: false, message: 'Failed to get assignment' };
  }
}
