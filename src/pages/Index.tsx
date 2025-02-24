import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Users, History, Calculator } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [recentExpenses] = useState([
    { id: 1, description: "Dinner at Olive Garden", amount: 120.50, date: "2023-06-15", paidBy: "Alex" },
    { id: 2, description: "Movie tickets", amount: 45.00, date: "2023-06-10", paidBy: "Jamie" },
    { id: 3, description: "Groceries", amount: 78.35, date: "2023-06-05", paidBy: "Taylor" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SplitWise</h1>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            My Groups
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <PlusCircle className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Add Expense</h2>
                <p className="text-gray-500 mb-4">Record a new expense and split it with friends</p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/add-expense")}
                >
                  Add Expense
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <History className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Expense History</h2>
                <p className="text-gray-500 mb-4">View and manage all your past expenses</p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/expenses")}
                  variant="outline"
                >
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Balances</h2>
                <p className="text-gray-500 mb-4">See who owes what and settle up</p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/balances")}
                  variant="outline"
                >
                  View Balances
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {recentExpenses.map((expense) => (
                <li key={expense.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary truncate">{expense.description}</p>
                      <p className="text-sm text-gray-500">
                        {expense.date} • Paid by {expense.paidBy}
                      </p>
                    </div>
                    <div className="text-sm font-semibold">${expense.amount.toFixed(2)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;