import { Express, Request, Response, Router } from 'express'
import ShareController from '../../core/controllers/ShareController';

const router = Router();

// 取得樓區室床
router.get('/bunks', ShareController.getBunks);
// 取得班級
router.get('/classes', ShareController.getClasses);
// 取得住宿生狀態
router.get('/boarderStatuses', ShareController.getBoarderStatuses);
// 取得住宿生角色
router.get('/boarderRoles', ShareController.getBoarderRoles);
// 取得電話卡聯絡人
router.get('/telCardContacters', ShareController.getTelCardContacters);
// 取得加扣點規則
router.get('/pointRules', ShareController.getPointRules);
// 取得項目
router.get('/projects', ShareController.getProjects);
// 取得某項目住宿生
router.get('/boarders', ShareController.getBoardersFromProject);
export default router;