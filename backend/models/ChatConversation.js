import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    intent: String, // e.g., 'search', 'filter', 'compare', 'add_to_cart', 'checkout'
    entities: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    }, // Extracted entities like product names, categories, price ranges
    productsReferenced: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    actionTaken: String, // e.g., 'added_to_cart', 'filtered_products', 'compared_items'
  },
});

const chatConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      maxlength: 200,
    },
    messages: [messageSchema],
    context: {
      currentFilters: {
        categories: [String],
        priceRange: {
          min: Number,
          max: Number,
        },
        brands: [String],
        tags: [String],
      },
      viewedProducts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
      ],
      comparedProducts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
      ],
      cartModifications: [
        {
          action: {
            type: String,
            enum: ['add', 'remove', 'update'],
          },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
          },
          quantity: Number,
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    summary: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
chatConversationSchema.index({ user: 1, createdAt: -1 });
chatConversationSchema.index({ sessionId: 1 });
chatConversationSchema.index({ isActive: 1 });

// Virtual for message count
chatConversationSchema.virtual('messageCount').get(function () {
  return this.messages.length;
});

// Method to add message
chatConversationSchema.methods.addMessage = async function (role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    metadata,
    timestamp: new Date(),
  });

  this.lastMessageAt = new Date();

  // Update title based on first user message if still default
  if (this.title === 'New Conversation' && role === 'user' && this.messages.length === 1) {
    this.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
  }

  await this.save();
  return this;
};

// Method to add product to comparison
chatConversationSchema.methods.addToComparison = async function (productId) {
  if (!this.context.comparedProducts.includes(productId)) {
    this.context.comparedProducts.push(productId);
    await this.save();
  }
  return this;
};

// Method to clear comparison
chatConversationSchema.methods.clearComparison = async function () {
  this.context.comparedProducts = [];
  await this.save();
  return this;
};

// Method to update filters
chatConversationSchema.methods.updateFilters = async function (filters) {
  this.context.currentFilters = {
    ...this.context.currentFilters,
    ...filters,
  };
  await this.save();
  return this;
};

// Method to record cart modification
chatConversationSchema.methods.recordCartModification = async function (action, productId, quantity) {
  this.context.cartModifications.push({
    action,
    product: productId,
    quantity,
    timestamp: new Date(),
  });
  await this.save();
  return this;
};

// Method to mark conversation as inactive
chatConversationSchema.methods.endConversation = async function (summary = '') {
  this.isActive = false;
  if (summary) {
    this.summary = summary;
  }
  await this.save();
  return this;
};

// Static method to get or create active conversation
chatConversationSchema.statics.getOrCreateActiveConversation = async function (userId, sessionId) {
  let conversation = await this.findOne({
    user: userId,
    sessionId,
    isActive: true,
  });

  if (!conversation) {
    conversation = await this.create({
      user: userId,
      sessionId,
      messages: [],
      context: {
        currentFilters: {},
        viewedProducts: [],
        comparedProducts: [],
        cartModifications: [],
      },
    });
  }

  return conversation;
};

// Pre-save middleware to limit message history (keep last 100 messages)
chatConversationSchema.pre('save', function (next) {
  if (this.messages.length > 100) {
    this.messages = this.messages.slice(-100);
  }
  next();
});

const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);

export default ChatConversation;
