'use client';

import { products, productCategories } from '@/lib/products-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductNavigationProps {
  activeProduct: string;
  activeCategory: string;
  onProductChange: (productId: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

export default function ProductNavigation({
  activeProduct,
  activeCategory,
  onProductChange,
  onCategoryChange,
}: ProductNavigationProps) {
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => {
        const category = productCategories.find(c => c.id === activeCategory);
        return category?.productIds?.includes(p.id) ?? false;
      });

  return (
    <div className="w-full space-y-4">
      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {productCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              onCategoryChange(category.id);
              if (category.id !== 'all' && category.productIds && category.productIds.length > 0) {
                onProductChange(category.productIds[0]);
              } else if (category.id === 'all') {
                onProductChange(products[0].id);
              }
            }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              'flex items-center gap-2',
              activeCategory === category.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* 产品导航 */}
      <div className="flex flex-wrap gap-3 justify-center">
        {filteredProducts.map((product, index) => (
          <motion.button
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onProductChange(product.id)}
            className={cn(
              'px-5 py-3 rounded-xl text-base font-medium transition-all duration-300',
              'flex items-center gap-2 border-2',
              activeProduct === product.id
                ? `bg-gradient-to-r ${product.gradient} text-white shadow-xl scale-105 border-transparent`
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
            )}
          >
            <span className="text-xl">{product.icon}</span>
            <span>{product.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
