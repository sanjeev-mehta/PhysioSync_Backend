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
    status?: 'assigned' | 'completed' | 'reviewed';
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
      is_awaiting_reviews = true,
      patient_video_url,
      patient_exercise_completion_date_time,
      therapist_id
    } = data;

    const formattedExerciseIds = exercise_ids.map(id => ({
      exercise_id: id.exercise_id,
      is_assigned: id.is_assigned ?? true,
      is_awaiting_reviews: id.is_awaiting_reviews ?? is_awaiting_reviews,
      status: status,
    }));

    const newAssignment = new Assignment({
      exercise_ids: formattedExerciseIds,
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
          console.log(newData.is_awaiting_reviews)
          return {
            exercise_id: objectId,
            is_assigned: true,
            is_awaiting_reviews: assignment.is_awaiting_reviews
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

    await assignment.save();

    console.log("Assignment updated successfully in MongoDB.");

    return { success: true, message: 'Assignment updated successfully', data: assignment };

  } catch (error: any) {
    console.error("Error editing assignment:", error.message);
    return { success: false, message: 'Failed to edit assignment' };
  }
}

export async function getNotification(id: string) {
  try {
    const assignment = await Assignment.find({therapist_id: id, "exercise_ids.status":"completed", "exercise_ids.is_awaiting_reviews": true})
    .populate('patient_id')
    .populate('exercise_ids.exercise_id');

    console.log(assignment, id)
    if (!assignment) {
      console.error("Assignment not found");
      return  { success: false, message: 'Assignment not found', data: [] };
    }

   const filteredAssignments = assignment.map(assignment => {
      const filteredExerciseIds = assignment.exercise_ids.filter(exercise => exercise.status === 'completed');
      return {
        ...assignment.toObject(), 
        exercise_ids: filteredExerciseIds
      };
    })

    console.log(filteredAssignments, id);
    
    if (filteredAssignments.length === 0) {
      console.error("Assignment not found");
      return { success: false, message: 'Assignment not found', data: [] };
    }

    return { success: true, message: 'Assignment found successfully', data: filteredAssignments};

  } catch (error: any) {
    console.error("Error getting assignment:", error.message);
    return { success: false, message: 'Failed to get assignment', data: [] };
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
            is_awaiting_reviews: newData.is_awaiting_reviews  == undefined? c.is_awaiting_reviews : newData.is_awaiting_reviews, 
            status: newData.status == undefined? 'completed': newData.status,
            patient_video_url: newData.patient_video_url == undefined? c.patient_video_url : newData.patient_video_url,
            patient_exercise_completion_date_time: newData.patient_exercise_completion_date_time == undefined? c.patient_exercise_completion_date_time : newData.patient_exercise_completion_date_time
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