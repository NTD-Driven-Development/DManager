import { Express, Request, Response, Router } from 'express'
import SseController from '../../core/controllers/SseController';

const router = Router();

router.get('/boarders', SseController.getAreaOfBoarderStatus);

export default router;