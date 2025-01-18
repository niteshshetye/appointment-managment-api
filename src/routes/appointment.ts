import express from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { allowedRoles } from '../middleware/allowedRoles';
import { Role } from '../model/user';
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  getAppointments,
  updateAppointment,
} from '../controller/appointment';

const router = express.Router();

router.use(verifyToken);

router.route('/:id').get(getAppointment);

router.use(allowedRoles(Role.MANAGER));
router.route('/').post(createAppointment).get(getAppointments);
router.route('/:id').patch(updateAppointment).delete(deleteAppointment);

export default router;
