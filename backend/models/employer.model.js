import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: true, // Verificato automaticamente alla creazione
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Collegamento con l'utente che ha creato l'employer
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Employer = mongoose.model('Employer', employerSchema);
