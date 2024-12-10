import UserController from '../controller/user.controller';
import { Router } from 'express';
import Auth from '../middlewares/Auth';
import EventController from '../controller/event.controller';
const app = Router();
const authMiddleware = new Auth();

app.get("/users", UserController.getUsers);
app.post("/users", UserController.register);
app.post("/login", UserController.login);
app.get('/events', authMiddleware.verifyToken, EventController.getEvents);
app.post('/events', authMiddleware.verifyToken, EventController.insertEvents);
app.patch('/events', authMiddleware.verifyToken, EventController.updateEvents);
app.delete('/events', authMiddleware.verifyToken, EventController.deleteEvents);

export default app;
