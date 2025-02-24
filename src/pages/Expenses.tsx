import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Calendar, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [expenses, setExpenses] = useState([
    { 
      id: 1, 
      description: "Dinner at Olive Garden", 
      amount: 120.50, 
      date: "2023-06-15", 
      paidBy: "Alex",
      participants: ["Alex", "Jamie", "Taylor", "You"],
      group: "Friends"
    },
    { 
      id: 2, 
      description: "Movie tickets", 
      amount: 45.00, 
      date: "2023-06-10", 
      paidBy: "Jamie",
      participants: ["Jamie", "You"],
      group: "Friends"
    },
    { 
      id: 3, 
      description: "Groceries", 
      amount: 78.35, 
      date: "2023-06-05", 
      paidBy: "Taylor",
      participants: ["Taylor", "You", "Alex"],
      group: "Roommates"
    },
    { 
      id: 4, 
      description: "Utility bills", 
      amount: 95.20, 
      date: "2023-05-28", 
      paidBy: "You",
      participants: ["You", "Taylor", "Alex"],
      group: "Roommates"
    },
    { 
      id: 5, 
      description: "Road trip gas", 
      amount: 67.80, 
      date: "2023-05-15", 
      paidBy: "You",
      participants: ["You", "Jamie", "Alex"],
      group: "Friends"
    },
  ]);

  const filteredExpenses = expenses.filter(expense => {
    // Search filter
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.paidBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.group.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter
    let matchesDate = true;
    if (filterPeriod !== "all") {
      const expenseDate = new Date(expense.date);
      const today = new Date();
      
      if (filterPeriod === "month") {
        matchesDate = expenseDate.getMonth() === today.getMonth() && 
                      expenseDate.getFullYear() === today.getFullYear();
      } else if (filterPeriod === "year") {
        matchesDate = expenseDate.getFullYear() === today.getFullYear();
      }
    }
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Expense History</h1>
          </div>
          <Button onClick={() => navigate("/add-expense")}>Add Expense</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="you-paid">You Paid</TabsTrigger>
            <TabsTrigger value="you-owe">You Owe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {filteredExpenses.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <li key={expense.id} className="hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-primary truncate">{expense.description}</p>
                            <p className="text-xs text-gray-500">
                              {expense.date} • {expense.group}
                            </p>
                          </div>
                          <div className="text-sm font-semibold">${expense.amount.toFixed(2)}</div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">{expense.paidBy}</span> paid
                            {expense.participants.length > 0 && (
                              <span> • Split with {expense.participants.filter(p => p !== expense.paidBy).join(", ")}</span>
                            )}
                          </div>
                          <div className="text-xs">
                            {expense.paidBy === "You" ? (
                              <span className="text-green-600">you lent ${((expense.amount / expense.participants.length) * (expense.participants.length - 1)).toFixed(2)}</span>
                            ) : (
                              <span className="text-red-600">you owe ${(expense.amount / expense.participants.length).toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center">
                  <p className="text-gray-500">No expenses found matching your filters.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="you-paid" className="mt-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {filteredExpenses.filter(e => e.paidBy === "You").length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredExpenses
                    .filter(e => e.paidBy === "You")
                    .map((expense) => (
                      <li key={expense.id} className="hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <p className="text-sm font-medium text-primary truncate">{expense.description}</p>
                              <p className="text-xs text-gray-500">
                                {expense.date} • {expense.group}
                              </p>
                            </div>
                            <div className="text-sm font-semibold">${expense.amount.toFixed(2)}</div>
                          </div>
                          <div className="mt-2 flex justify-between">
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">You</span> paid
                              {expense.participants.length > 0 && (
                                <span> • Split with {expense.participants.filter(p => p !== "You").join(", ")}</span>
                              )}
                            </div>
                            <div className="text-xs text-green-600">
                              you lent ${((expense.amount / expense.participants.length) * (expense.participants.length - 1)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center">
                  <p className="text-gray-500">No expenses found where you paid.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="you-owe" className="mt-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {filteredExpenses.filter(e => e.paidBy !== "You" && e.participants.includes("You")).length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredExpenses
                    .filter(e => e.paidBy !== "You" && e.participants.includes("You"))
                    .map((expense) => (
                      <li key={expense.id} className="hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <p className="text-sm font-medium text-primary truncate">{expense.description}</p>
                              <p className="text-xs text-gray-500">
                                {expense.date} • {expense.group}
                              </p>
                            </div>
                            <div className="text-sm font-semibold">${expense.amount.toFixed(2)}</div>
                          </div>
                          <div className="mt-2 flex justify-between">
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">{expense.paidBy}</span> paid
                            </div>
                            <div className="text-xs text-red-600">
                              you owe ${(expense.amount / expense.participants.length).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center">
                  <p className="text-gray-500">No expenses found where you owe money.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Expenses;