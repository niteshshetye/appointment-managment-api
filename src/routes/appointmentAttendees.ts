import express from 'express';
import {
  getMyAppointment,
  updateAppointmentStatus,
} from '../controller/appointmentAttendees';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.use(verifyToken);

router.route('/').get(getMyAppointment);
router.route('/:id').patch(updateAppointmentStatus);

export default router;
