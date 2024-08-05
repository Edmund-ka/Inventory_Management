'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase';
import { Box, Button, Stack, TextField, Typography, Paper, SvgIcon, InputBase, styled, alpha} from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc} from "firebase/firestore";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';

const CustomIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 640 512">
    <svg xmlns="http://www.w3.org/2000/svg">
      <path fill="#3a88fe" d="M0 488L0 171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0L599.8 111.9c24.3 9.7 40.2 33.3 40.2 59.4L640 488c0 13.3-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24l0-264c0-17.7-14.3-32-32-32l-384 0c-17.7 0-32 14.3-32 32l0 264c0 13.3-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24zm488 24l-336 0c-13.3 0-24-10.7-24-24l0-56 384 0 0 56c0 13.3-10.7 24-24 24zM128 400l0-64 384 0 0 64-384 0zm0-96l0-80 384 0 0 80-384 0z" />
    </svg>
  </SvgIcon>
);






export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open,setOpen] = useState(false)
  const [filteredInventory, setFilteredInventory] = useState([])
  const [itemName,setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'),item)
    const docSnap = await getDoc(docRef)
    console.log(docSnap);
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
        await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'),item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity === 1){
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredInventory(inventory)
    } else {
      setFilteredInventory(inventory.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    }
  }, [searchQuery, inventory])

  return (
    <Box 
      width="100vw" 
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}

    > 
      <Box >
        <TextField
          id="search-bar"
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          margin="normal"
          sx={{ mb: 2, width: '500px' }} // Adjust margin and width as needed
        />
      </Box>

      
      
      
      <Box display="flex" justifyContent="center" alignItems="center">
        <CustomIcon sx={{ fontSize: 100 }} />
      </Box>
     
    
      <Typography variant="h2">Inventory Management</Typography>
      <Typography variant="body1" sx={{fontSize: '22px', fontWeight: 100}}>Manage and keep track of all items in your inventory</Typography>
      <Box 
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        marginTop="15px"
      >
        <Stack width="100%" direction="row" spacing={2}>
          <TextField 
            id="outlined-basic" 
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)} 
            sx={{width: '900px'}}
          />
          <Button 
            variant="outlined"
            onClick={() => {
              if (itemName.trim()) {
                addItem(itemName);
                setItemName('');
              }
            }}
          >Add item</Button>
        </Stack>
      </Box>
      
      <Box 
        width="100%" 
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{pb: "20px", mt: "30px"}}
      >
        {filteredInventory.map(({name, quantity}) => (
          
          <Paper elevation={3} key={name} sx={{width: "70%", mb: 2}}>
            <Box 
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding={2}
              gap={2}
            >
              <Typography variant="h5" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h5" color="#333" textAlign="center">
                {quantity}
              </Typography>

              <Box>
                <Button 
                  onClick={() => {
                    addItem(name)
                  }}
                >
                  <AddCircleIcon></AddCircleIcon>
                </Button>

                <Button
                  onClick={() => {
                    removeItem(name)
                  }}
                >
                  <DeleteOutlineIcon></DeleteOutlineIcon>
                </Button>
              </Box>

              
            </Box>
          </Paper>
        
          
        ))}
      </Box>

      
      
      
    </Box>

  )  
}


