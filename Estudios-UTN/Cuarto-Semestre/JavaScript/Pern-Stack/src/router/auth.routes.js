import  Router  from 'express-promise-router';
import { signin, signup, signout, profile } from '../controllers/auth.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/signin', isAuth, signin);

router.post('/signup', isAuth, signup);

router.get('/signout', isAuth, signout);

router.get('/profile', isAuth, profile);

export default router;