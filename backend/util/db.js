import mongoose from 'mongoose';


mongoose.connect(process.env.MONGOOSE_URI)

.then(()=> console.log("DB Connected."))
.catch(err => console.log('Error',err))