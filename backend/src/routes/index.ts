import { Express, Request, Response, Router } from "express";
import authRouter from "./mapping/auth";
import sseRouters from './mapping/sse';
import userRouters from './mapping/user';
import shareRouters from './mapping/share';

const router = Router();

router.use('/auth', authRouter);
router.use('/sse', sseRouters);
router.use('/users', userRouters);
router.use('/share', shareRouters);

export default router;