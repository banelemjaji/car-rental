import { Schema, model as _model } from 'mongoose';

const carSchema = new Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  available: { type: Boolean, default: true },
});

export default _model('Car', carSchema);