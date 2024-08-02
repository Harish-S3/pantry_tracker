'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { Firestore, collection, query, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Box, TextField, Typography, Modal, Stack, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { firestore } from "@/firebase";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editQuantity, setEditQuantity] = useState({});

  const updateInventory = async () => {
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
  };

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      await updateDoc(docRef, { quantity: existingQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
  };

  const updateItemQuantity = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await updateDoc(docRef, { quantity });
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName('');
    setItemQuantity(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={2}
      bgcolor="#f5f5f5"
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #1976d2"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6" color="#1976d2">Add Item</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth 
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth 
              type="number"
              label="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                addItem(itemName, itemQuantity);
                handleClose();
              }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h2" mb={2} color="#1976d2">Inventory Management</Typography>
      <Box mb={4}>
        <TextField
          variant="outlined"
          label="Search Items"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 4 }}>Add Item</Button>
      <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#1976d2', color: 'white' }}>Item Name</TableCell>
              <TableCell align="right" style={{ backgroundColor: '#1976d2', color: 'white' }}>Quantity</TableCell>
              <TableCell align="right" style={{ backgroundColor: '#1976d2', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.name}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    value={editQuantity[item.name] ?? item.quantity}
                    onChange={(e) => setEditQuantity({
                      ...editQuantity,
                      [item.name]: Number(e.target.value)
                    })}
                    onBlur={() => {
                      if (editQuantity[item.name] !== undefined) {
                        updateItemQuantity(item.name, editQuantity[item.name]);
                      }
                    }}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button variant="outlined" color="secondary" onClick={() => removeItem(item.name)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
