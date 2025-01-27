import React, { useState } from 'react';
import { Minus, Plus, Truck, Clock } from 'react-feather';
import { API_CONFIG } from '../../config/api.config';

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState('regular');

  const product = {
    name: "The Art of Programming",
    author: "John Developer",
    imageUrl: "/uploads/covers/cover_img-1737598275650-129413520.jpg",
    description: "A comprehensive guide to modern programming paradigms and best practices.",
    isbn: "978-3-16-148410-0"
  };

  const deliveryMethods = [
    {
      id: 'regular',
      name: 'Regular Delivery',
      description: '3-5 business days',
      icon: Truck
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '1-2 business days',
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen text-gray-100 p-4 mt-28">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Book Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2">
            <div className="bg-[#1A1A2E] rounded-xl overflow-hidden shadow-lg shadow-purple-900/10">
              <div className="relative group">
                <img
                  src={`${API_CONFIG.baseURL}${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-[280px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              </div>
              <div className="p-5 space-y-3">
                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {product.name}
                </h2>
                <p className="text-purple-400 text-sm font-medium">By {product.author}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{product.description}</p>
                <p className="text-xs text-gray-400 font-mono">ISBN: {product.isbn}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="lg:col-span-3 space-y-4">
            {/* Quantity Section */}
            <div className="bg-[#1A1A2E] rounded-xl p-5 shadow-lg shadow-purple-900/10">
              <h3 className="text-sm font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Quantity
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2A2A3E] hover:bg-[#3A3A4E] transition-colors duration-200"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2A2A3E] hover:bg-[#3A3A4E] transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-[#1A1A2E] rounded-xl p-5 shadow-lg shadow-purple-900/10">
              <h3 className="text-sm font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Delivery Address
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[#2A2A3E] border border-transparent focus:border-purple-500 focus:outline-none transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[#2A2A3E] border border-transparent focus:border-purple-500 focus:outline-none transition-colors duration-200"
                    placeholder="Enter your street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#2A2A3E] border border-transparent focus:border-purple-500 focus:outline-none transition-colors duration-200"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#2A2A3E] border border-transparent focus:border-purple-500 focus:outline-none transition-colors duration-200"
                      placeholder="Postal Code"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Method Section */}
            <div className="bg-[#1A1A2E] rounded-xl p-5 shadow-lg shadow-purple-900/10">
              <h3 className="text-sm font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Delivery Method
              </h3>
              <div className="space-y-3">
                {deliveryMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedDelivery === method.id
                        ? 'bg-[#3A3A4E] border border-purple-500'
                        : 'bg-[#2A2A3E] border border-transparent hover:border-purple-500/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={method.id}
                      checked={selectedDelivery === method.id}
                      onChange={(e) => setSelectedDelivery(e.target.value)}
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedDelivery === method.id
                          ? 'border-purple-500'
                          : 'border-gray-400'
                      }`}
                    >
                      {selectedDelivery === method.id && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </div>
                    <method.icon className="h-4 w-4 text-purple-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{method.name}</div>
                      <div className="text-xs text-gray-400">{method.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:scale-[0.98]">
              Confirm Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;