import Router from 'express-promise-router';
import { listartareas, listartarea, creartarea, actualizartarea, eliminartarea } from '../controllers/tareas.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/tareas', isAuth, listartareas);

router.get('/tareas/:id', isAuth,listartarea);

router.post('/tareas', isAuth, creartarea);

router.put('/tareas/:id', isAuth, actualizartarea);

router.delete('/tareas/:id', isAuth, eliminartarea);

export default router;