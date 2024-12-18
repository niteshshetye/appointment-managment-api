import express from 'express';
import { deleteUser, getAllUsers, updateUserRole } from '../controller/user';
import { verifyToken } from '../middleware/verifyToken';
import { allowedRoles } from '../middleware/allowedRoles';
import { Role } from '../model/user';

const router = express.Router();

router.use(verifyToken, allowedRoles(Role.HR));

router.route('/update-role').post(updateUserRole);

router.route('/').get(getAllUsers);
router.route('/:userId').delete(deleteUser);

export default router;
