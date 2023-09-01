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
import pointRouters from './mapping/point';
import telCardRouters from './mapping/telCard';
import noteRouters from './mapping/note';

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
router.use('/points', pointRouters);
router.use('/telCards', telCardRouters);
router.use('/notes', noteRouters);

export default router;