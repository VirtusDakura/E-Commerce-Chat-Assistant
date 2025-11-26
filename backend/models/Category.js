const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    metadata: {
      keywords: [String],
      seoTitle: String,
      seoDescription: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1, order: 1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Virtual for products in this category
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
});

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

// Pre-save middleware to generate slug from name
categorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Pre-save middleware to set level based on parent
categorySchema.pre('save', async function (next) {
  if (this.parent) {
    const parent = await this.constructor.findById(this.parent);
    if (parent) {
      this.level = parent.level + 1;
    }
  } else {
    this.level = 0;
  }
  next();
});

// Method to get full category path
categorySchema.methods.getPath = async function () {
  const path = [this];
  let current = this;

  while (current.parent) {
    current = await this.constructor.findById(current.parent);
    if (current) {
      path.unshift(current);
    } else {
      break;
    }
  }

  return path;
};

// Method to get all descendants
categorySchema.methods.getAllDescendants = async function () {
  const descendants = [];
  const children = await this.constructor.find({ parent: this._id });

  for (const child of children) {
    descendants.push(child);
    const childDescendants = await child.getAllDescendants();
    descendants.push(...childDescendants);
  }

  return descendants;
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function () {
  const categories = await this.find({ isActive: true }).sort({ order: 1, name: 1 });

  const buildTree = (parentId = null) => {
    return categories
      .filter(cat => {
        if (parentId === null) {
          return cat.parent === null || cat.parent === undefined;
        }
        return cat.parent && cat.parent.toString() === parentId.toString();
      })
      .map(cat => ({
        ...cat.toObject(),
        children: buildTree(cat._id),
      }));
  };

  return buildTree();
};

// Static method to get featured categories
categorySchema.statics.getFeaturedCategories = async function () {
  return await this.find({ isActive: true, isFeatured: true })
    .sort({ order: 1, name: 1 })
    .limit(10);
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
