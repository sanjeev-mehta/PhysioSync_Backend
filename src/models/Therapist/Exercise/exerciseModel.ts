import Assignment, { IAssignment } from './exerciseSchema'; 
import mongoose, { ObjectId } from 'mongoose';
import Patient from '../../../models/Patient/patientModel';

interface AssignExerciseData {
  exercise_ids: {
    exercise_id: mongoose.Types.ObjectId;
    is_assigned?: boolean;
    is_awaiting_reviews?: boolean;
  }[];
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
  exercise_ids?: {
    exercise_id: mongoose.Types.ObjectId;
    is_assigned?: boolean;
    is_awaiting_reviews?: boolean;
    status: 'assigned' | 'completed' | 'reviewed';
    patient_video_url?: string;
    patient_exercise_completion_date_time?: string;
  }[];
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
      therapist_id
    } = data;

    const sentExerciseID = {
      exercise_id: data.exercise_ids,
      is_assigned: true, 
      is_awaiting_reviews: false,
      status: 'assigned', 
    }

    const newAssignment = new Assignment({
      exercise_ids: sentExerciseID,
      patient_id,
      start_date,
      end_date,
      status,
      is_awaiting_reviews,
      patient_video_url,
      patient_exercise_completion_date_time,
      therapist_id
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

    if (newData.exercise_ids && Array.isArray(newData.exercise_ids)) {
      assignment.exercise_ids = newData.exercise_ids.map((exerciseId) => {
        try {
          const objectId = new mongoose.Types.ObjectId(`${exerciseId}`);
          return {
            exercise_id: objectId,
            is_assigned: true,
            is_awaiting_reviews: false,
          } 
        } catch (error) {
          console.error("Invalid exercise_id format:", exerciseId);
          return {
            exercise_id: null,
            is_assigned: false,
            is_awaiting_reviews: false, 
          } 
        }
      });
    }

    if (newData.start_date) assignment.start_date = newData.start_date;
    if (newData.end_date) assignment.end_date = newData.end_date;
    if (newData.status) assignment.status = newData.status;
    if (newData.is_awaiting_reviews !== undefined) assignment.is_awaiting_reviews = newData.is_awaiting_reviews;
    if (newData.patient_video_url) assignment.patient_video_url = newData.patient_video_url;
    if (newData.patient_exercise_completion_date_time) assignment.patient_exercise_completion_date_time = newData.patient_exercise_completion_date_time;
    if (newData.therapist_id) assignment.therapist_id = newData.therapist_id;

    await assignment.save();

    console.log("Assignment updated successfully in MongoDB.");

    return { success: true, message: 'Assignment updated successfully', data: assignment };

  } catch (error: any) {
    console.error("Error editing assignment:", error.message);
    return { success: false, message: 'Failed to edit assignment' };
  }
}

// export async function getAssignedExercise(id: string) {
//   console.log("Received Assignment ID for getting Assignment:", id);

//   try {
//     const patient = await Patient.findById(id);
//     const assignment = await Assignment.find({patient_id: id, is_awaiting_reviews: false})
//     .populate('exercise_ids')

//     console.log(patient);
//     if (patient === null) {
//       console.error("Assignment not found");
//       return { success: false, message: 'Patient not found' };
//     }

//     return {exercise: assignment, patient: patient};

//   } catch (error: any) {
//     console.error("Error getting assignment:", error.message);
//     return { success: false, message: 'Failed to get assignment' };
//   }
// }

export async function getNotification(id: string) {
  try {
    const assignment = await Assignment.find({therapist_id: id, "exercise_ids.status":"completed", "exercise_ids.is_awaiting_reviews": false})
    .populate('patient_id')
    .populate('exercise_ids.exercise_id');

    console.log(assignment, id)
    if (!assignment) {
      console.error("Assignment not found");
      return { success: false, message: 'Assignment not found' };
    }

    const filteredAssignments = assignment.map(assignment => {
      const filteredExerciseIds = assignment.exercise_ids.filter(exercise => exercise.status === 'completed');
      return {
        ...assignment.toObject(), // Convert Mongoose document to plain object
        exercise_ids: filteredExerciseIds
      };
    });

    console.log(filteredAssignments, id);
    if (filteredAssignments.length === 0) {
      console.error("Assignment not found");
      return { success: false, message: 'Assignment not found' };
    }

    return { success: true, message: 'Assignment found successfully', data: filteredAssignments };

  } catch (error: any) {
    console.error("Error getting assignment:", error.message);
    return { success: false, message: 'Failed to get assignment' };
  }
}


export async function updateCompleted(id: string, newData: EditAssignExerciseData) {

  try {
    const assignment = await Assignment.findByIdAndUpdate(id);

    console.log('this is the id and Data', id, newData);

    if (!assignment) {
      console.error("Assignment not found");
      return { success: false, message: 'Assignment not found' };
    }

    if (newData.exercise_ids) {
      const newExerciseId = new mongoose.Types.ObjectId(`${newData.exercise_ids.toString()}`);
    
      assignment.exercise_ids = assignment.exercise_ids.map((c) => {
        console.log('here is true or false', c.exercise_id.equals(newExerciseId))
        if (c.exercise_id.equals(newExerciseId)) {
          return {
            exercise_id: newExerciseId,
            is_assigned: true, 
            is_awaiting_reviews: false, 
            status: 'completed',
            patient_video_url: newData.patient_video_url,
            patient_exercise_completion_date_time: newData.patient_exercise_completion_date_time
          };
        }
        return c;
      });
    }

    await assignment.save();

    return { success: true, message: 'Assignment updated successfully', data: assignment };

  } catch (error: any) {
    console.error("Error editing assignment:", error.message);
    return { success: false, message: 'Failed to edit assignment' };
  }
}