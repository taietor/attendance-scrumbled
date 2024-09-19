import express from 'express';
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  createEmployer,  // Importa createEmployer
  loginEmployer,   // Importa loginEmployer
  getEmployers,
  getEmployerById,
  deleteEmployer,
  updateEmployerPassword,
  getTimetableForMonth,
  updateDayStatus,
  addJustification,
  assignProjectToDay,
  getProjectsForMonth,
  createProject,
  getProjects,
  updateEmail
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { Employer } from '../models/employer.model.js';
import Project from '../models/project.model.js';



const router = express.Router();

// Rotta per creare un nuovo progetto
router.post('/projects', async (req, res) => {
	try {
	  const { title, description, employers, date } = req.body;
	  const project = new Project({ title, description, employers, date });
	  await project.save();
	  res.status(201).json({ success: true, project });
	} catch (error) {
	  res.status(500).json({ success: false, message: 'Errore durante la creazione del progetto' });
	}
  });
  
  // Rotta per recuperare i progetti di un determinato giorno
  router.get('/projects/:date', async (req, res) => {
	try {
	  const date = new Date(req.params.date);
	  const projects = await Project.find({ date });
	  res.status(200).json({ success: true, projects });
	} catch (error) {
	  res.status(500).json({ success: false, message: 'Errore durante il recupero dei progetti' });
	}
  });

router.get('/check-auth', verifyToken, checkAuth);
// Rotta per ottenere i dettagli di un employer
router.get('/employer/:id', async (req, res) => {
	try {
	  const employer = await Employer.findById(req.params.id);
	  if (!employer) {
		return res.status(404).json({ message: 'Employer non trovato' });
	  }
	  res.status(200).json({ employer });
	} catch (error) {
	  console.error('Errore nel recuperare i dettagli dell\'employer:', error);
	  res.status(500).json({ message: 'Errore durante il recupero dei dettagli dell\'employer' });
	}
  });
  // Rotta per eliminare un employer
router.delete('/employer/:id', async (req, res) => {
	try {
	  const employer = await Employer.findByIdAndDelete(req.params.id);
	  if (!employer) {
		return res.status(404).json({ message: 'Employer non trovato' });
	  }
	  res.status(200).json({ message: 'Employer eliminato con successo' });
	} catch (error) {
	  res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'employer' });
	}
  });
  
  // Rotta per modificare la password dell'employer
  router.patch('/employer/:id/edit-password', async (req, res) => {
	const { newPassword } = req.body;
	try {
	  const hashedPassword = await bcryptjs.hash(newPassword, 10);
	  const employer = await Employer.findByIdAndUpdate(
		req.params.id,
		{ password: hashedPassword },
		{ new: true }
	  );
	  if (!employer) {
		return res.status(404).json({ message: 'Employer non trovato' });
	  }
	  res.status(200).json({ message: 'Password modificata con successo' });
	} catch (error) {
	  res.status(500).json({ message: 'Errore durante la modifica della password' });
	}
  });

  router.post('/employer/update-email', verifyToken, async (req, res) => {
    const { email } = req.body;
    const userId = req.user.id; // Presupponendo che l'utente sia autenticato

    try {
        const employer = await Employer.findById(userId);
        if (!employer) {
            return res.status(404).json({ success: false, message: "Employer non trovato" });
        }

        employer.email = email;
        await employer.save();

        res.status(200).json({ success: true, message: "Email aggiornata con successo" });
    } catch (error) {
        console.error("Errore nell'aggiornamento dell'email:", error);
        res.status(500).json({ success: false, message: "Errore nell'aggiornamento dell'email" });
    }
});

// Recupera l'orario per un determinato mese
router.get('/timetable/:month/:year', verifyToken, getTimetableForMonth);

// Aggiorna lo stato di un giorno specifico (giorno lavorativo/non lavorativo)
router.put('/timetable/day-status/:dayId', verifyToken, updateDayStatus);

// Aggiungi un giustificativo (malattia, ferie, ecc.)
router.post('/timetable/justification', verifyToken, addJustification);

// Assegna un progetto a un giorno specifico
router.post('/timetable/project', verifyToken, assignProjectToDay);

// Recupera i progetti per un mese specifico
router.get('/timetable/projects/:month/:year', verifyToken, getProjectsForMonth);


router.post('/employer/update-email', verifyToken, updateEmail);



router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

// Rotte per gli employer
router.post('/create-employer', verifyToken, createEmployer);  // Employer creato solo se autenticato
router.post('/employer-login', loginEmployer);  // Rotta per il login dell'employer

router.get('/get-employers', verifyToken, getEmployers);  // Usa la protezione del token se necessario
router.get('/employer/:id', verifyToken, getEmployerById);  // Recupera un employer tramite ID
router.delete('/employer/:id', verifyToken, deleteEmployer);  // Elimina un employer
router.patch('/employer/:id/password', verifyToken, updateEmployerPassword);  // Aggiorna la password dell'employer

router.post('/projects', verifyToken, createProject);  // Rotta per creare un progetto
router.get('/projects', verifyToken, getProjects);
router.post('/justifications', addJustification);  // Funzione nel controller per aggiungere un giustificativo


export default router;
