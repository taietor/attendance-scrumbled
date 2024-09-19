import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  isWorkingDay: { type: Boolean, default: true }, // Giorno lavorativo
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin
});

const timetableSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  days: [daySchema], // Array di giorni per il mese
});

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;
