'use client'
import Image from "next/image";
import { useState, useEffect } from "react"
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [search, setSearch] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'Inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })

    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'Inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'Inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
                console.log(itemName)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box flexDirection="row"
        sx={{
          width: { xs: "100vw", md: "800px" }
        }}
        justifyContent="space-between"
        space-between={5}
        display="flex">
        <TextField placeholder="Search Inventory"
          onChange={(e) => {
            setSearch(e.target.value)
          }}>

        </TextField>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add New Item
        </Button>
      </Box>
      <Box
        border="2px solid #333"
        sx={{
          width: { xs: "100vw", md: "800px" }
        }
        }>
        <Box
          // width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column">
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
          <Box
            // sx={{
            //   width: { xs: "100vw", md: "800px" }
            // }}
            width="100%"
            px={2}
            height="30px"
            bgcolor="#bec3bf"
            justifyContent="space-between"
            flexDirection="row"
            alignItems="center"
            display="flex"
          >
            <Typography variant="h6"
              fontStyle="italic"
              color="#333"
              textAlign="center">Name</Typography>
            <Typography variant="h6"
              fontStyle="italic"
              color="#333"
              textAlign="center">Quantity</Typography>
            <Typography variant="h6"
              fontStyle="italic"
              color="#333"
              textAlign="center">Modify</Typography>
          </Box>
        </Box>

        <Stack
          // width="800px"
          height="300px"
          spacing={2}
          overflow="auto">
          {
            inventory.filter((item) => {
              return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search)
            }).map(({ name, quantity }) => (
              <Box key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Typography variant="h3"
                  color="#333"
                  textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3"
                  color="#333"
                  textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained"
                    onClick={() => (addItem(name))}>
                    Add
                  </Button>
                  <Button variant="contained"
                    onClick={() => (removeItem(name))}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  )
}