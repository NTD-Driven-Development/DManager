import { Express, Request, Response, Router } from 'express'
import ShareController from '../../core/controllers/ShareController';

const router = Router();

router.get('/bunks', ShareController.getBunks);

export default router;