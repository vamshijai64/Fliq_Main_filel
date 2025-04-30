const mongoose=require('mongoose');
const bannerSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    startDate:{type:Date,default:Date.now},
    enddate:{type:Date,default:Date.now},
    priority: { type: Number, default: 0 },

    bannerType:{
        type:String,
        enum:['movieNews','movieReviews','categories'],
        required:false,
        default:null

    } ,
      //  This will allow adding dynamic fields
      additionalData: {
        type: mongoose.Schema.Types.Mixed, // Accepts any object structure
        default: {}
    }
},
{timestamps:true})
const Banner = mongoose.model('Banner',bannerSchema);

module.exports=Banner;
