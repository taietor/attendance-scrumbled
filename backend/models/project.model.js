import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  employers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employer' }],
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
