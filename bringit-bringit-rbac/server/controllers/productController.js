import Product from '../models/Product.js';


const getProducts = async (req, res) => {
  const {category, sort = 'latest' } = req.query;
  

  const filter = {};


  if (category && category !== 'all') {
    filter.category = category;
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'priceAsc') sortOption = { price: 1 };
  if (sort === 'priceDesc') sortOption = { price: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };

  const products = await Product.find(filter).sort(sortOption);
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProduct = async (req, res) => {
  const {
    name,
    image,
    brand,
    category,
    description,
    price,
    countInStock,
  } = req.body;

  if (
    !name ||
    !image ||
    !brand ||
    !category ||
    !description ||
    price === undefined ||
    countInStock === undefined
  ) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const product = new Product({
      name,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const {
    name,
    image,
    brand,
    category,
    description,
    price,
    countInStock,
  } = req.body;

  if (name !== undefined) product.name = name;
  if (image !== undefined) product.image = image;
  if (brand !== undefined) product.brand = brand;
  if (category !== undefined) product.category = category;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (countInStock !== undefined) product.countInStock = countInStock;

  const updated = await product.save();
  res.json(updated);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };