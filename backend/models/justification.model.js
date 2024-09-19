import mongoose from 'mongoose';

const justificationSchema = new mongoose.Schema({
  day: { type: mongoose.Schema.Types.ObjectId, ref: 'Day', required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
  type: { type: String, enum: ['Malattia', 'Ferie', 'Permessi'], required: true },
});

const Justification = mongoose.model('Justification', justificationSchema);
export default Justification;
