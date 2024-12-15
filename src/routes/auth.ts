import express from 'express';
import { authController } from '../controller/auth';

const routes = express.Router();

routes.route('/signup').post(authController.signup);
routes.route('/signin').post(authController.signin);
routes.route('/forgot-password').post(authController.forgotPassword);
routes.route('/reset-password/:token').post(authController.resetPassword);

export default routes;
