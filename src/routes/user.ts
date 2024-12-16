import express from 'express';
import { updateUserRole } from '../controller/user';
import { verifyToken } from '../middleware/verifyToken';
import { allowedRoles } from '../middleware/allowedRoles';
import { Role } from '../model/user';

const router = express.Router();

router
  .route('/update-role')
  .post(verifyToken, allowedRoles(Role.HR), updateUserRole);

export default router;
