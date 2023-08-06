import { Express, Request, Response, Router } from 'express'
import SseController from '../../core/controllers/SseController';

const router = Router();

router.get('', SseController.sseTest);

export default router;