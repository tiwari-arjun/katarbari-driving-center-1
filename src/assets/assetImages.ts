// Centralized static asset references for authentic driving academy photography
import heroImage from './images/hero_driving_training_1792829071906.jpg';
import carCourseImage from './images/course_car_training_1792829072293.jpg';
import motorbikeCourseImage from './images/course_motorbike_training_1792829072573.jpg';
import scooterCourseImage from './images/course_scooter_training_1792829072476.jpg';

export const ASSET_IMAGES = {
  hero: heroImage,
  courseCar: carCourseImage,
  courseMotorbike: motorbikeCourseImage,
  courseScooter: scooterCourseImage,
} as const;
