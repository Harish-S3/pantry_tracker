'use client';
import Image from "next/image";
import { useState,useEffect } from "react";
import { Firestore } from "firebase/firestore";
import { Box,Typography } from "@mui/material";

export default function Home() {
  const [inventory,setInventory]=useState([])
  const [open,setOpen]=useState(false)
  const [itemName,setItemName]=useState('')
  
  return (
    <box>
      <Typography variant="h1">Inventory Management </Typography>
    </box>

  )
}
