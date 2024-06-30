import { Request, Response } from 'express';
import PatientWatchData from '../../models/Patient/watchData'

export const createWatchData = async (req: Request, res: Response) => {
  try {
    const { patient_id, calories, heartRate, sleep, stepCount } = req.body;

   
    if (!patient_id || !calories || !heartRate || !sleep || !stepCount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

   
    const watchData = new PatientWatchData({ patient_id, calories, heartRate, sleep, stepCount });

    
    await watchData.save();

    
    res.status(201).json(watchData);
  } catch (error) {
    console.error('Error creating watch data:', error);
    res.status(500).json({ error: 'An error occurred while creating watch data' });
  }
};


export const getWatchData = async (req: Request, res: Response) => {
    try {
        const { patient_id } = req.params;

        const watchData = await PatientWatchData.find({ patient_id }).populate('patient_id');
        
        if (!watchData || watchData.length === 0) {
            return res.status(404).json({ error: 'No watch data found for this patient' });
        }

        res.status(200).json(watchData);
    } catch (error) {
        console.error('Error fetching watch data:', error);
        res.status(500).json({ error: 'An error occurred while fetching watch data' });
    }
};


export const updateWatchData = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;
        const { calories, heartRate, sleep, stepCount } = req.body;


        if (!calories && !heartRate && !sleep && !stepCount) {
            return res.status(400).json({ error: 'Missing fields to update' });
        }
        console.log("-----",patientId)

        let watchData = await PatientWatchData.findOne({ patient_id: patientId });
        console.log("88888", watchData)

        if (!watchData) {
            return res.status(404).json({ error: 'Watch data not found' });
        }

        if (calories) {
            watchData.calories = calories;
        }
        if (heartRate) {
            watchData.heartRate = heartRate;
        }
        if (sleep) {
            watchData.sleep = sleep;
        }
        if (stepCount) {
            watchData.stepCount = stepCount;
        }

        await watchData.save();

        res.status(200).json(watchData); 
    } catch (error) {
        console.error('Error updating watch data:', error);
        res.status(500).json({ error: 'An error occurred while updating watch data' });
    }
};