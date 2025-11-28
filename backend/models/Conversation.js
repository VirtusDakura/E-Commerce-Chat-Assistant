import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      alias: 'text',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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
      alias: 'userId',
    },
    sessionId: {
      type: String,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
    },
    messages: [messageSchema],
    intent: {
      type: String,
      trim: true,
      index: true, // e.g., 'shopping', 'browsing', 'comparison'
    },
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
      marketplace: {
        type: String,
        default: 'jumia',
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
