import { Express, Request, Response, Router } from 'express'
import ProjectController from '../../core/controllers/ProjectController';
import jwtAuth from '../../middlewares/jwtAuth';
import validate from '../../middlewares/validateRequest';


const router = Router();


// router.use(jwtAuth("jwt"));
router.get('', ProjectController.getAllProjectsData);
router.get('/:id', ProjectController.getProjectDataById);
router.post('/import', [], ProjectController.importBoardersData);
router.post('/:id/bunks', [], ProjectController.createProjectBunk);
router.post('/:id/exchangeBunk', [], ProjectController.exchangeBunk);
router.post('', [], ProjectController.createProject);
router.put('', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

export default router;