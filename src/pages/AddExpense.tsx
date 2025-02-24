import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Create a context to share expense data between components
export const ExpenseContext = React.createContext(null);

// Custom hook to use the expense context
export const useExpenseContext = () => {
  const context = React.useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenseContext must be used within an ExpenseProvider");
  }
  return context;
};

// Provider component to wrap the app
export const ExpenseProvider = ({ children }) => {
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
  ]);

  const [friends, setFriends] = useState([
    { id: 1, name: "Alex" },
    { id: 2, name: "Jamie" },
    { id: 3, name: "Taylor" },
    { id: 4, name: "You" },
  ]);

  const addExpense = (newExpense) => {
    const expenseWithId = {
      ...newExpense,
      id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1
    };
    setExpenses([expenseWithId, ...expenses]);
  };

  const addFriend = (name) => {
    const newId = friends.length > 0 ? Math.max(...friends.map(f => f.id)) + 1 : 1;
    setFriends([...friends, { id: newId, name }]);
  };

  // Calculate balances based on expenses
  const calculateBalances = () => {
    const balances = {};
    
    // Initialize balances for all friends
    friends.forEach(friend => {
      balances[friend.name] = 0;
    });
    
    // Calculate balances based on expenses
    expenses.forEach(expense => {
      const paidBy = expense.paidBy;
      const amount = parseFloat(expense.amount);
      const participantCount = expense.participants.length;
      const sharePerPerson = amount / participantCount;
      
      // The person who paid gets credit
      balances[paidBy] += amount;
      
      // Each participant owes their share
      expense.participants.forEach(participant => {
        balances[participant] -= sharePerPerson;
      });
    });
    
    // Convert to array format for the UI
    return Object.keys(balances)
      .filter(name => name !== "You")
      .map(name => ({
        id: friends.find(f => f.name === name)?.id || 0,
        name,
        amount: balances[name] * -1 // Invert so positive means they owe you
      }));
  };

  // Generate settlement suggestions
  const generateSettlements = () => {
    const balances = calculateBalances();
    const settlements = [];
    let settlementId = 1;
    
    // Find who owes you
    const youOwe = balances.filter(b => b.amount < 0).map(b => ({
      from: "You",
      to: b.name,
      amount: Math.abs(b.amount)
    }));
    
    // Find who you owe
    const owesYou = balances.filter(b => b.amount > 0).map(b => ({
      from: b.name,
      to: "You",
      amount: b.amount
    }));
    
    // Combine and add IDs
    return [...youOwe, ...owesYou].map(s => ({
      ...s,
      id: settlementId++
    }));
  };

  return (
    <ExpenseContext.Provider value={{ 
      expenses, 
      addExpense, 
      friends, 
      addFriend,
      calculateBalances,
      generateSettlements
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

const AddExpense = () => {
  const navigate = useNavigate();
  const { friends, addExpense } = useExpenseContext();
  
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paidBy, setPaidBy] = useState("You");
  const [group, setGroup] = useState("Friends");
  const [newFriendName, setNewFriendName] = useState("");
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false);
  
  const [participants, setParticipants] = useState(
    friends.map(friend => ({ 
      ...friend, 
      isIncluded: true,
      share: 0 
    }))
  );
  
  const [splitType, setSplitType] = useState("equal");

  // Update participants when friends change
  React.useEffect(() => {
    setParticipants(
      friends.map(friend => {
        // Try to find existing participant data
        const existing = participants.find(p => p.id === friend.id);
        return { 
          ...friend, 
          isIncluded: existing ? existing.isIncluded : true,
          share: existing ? existing.share : 0 
        };
      })
    );
  }, [friends]);

  const handleSplitTypeChange = (value) => {
    setSplitType(value);
    
    if (value === "equal") {
      const includedParticipants = participants.filter(p => p.isIncluded);
      const equalShare = amount ? parseFloat(amount) / includedParticipants.length : 0;
      
      setParticipants(participants.map(participant => ({
        ...participant,
        share: participant.isIncluded ? equalShare.toFixed(2) : 0
      })));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (splitType === "equal" && value) {
      const includedParticipants = participants.filter(p => p.isIncluded);
      const equalShare = parseFloat(value) / includedParticipants.length;
      
      setParticipants(participants.map(participant => ({
        ...participant,
        share: participant.isIncluded ? equalShare.toFixed(2) : 0
      })));
    }
  };

  const handleParticipantToggle = (id) => {
    const updatedParticipants = participants.map(participant => 
      participant.id === id 
        ? { ...participant, isIncluded: !participant.isIncluded } 
        : participant
    );
    
    setParticipants(updatedParticipants);
    
    // Recalculate shares if using equal split
    if (splitType === "equal" && amount) {
      const includedParticipants = updatedParticipants.filter(p => p.isIncluded);
      const equalShare = parseFloat(amount) / includedParticipants.length;
      
      setParticipants(updatedParticipants.map(participant => ({
        ...participant,
        share: participant.isIncluded ? equalShare.toFixed(2) : 0
      })));
    }
  };

  const handleShareChange = (id, value) => {
    setParticipants(participants.map(participant => 
      participant.id === id ? { ...participant, share: value } : participant
    ));
  };

  const { addFriend } = useExpenseContext();
  
  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      addFriend(newFriendName.trim());
      setNewFriendName("");
      setIsAddFriendDialogOpen(false);
      toast({
        title: "Friend added",
        description: `${newFriendName.trim()} has been added to your friends list`
      });
    }
  };

  const handleAddExpense = () => {
    if (!description || !amount || !date || !paidBy) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const includedParticipants = participants.filter(p => p.isIncluded);
    
    if (includedParticipants.length < 2) {
      toast({
        title: "Not enough participants",
        description: "An expense needs at least 2 participants",
        variant: "destructive"
      });
      return;
    }

    // Validate that shares add up to total
    if (splitType === "unequal") {
      const totalShares = includedParticipants.reduce(
        (sum, participant) => sum + parseFloat(participant.share || 0), 
        0
      );
      
      if (Math.abs(totalShares - parseFloat(amount)) > 0.01) {
        toast({
          title: "Invalid shares",
          description: "The sum of shares must equal the total amount",
          variant: "destructive"
        });
        return;
      }
    }

    // Create the new expense object
    const newExpense = {
      description,
      amount: parseFloat(amount),
      date,
      paidBy,
      group,
      participants: includedParticipants.map(p => p.name)
    };

    // Add the expense using the context function
    addExpense(newExpense);

    toast({
      title: "Expense added",
      description: "Your expense has been successfully recorded"
    });
    
    navigate("/expenses");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Add New Expense</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="What was this expense for?" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidBy">Paid by</Label>
                <Select value={paidBy} onValueChange={setPaidBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Who paid?" />
                  </SelectTrigger>
                  <SelectContent>
                    {friends.map(friend => (
                      <SelectItem key={friend.id} value={friend.name}>
                        {friend.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <Select value={group} onValueChange={setGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Friends">Friends</SelectItem>
                    <SelectItem value="Roommates">Roommates</SelectItem>
                    <SelectItem value="Trip">Trip</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Split Type</Label>
                  <Select value={splitType} onValueChange={handleSplitTypeChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="How to split?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Split Equally</SelectItem>
                      <SelectItem value="unequal">Split Unequally</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Split between</Label>
                    <Dialog open={isAddFriendDialogOpen} onOpenChange={setIsAddFriendDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Friend
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add a new friend</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="friendName">Friend's Name</Label>
                            <Input 
                              id="friendName" 
                              placeholder="Enter name" 
                              value={newFriendName}
                              onChange={(e) => setNewFriendName(e.target.value)}
                            />
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={handleAddFriend}
                            disabled={!newFriendName.trim()}
                          >
                            Add Friend
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {participants.map(participant => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`participant-${participant.id}`}
                          checked={participant.isIncluded}
                          onChange={() => handleParticipantToggle(participant.id)}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label 
                          htmlFor={`participant-${participant.id}`}
                          className="text-sm font-medium"
                        >
                          {participant.name}
                        </label>
                      </div>
                      {participant.isIncluded && (
                        splitType === "equal" ? (
                          <span className="text-sm">${participant.share}</span>
                        ) : (
                          <Input
                            type="number"
                            className="w-24"
                            value={participant.share}
                            onChange={(e) => handleShareChange(participant.id, e.target.value)}
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={handleAddExpense}
                  >
                    Save Expense
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddExpense;