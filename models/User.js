const { Schema, model } = require('mongoose');

// schema for user 
const UserSchema = new Schema(
    {
        userName: {
            type: String,
            required: 'Username required',
            unique: true,
            trim: true
        },
        email: {
            type: String,            
            unique:true,
            validate: {
                validator: function(v) {
                    return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);
                }                
            },
            required: [true, 'Email required']                  
        },
        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: 'Thoughts'    
            }
        ],
        friends: [
            {
            type: Schema.Types.ObjectId,
            ref: 'User'
            }    
        ]   
    },
    {
    toJSON: {
      virtuals: true,
      getters: true,
    }, 
    id: false
    }
);

// counts friends for a user 
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
})

const User = model('User', UserSchema);

module.exports = User;