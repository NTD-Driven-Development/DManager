import { Express, Request, Response, Router } from "express";
import authRouter from "./mapping/auth";
import sseRouters from './mapping/sse';
import userRouters from './mapping/user';
import shareRouters from './mapping/share';
import projectRouters from './mapping/project';
import boarderRouters from './mapping/boarder';
import boarderRoleRouters from './mapping/boarderRole';
import boarderStatusRouters from './mapping/boarderStatus';
import classRouters from './mapping/class';
import pointRuleRouters from './mapping/pointRule';
import telCardRouters from './mapping/telCard';

const router = Router();

router.use('/auth', authRouter);
router.use('/sse', sseRouters);
router.use('/users', userRouters);
router.use('/share', shareRouters);
router.use('/projects', projectRouters);
router.use('/boarders', boarderRouters);
router.use('/boarderRoles', boarderRoleRouters);
router.use('/boarderStatuses', boarderStatusRouters);
router.use('/classes', classRouters);
router.use('/pointRules', pointRuleRouters);
router.use('/telCards', telCardRouters);

export default router;