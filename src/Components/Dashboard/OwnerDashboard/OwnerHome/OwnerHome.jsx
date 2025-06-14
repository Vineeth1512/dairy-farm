import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

const OwnerHome = () => {
  const milkData = [
    { date: "Mon", litres: 120 },
    { date: "Tue", litres: 140 },
    { date: "Wed", litres: 100 },
    { date: "Thu", litres: 160 },
    { date: "Fri", litres: 180 },
    { date: "Sat", litres: 90 },
    { date: "Sun", litres: 130 },
  ];

  const animalData = [
    { name: "Cows", value: 30 },
    { name: "Buffaloes", value: 20 },
  ];

  const productSales = [
    { name: "Milk", sales: 240 },
    { name: "Ghee", sales: 90 },
    { name: "Curd", sales: 160 },
    { name: "Paneer", sales: 120 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 5000 },
    { month: "Feb", revenue: 7000 },
    { month: "Mar", revenue: 6000 },
    { month: "Apr", revenue: 9000 },
  ];

  const orderData = [
    { method: "COD", value: 40 },
    { method: "UPI", value: 60 },
  ];

  const stockLevels = [
    { product: "Milk", quantity: 200 },
    { product: "Curd", quantity: 70 },
    { product: "Ghee", quantity: 50 },
    { product: "Paneer", quantity: 90 },
  ];

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center text-[#6e4327]">
        Owner Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Animals", value: 50 },
          { label: "Milk Today", value: "120L" },
          { label: "Revenue Today", value: "₹3000" },
          { label: "Orders Today", value: 12 },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 shadow-md text-center"
          >
            <h2 className="text-lg font-medium">{item.label}</h2>
            <p className="text-2xl text-[#6e4327] font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Row 1: Milk Production + Animal Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Milk Production (Weekly)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={milkData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="L" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="litres"
                stroke="#6e4327"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Animal Inventory</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={animalData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {animalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Product Sales + Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Milk Product Sales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis unit="₹" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Order Methods + Stock Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Methods</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {orderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Milk Product Stock</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stockLevels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;
