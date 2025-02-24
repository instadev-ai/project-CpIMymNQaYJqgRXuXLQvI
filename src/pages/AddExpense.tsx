import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AddExpense = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paidBy, setPaidBy] = useState("You");
  const [friends, setFriends] = useState([
    { id: 1, name: "Alex", share: 0 },
    { id: 2, name: "Jamie", share: 0 },
    { id: 3, name: "Taylor", share: 0 },
    { id: 4, name: "You", share: 0 },
  ]);
  const [splitType, setSplitType] = useState("equal");

  const handleSplitTypeChange = (value) => {
    setSplitType(value);
    
    if (value === "equal") {
      const equalShare = amount ? parseFloat(amount) / friends.length : 0;
      setFriends(friends.map(friend => ({
        ...friend,
        share: equalShare.toFixed(2)
      })));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (splitType === "equal" && value) {
      const equalShare = parseFloat(value) / friends.length;
      setFriends(friends.map(friend => ({
        ...friend,
        share: equalShare.toFixed(2)
      })));
    }
  };

  const handleShareChange = (id, value) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, share: value } : friend
    ));
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

    // Validate that shares add up to total
    if (splitType === "unequal") {
      const totalShares = friends.reduce((sum, friend) => sum + parseFloat(friend.share || 0), 0);
      if (Math.abs(totalShares - parseFloat(amount)) > 0.01) {
        toast({
          title: "Invalid shares",
          description: "The sum of shares must equal the total amount",
          variant: "destructive"
        });
        return;
      }
    }

    // Here you would save the expense to your state/database
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
                  <Label>Split between</Label>
                  {friends.map(friend => (
                    <div key={friend.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{friend.name}</span>
                      {splitType === "equal" ? (
                        <span className="text-sm">${friend.share}</span>
                      ) : (
                        <Input
                          type="number"
                          className="w-24"
                          value={friend.share}
                          onChange={(e) => handleShareChange(friend.id, e.target.value)}
                        />
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