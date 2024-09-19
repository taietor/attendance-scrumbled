import bcryptjs from "bcryptjs";
import crypto from "crypto";
import fs from 'fs';
import path from 'path';

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";
import { Employer } from '../models/employer.model.js';

import Timetable from '../models/timetable.model.js';
import Project from '../models/project.model.js';
import Justification from '../models/justification.model.js';


const employersFilePath = path.join(process.cwd(), 'backend/data/employers.json');



export const loginEmployer = async (req, res) => {
	const { email, password } = req.body;
  
	try {
	  // Cerca l'employer nel database usando l'email
	  const employer = await Employer.findOne({ email });
  
	  // Se non viene trovato un employer con questa email
	  if (!employer) {
		return res.status(400).json({ message: "Employer non trovato" });
	  }
  
	  // Verifica la password usando bcryptjs.compare
	  const isPasswordValid = await bcryptjs.compare(password, employer.password);
  
	  // Se la password non è valida
	  if (!isPasswordValid) {
		return res.status(400).json({ message: "Password errata" });
	  }
  
	  // Se il login ha successo, restituisci i dettagli dell'employer
	  return res.status(200).json({
		success: true,
		message: "Login effettuato con successo",
		employer: {
		  id: employer._id,
		  email: employer.email,
		  name: employer.name,
		  surname: employer.surname,
		  isVerified: employer.isVerified,
		}
	  });
	} catch (error) {
	  console.error('Errore nel login dell\'employer', error);
	  res.status(500).json({ message: 'Errore durante il login dell\'employer' });
	}
  };

// Creazione Employer con salvataggio nel database
export const createEmployer = async (req, res) => {
	const { email, password, name, surname } = req.body;
  
	try {
	  // Verifica se l'employer esiste già
	  const employerAlreadyExists = await Employer.findOne({ email });
	  if (employerAlreadyExists) {
		return res.status(400).json({ success: false, message: "Employer already exists" });
	  }
  
	  // Hash della password
	  const hashedPassword = await bcryptjs.hash(password, 10);
  
	  // Crea il nuovo employer
	  const employer = new Employer({
		email,
		password: hashedPassword,
		name,
		surname,
		createdBy: req.userId,  // Associa l'employer con l'utente che lo ha creato
	  });
  
	  // Salva l'employer nel database
	  await employer.save();
  
	  res.status(201).json({
		success: true,
		message: "Employer created successfully",
		employer: {
		  ...employer._doc,
		  password: undefined, // Non includere la password nell'output
		},
	  });
	} catch (error) {
	  console.error("Error creating employer", error);
	  res.status(500).json({ success: false, message: "Error creating employer" });
	}
  };
  export const getEmployers = async (req, res) => {
	try {
	  const employers = await Employer.find(); // Ottieni tutti gli employer dal database
	  res.status(200).json({ success: true, employers });
	} catch (error) {
	  res.status(500).json({ success: false, message: "Errore nel recuperare gli employer" });
	}
  };

  // Recupera i dettagli di un singolo employer
export const getEmployerById = async (req, res) => {
	const { id } = req.params;
	try {
	  const employer = await Employer.findById(id);
	  if (!employer) {
		return res.status(404).json({ success: false, message: "Employer non trovato" });
	  }
	  res.status(200).json({ success: true, employer });
	} catch (error) {
	  console.error("Errore nel recuperare l'employer:", error);
	  res.status(500).json({ success: false, message: "Errore nel recuperare l'employer" });
	}
  };
  
  // Elimina un employer
  export const deleteEmployer = async (req, res) => {
	const { id } = req.params;
	try {
	  const employer = await Employer.findByIdAndDelete(id);
	  if (!employer) {
		return res.status(404).json({ success: false, message: "Employer non trovato" });
	  }
	  res.status(200).json({ success: true, message: "Employer eliminato con successo" });
	} catch (error) {
	  console.error("Errore durante l'eliminazione dell'employer:", error);
	  res.status(500).json({ success: false, message: "Errore durante l'eliminazione dell'employer" });
	}
  };
  
  // Aggiorna la password dell'employer
  export const updateEmployerPassword = async (req, res) => {
	const { id } = req.params;
	const { newPassword } = req.body;
  
	try {
	  const hashedPassword = await bcryptjs.hash(newPassword, 10);
	  const employer = await Employer.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
  
	  if (!employer) {
		return res.status(404).json({ success: false, message: "Employer non trovato" });
	  }
  
	  res.status(200).json({ success: true, message: "Password aggiornata con successo" });
	} catch (error) {
	  console.error("Errore durante l'aggiornamento della password:", error);
	  res.status(500).json({ success: false, message: "Errore durante l'aggiornamento della password" });
	}
  };

