import { Express, Request, Response, Router } from 'express'
import ShareController from '../../core/controllers/ShareController';

const router = Router();

// 取得樓區室床
router.get('/bunks', ShareController.getBunks);
// 取得班級
router.get('/classes', ShareController.getClasses);
export default router;