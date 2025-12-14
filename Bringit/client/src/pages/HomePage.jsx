import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Message from "../components/Message";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("https://bringit-0vs9.onrender.com/api/products", {
        params: { category, sort },
      });

      const filteredProducts = data.filter((product) => {
        const search = keyword.trim().toLowerCase();
        if (!search) return true;

        return (
          product.name?.toLowerCase().includes(search) ||
          product.brand?.toLowerCase().includes(search) ||
          product.category?.toLowerCase().includes(search) 
        );
      });
      setProducts(filteredProducts);
      const uniqueCategories = [...new Set(data.map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, category, sort]);

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <h1>Sale !! Sale !!</h1>
          <p>Explore us & Purchase your essentials.</p>
          <div className="hero-cta">
            <a href="#products" className="btn-primary">
              Shop Now
            </a>
            <span className="hero-sub">50% Discount</span>
          </div>
        </div>
        <div className="hero-showcase">
          <div className="hero-card">
            <h2>Free Deal</h2>
            <p className="hero-price">
              Buy for 1000 & Get one litre Mustard oil.
            </p>
            <p className="hero-small">Limited time offer.</p>
            <div className="hero-orbit" />
          </div>
        </div>
      </div>

      <div id="products" className="products-grid-wrap">
        <div className="filters-bar">
          <input
            type="text"
            className="filter-input"
            placeholder="Search by name, brand, category..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>

        <h2 className="section-title">Products</h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : products.length === 0 ? (
          <p className="empty-state">
            No products found. 
          </p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomePage;
