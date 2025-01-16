import React, { useEffect, useState } from 'react';
import Product from './Product';


interface ProductType {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
  }

const ProductList: React.FC  = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(products);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrowanie produktów
  useEffect(() => {
    let filtered: ProductType[] = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  useEffect(() => {
    const uniqueCategories = ['all', ...new Set(products.map(product => product.category))];
    setCategories(uniqueCategories);
  }, [products]);

  if (loading) return <p>Loading...</p>;

  return (
        <div>
            <h1>Products:</h1>

            {/* Wyszukiwarka */}
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '10px', marginRight: '10px', fontSize: '16px' }}
            />

            {/* Dropdown kategorii */}
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '10px', fontSize: '16px' }}
                >
                {categories.map(category => (
                    <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                    </option>
                ))}
            </select>

        {/* Lista produktów */}
            <div>
                {filteredProducts.map(product => (
                <Product product={product} />
                ))}
            </div>
        </div>
  );
};

export default ProductList;