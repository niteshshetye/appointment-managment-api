export const APPOINTMENT_STATUS = ['PENDING', 'ACCEPTED', 'DECLIEND'];

export const APPOINTMENT_SCHEMA_DATABASE_VALIDATION_MESSAGE = {
  MANAGER_ID_REQUIRED: 'Appointment should have manager',
  TITLE_REQUIRED: 'Title is required',
  MIN_LENGTH_TITLE: 'Title should atleast contain 3 characters long',
  MAX_LENGTH_TITLE: 'Title should not more than contain 300 characters',
  DESCRIPTION_REQUIRED: 'Description is required',
  APPOINTMENT_DATE_REQUIRED: 'Appointment date is required',
};

export const APPOINTMENT_ATTENDEES_SCHEMA_DATABASE_VALIDATION_MESSAGE = {
  APPOINTMENT_ID_REQUIRED: 'Appointment id is required',
  DEVELOPER_ID_REQUIRED: 'Developer is required',
  CREATED_BY_REQUIRED: 'Created by is required',
  DEFAULT_STATUS_VALUE: APPOINTMENT_STATUS[0],
};

export const BLOCKED_USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE = {
  USER_ID_REQUIRED: 'User is required',
  BLOCKED_USER_ID_REQUIRED: 'Blocked User is required',
};

export const USERS_SCHEMA_DATABASE_VALIDATION_MESSAGE = {
  FIRST_NAME_REQUIRED: 'Firstname is required',
  LAST_NAME_REQUIRED: 'Lastname is required',
  EMAIL_REQUIRED: 'Email is requried',
  EMAIL_VALIDATE: 'Provide valid email',
  PASSWORD_REQUIRED: 'Password is required',
  MIN_LENGTH_PASSWORD: 'Password must be atleast 3 char long',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  MIN_LENGTH_CONFIRM_PASSWORD: 'Confirm password must be atleast 3 char long',
  VALIDATE_CONFIRM_PASSWORD: 'Password does not match with confirm password',
};

export const PRODUCTION = 'production';
export const DEVELOPMENT = 'development';

export const ERROR_TYPE = {
  CAST_ERROR: 'CastError',
  VALIDATION_ERROR: 'ValidationError',
  JSON_WEB_TOKEN_ERROR: 'JsonWebTokenError',
  TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
  ZOD_ERROR: 'ZodError',
};
