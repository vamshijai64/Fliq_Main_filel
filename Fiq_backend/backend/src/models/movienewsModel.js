const mongoose=require('mongoose');

const movienewsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{    
        type:String,    
        required:true,
    },
    // imageUrl:{type:String,required:true},

    imageUrl: [
        {
          landscape: { type: String, required: true },
          portrait: { type: String, required: true },
          thumbnail: { type: String, required: true },
        }
      ],
   
},
{
    timestamps: true, //  This adds both `createdAt` and `updatedAt` fields
});

// module.exports = mongoose.model('Movienews', movienewsSchema);

module.exports = mongoose.models.Movienews || mongoose.model('Movienews', movienewsSchema);
