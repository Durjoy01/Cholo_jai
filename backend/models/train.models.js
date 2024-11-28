import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

const boggySchema = new mongoose.Schema({
  boggyNumber: { type: String, required: true },
  type: { type: String, required: true },
  seats: [seatSchema],
  availableSeatsCount: { type: Number, default: 0 }
});

const routeSchema = new mongoose.Schema({
  station: { type: String, required: true },
  arrivalTime: { type: String, required: false },
  haltMinutes: { type: Number, default: 0 },
  departureTime: { type: String, required: false },
  durationFromPrevious: { type: String }
});

const trainSchema = new mongoose.Schema({
  trainName: { type: String, required: true },
  trainCode: { type: String, required: true },
  date: { type: Date, required: true },
  day: { type: String, required: true },
  runsOn: [{ type: String, enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }],
  offDay: { type: String, enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
  routes: [routeSchema],
  boggies: [boggySchema],
  totalDuration: { type: String }
});

export default mongoose.model('Train', trainSchema);
