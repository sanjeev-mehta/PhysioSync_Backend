import Assignment, { IAssignment } from './exerciseSchema'; 
import mongoose from 'mongoose';
import Patient from '../../../models/Patient/patientModel';

interface AssignExerciseData {
  exercise_ids: mongoose.Types.ObjectId[];
  patient_id: mongoose.Types.ObjectId;
  start_date: string;
  end_date: string;
  status?: 'assigned' | 'completed';
  is_awaiting_reviews?: boolean;
  patient_video_url?: string;
  patient_exercise_completion_date_time?: string;
  therapist_id?: string;
}

interface EditAssignExerciseData {
  exercise_ids?: mongoose.Types.ObjectId[];
  start_date?: string;
  end_date?: string;
  status?: 'assigned' | 'completed';
  is_awaiting_reviews?: boolean;
  patient_video_url?: string;
  patient_exercise_completion_date_time?: string;
  therapist_id?: string;
}

export async function addassignExercise(data: AssignExerciseData) {
  console.log("Received Data:", data);


  try {

    const {
      exercise_ids,
      patient_id,
      start_date,
      end_date,
      status = 'assigned',
      is_awaiting_reviews = false,
      patient_video_url,
      patient_exercise_completion_date_time,
    } = data;

    const newAssignment = new Assignment({
      exercise_ids,
      patient_id,
      start_date,
      end_date,
      status,
      is_awaiting_reviews,
      patient_video_url,
      patient_exercise_completion_date_time,
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

    if (newData.exercise_ids) assignment.exercise_ids = newData.exercise_ids;
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
    const patient = await Patient.findById(id);
    const assignment = await Assignment.find({patient_id: id, is_awaiting_reviews: false})
    .populate('exercise_ids')

    console.log(patient);
    if (patient === null) {
      console.error("Assignment not found");
      return { success: false, message: 'Patient not found' };
    }

    return {exercise: assignment, patient: patient};

  } catch (error: any) {
    console.error("Error getting assignment:", error.message);
    return { success: false, message: 'Failed to get assignment' };
  }
}

export async function getNotification(id: string) {
  try {
    const assignment = await Assignment.find({therapist_id: id, status:"completed", is_awaiting_reviews: false})

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