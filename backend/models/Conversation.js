import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    suggestedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
    },
    messages: [messageSchema],
    context: {
      // Store conversation context for better responses
      userPreferences: {
        priceRange: {
          min: Number,
          max: Number,
        },
        categories: [String],
        brands: [String],
      },
      searchIntent: String, // e.g., "looking for laptop", "need gaming headset"
      lastActivity: {
        type: Date,
        default: Date.now,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
conversationSchema.index({ user: 1, isActive: 1 });
conversationSchema.index({ 'context.lastActivity': -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
