import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Plus, Minus, ShoppingCart } from 'lucide-react';

const menuItems = [
  { id: 1, name: "Club Sandwich", price: 12.50, category: "Sandwiches", image: "https://placehold.co/600x400/F5F5F5/333333?text=Sandwich" },
  { id: 2, name: "Caesar Salad", price: 10.00, category: "Salads", image: "https://placehold.co/600x400/F5F5F5/333333?text=Salad" },
  { id: 3, name: "Margherita Pizza", price: 15.00, category: "Pizzas", image: "https://placehold.co/600x400/F5F5F5/333333?text=Pizza" },
  { id: 4, name: "Spaghetti Bolognese", price: 14.00, category: "Pasta", image: "https://placehold.co/600x400/F5F5F5/333333?text=Pasta" },
  { id: 5, name: "Soft Drink", price: 3.00, category: "Beverages", image: "https://placehold.co/600x400/F5F5F5/333333?text=Drink" },
  { id: 6, name: "Fresh Orange Juice", price: 5.00, category: "Beverages", image: "https://placehold.co/600x400/F5F5F5/333333?text=Juice" },
];

export default function FoodOrderPage() {
  const [cart, setCart] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId, amount) => {
    setCart((prevCart) => {
        const updatedCart = prevCart.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: item.quantity + amount };
            }
            return item;
        }).filter(item => item.quantity > 0);
        return updatedCart;
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = () => {
    if (!roomNumber) {
      alert("Please enter a room number.");
      return;
    }
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    alert(`Order placed for room ${roomNumber}! Total: $${total.toFixed(2)}`);
    setCart([]);
    setRoomNumber("");
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Food Ordering</h1>
        <p className="text-sm text-muted-foreground">Order food directly to your room.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                    <div className="relative">
                        <img src={item.image} alt={item.name} className="w-full h-40 object-cover transform transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-lg">${item.price.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter>
                    <Button className="w-full" onClick={() => addToCart(item)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add to Order
                    </Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
        </div>
        <div className="lg:col-span-1">
            <div className="sticky top-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-1.5 mb-4">
                            <Label htmlFor="room-number">Room Number</Label>
                            <Input id="room-number" type="text" placeholder="Enter your room number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
                        </div>
                        {cart.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className='text-center'>Qty</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cart.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-center">
                                                <div className='flex items-center justify-center gap-2'>
                                                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, -1)}><Minus className='h-4 w-4'/></Button>
                                                    <span>{item.quantity}</span>
                                                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, 1)}><Plus className='h-4 w-4'/></Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={2} className="font-bold">Total</TableCell>
                                        <TableCell className="text-right font-bold text-lg">${total.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                                <p className="mt-4 text-muted-foreground">Your cart is empty</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button variant="default" size="lg" onClick={placeOrder} className="w-full" disabled={cart.length === 0}>Place Order</Button>
                        <Button variant="outline" onClick={() => setCart([])} disabled={cart.length === 0} className="w-full">Clear Cart</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      </div>
    </>
  );
}