export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();

		// jwt
		generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
	  const user = await User.findById(req.userId).select("-password");
	  if (!user) {
		return res.status(400).json({ success: false, message: "User not found" });
	  }
  
	  res.status(200).json({ success: true, user });
	} catch (error) {
	  console.log("Error in checkAuth ", error);
	  res.status(400).json({ success: false, message: error.message });
	}
  };
  

  // Recupera l'orario per un determinato mese
export const getTimetableForMonth = async (req, res) => {
	const { month, year } = req.params;
  
	try {
	  const timetable = await Timetable.find({ month, year });
	  res.status(200).json({ success: true, timetable });
	} catch (error) {
	  console.error("Errore nel recuperare l'orario del mese:", error);
	  res.status(500).json({ success: false, message: 'Errore del server' });
	}
  };
  
  // Aggiorna lo stato di un giorno specifico (giorno lavorativo/non lavorativo)
  export const updateDayStatus = async (req, res) => {
	const { dayId } = req.params;
	const { isWorkingDay } = req.body;
  
	try {
	  const day = await Timetable.findById(dayId);
	  day.isWorkingDay = isWorkingDay;
	  await day.save();
	  res.status(200).json({ success: true, message: 'Stato del giorno aggiornato' });
	} catch (error) {
	  console.error("Errore nell'aggiornamento dello stato del giorno:", error);
	  res.status(500).json({ success: false, message: 'Errore del server' });
	}
  };
  
  // Aggiungi giustificativo (malattia, ferie, ecc.)
  export const addJustification = async (req, res) => {
	const { dayId, justificationType, employerId } = req.body;
  
	try {
	  const justification = new Justification({
		day: dayId,
		employer: employerId,
		type: justificationType
	  });
	  await justification.save();
	  res.status(201).json({ success: true, message: 'Giustificativo aggiunto' });
	} catch (error) {
	  console.error("Errore nell'aggiunta del giustificativo:", error);
	  res.status(500).json({ success: false, message: 'Errore del server' });
	}
  };
  
  // Assegna un progetto a un giorno specifico
  export const assignProjectToDay = async (req, res) => {
	const { dayId, projectId, employerIds } = req.body;
  
	try {
	  const project = await Project.findById(projectId);
	  if (!project) {
		return res.status(404).json({ success: false, message: 'Progetto non trovato' });
	  }
	  project.assignedEmployers = employerIds;
	  project.assignedDay = dayId;
	  await project.save();
  
	  res.status(200).json({ success: true, message: 'Progetto assegnato con successo' });
	} catch (error) {
	  console.error("Errore nell'assegnazione del progetto:", error);
	  res.status(500).json({ success: false, message: 'Errore del server' });
	}
  };
  
  // Recupera i progetti per un mese specifico
  export const getProjectsForMonth = async (req, res) => {
	const { month, year } = req.params;
  
	try {
	  const projects = await Project.find({ month, year });
	  res.status(200).json({ success: true, projects });
	} catch (error) {
	  console.error("Errore nel recuperare i progetti:", error);
	  res.status(500).json({ success: false, message: 'Errore del server' });
	}
  };

  export const createProject = async (req, res) => {
	try {
	  const { title, description, date, employers } = req.body;
  
	  // Creazione del progetto
	  const project = new Project({
		title,
		description,
		date,
		employers,
	  });
  
	  await project.save();
  
	  res.status(201).json({
		success: true,
		project,
	  });
	} catch (error) {
	  console.error('Errore nella creazione del progetto:', error);
	  res.status(500).json({ message: 'Errore durante la creazione del progetto' });
	}
  };
  
  // Funzione per ottenere i progetti
  export const getProjects = async (req, res) => {
	try {
	  const projects = await Project.find().populate('employers', 'name email');  // Popola i dati degli employers
	  res.status(200).json({
		success: true,
		projects,
	  });
	} catch (error) {
	  console.error('Errore nel recupero dei progetti:', error);
	  res.status(500).json({ message: 'Errore durante il recupero dei progetti' });
	}
  };