import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, DollarSign, UserRound, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useExpenseContext } from "./AddExpense";

const Balances = () => {
  const navigate = useNavigate();
  const { calculateBalances, generateSettlements } = useExpenseContext();
  
  // Get balances from the context
  const balances = calculateBalances();
  
  // Get settlement suggestions from the context
  const [settlements, setSettlements] = React.useState(generateSettlements());

  const totalOwed = balances.reduce((sum, balance) => 
    balance.amount > 0 ? sum + balance.amount : sum, 0);
  
  const totalOwe = balances.reduce((sum, balance) => 
    balance.amount < 0 ? sum + Math.abs(balance.amount) : sum, 0);

  const handleSettleUp = (settlementId) => {
    // In a real app, you would mark this settlement as complete
    // and update the balances accordingly
    
    // For this demo, we'll just remove the settlement from the list
    setSettlements(settlements.filter(s => s.id !== settlementId));
    
    toast({
      title: "Marked as settled",
      description: "The balance has been marked as settled",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Balances</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Total owed to you</p>
                <p className="text-2xl font-bold text-green-600">${totalOwed.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <DollarSign className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Total you owe</p>
                <p className="text-2xl font-bold text-red-600">${totalOwe.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <UserRound className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Net balance</p>
                <p className={`text-2xl font-bold ${totalOwed - totalOwe > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(totalOwed - totalOwe).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="balances" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="balances">Friend Balances</TabsTrigger>
            <TabsTrigger value="settlements">Settlement Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="balances" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Individual Balances</CardTitle>
              </CardHeader>
              <CardContent>
                {balances.length > 0 ? (
                  <div className="space-y-4">
                    {balances.map((balance) => (
                      <div key={balance.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-sm font-medium">{balance.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium">{balance.name}</span>
                        </div>
                        <div className={`font-semibold ${balance.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {balance.amount > 0 ? (
                            <span>owes you ${balance.amount.toFixed(2)}</span>
                          ) : (
                            <span>you owe ${Math.abs(balance.amount).toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No balances to display. Add some expenses first!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settlements" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Settlements</CardTitle>
              </CardHeader>
              <CardContent>
                {settlements.length > 0 ? (
                  <div className="space-y-4">
                    {settlements.map((settlement) => (
                      <div key={settlement.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {settlement.from} pays {settlement.to}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${settlement.amount.toFixed(2)}
                          </p>
                        </div>
                        {settlement.from === "You" ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSettleUp(settlement.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            I paid
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSettleUp(settlement.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Received
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">All settled up! No payments needed.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settlement Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <span>The settlement plan minimizes the number of transactions needed.</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <span>Click "I paid" or "Received" after completing a payment.</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <span>You can use Venmo, PayPal, or cash to settle up with friends.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Balances;