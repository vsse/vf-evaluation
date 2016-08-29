import express from 'express';
import authRoutes from './auth';
import employeeRoutes from './employee';
import teamRoutes from './team';
import surveyRoutes from './survey';
import questionRoutes from './question';
import typeRoutes from './type';
import goalRoutes from './goal';
import categoryRoutes from './category';
import roleRoutes from './role';
import resultRoutes from './result';
import settingRoutes from './setting';

const router = express.Router();	// eslint-disable-line new-cap

// Mount routes at their uris
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/teams', teamRoutes);
router.use('/surveys', surveyRoutes);
router.use('/questions', questionRoutes);
router.use('/types', typeRoutes);
router.use('/goals', goalRoutes);
router.use('/categories', categoryRoutes);
router.use('/roles', roleRoutes);
router.use('/results', resultRoutes);
router.use('/settings', settingRoutes);

export default router;
