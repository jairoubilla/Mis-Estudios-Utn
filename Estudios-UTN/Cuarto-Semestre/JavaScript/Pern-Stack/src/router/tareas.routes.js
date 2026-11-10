import Router from 'express-promise-router';
import { listartareas, listartarea, creartarea, actualizartarea, eliminartarea } from '../controllers/tareas.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middlewares.js';
import { createTareasSchema, updateTareasSchema } from '../schemas/tareas.schema.js';

const router = Router();

router.get('/tareas', isAuth, listartareas);

router.get('/tareas/:id', isAuth,listartarea);

router.post('/tareas', isAuth, validateSchema(createTareasSchema), creartarea);

router.put('/tareas/:id', isAuth, validateSchema(updateTareasSchema), actualizartarea);

router.delete('/tareas/:id', isAuth, eliminartarea);

export default router;