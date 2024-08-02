'use client';
import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal } from '@mui/material';
import { Firestore, collection, query, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(1);

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error updating inventory: ", error);
    }
  };

  const addItem = async (item, quantity) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity: currentQuantity } = docSnap.data();
        await updateDoc(docRef, { quantity: currentQuantity + quantity });
      } else {
        await setDoc(docRef, { quantity });
      }
      await updateInventory();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity > 1) {
        await updateDoc(docRef, { quantity: quantity - 1 });
      } else if (quantity === 1) {
        await deleteDoc(docRef);
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
      sx={{
        backgroundColor: '#f0f4f7',
        minHeight: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h4" mb={2} sx={{ color: '#1976d2' }}>Inventory Management</Typography>

      <Box mb={2} width="100%" maxWidth="600px">
        <TextField
          variant="outlined"
          label="Search Items"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          sx={{
            backgroundColor: '#fff',
            borderRadius: '4px',
          }}
        />
      </Box>

      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#155a9a',
            },
          }}
        >
          Add Item
        </Button>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          borderRadius={2}
        >
          <Typography variant="h6" mb={2}>Add Item</Typography>
          <TextField
            variant="outlined"
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            variant="outlined"
            label="Quantity"
            type="number"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (itemName.trim() !== '' && itemQuantity > 0) {
                addItem(itemName, itemQuantity);
                setItemName('');
                setItemQuantity(1);
                setOpen(false);
              }
            }}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#155a9a',
              },
            }}
          >
            Add Item
          </Button>
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ maxWidth: '90%', marginBottom: 2 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
              }}
            >
              <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Item</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#fff' }}>Quantity</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#fff' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.name}>
                <TableCell component="th" scope="row">{item.name}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => addItem(item.name, 1)}>+</Button>
                  <Button onClick={() => removeItem(item.name)}>-</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
