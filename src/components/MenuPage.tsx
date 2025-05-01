import { useState } from 'react'
import { useUserAuth } from '../context/userAuthContext'
import { Button, Label, Textarea, TextInput } from 'flowbite-react'
import { useMenuData, MenuItem as MenuItemType } from '../hooks/useMenuData'
import Cart from './Cart'
import MenuItem from './MenuItem'
import FloatingTimerButton from './FloatingTimerButton'

function MenuPage() {
  const { isAdmin } = useUserAuth()
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuData()

  const [showDialog, setShowDialog] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editId, setEditId] = useState<string>('')

  const [form, setForm] = useState<Omit<MenuItemType, 'firestoreId'>>({
    id: '',
    ProductName: '',
    Price: 0,
    description: '',
  })

  const openAdd = () => {
    setForm({ id: '', ProductName: '', Price: 0, description: '' })
    setEditing(false)
    setShowDialog(true)
  }

  const openEdit = (item: MenuItemType) => {
    setForm({
      id: item.id,
      ProductName: item.ProductName,
      Price: item.Price,
      description: item.description,
    })
    setEditId(item.firestoreId)
    setEditing(true)
    setShowDialog(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await updateMenuItem(editId, form)
      } else {
        await addMenuItem(form)
      }
      setShowDialog(false)
    } catch (err) {
      console.error('Error saving menu item:', err)
    }
  }

  const handleDelete = async (firestoreId: string) => {
    try {
      await deleteMenuItem(firestoreId)
    } catch (err) {
      console.error('Error deleting menu item:', err)
    }
  }

  return (
    <div className="main-background">
      <h1 className="flex justify-center">
        {isAdmin ? 'View: Admin' : 'Menu'}
      </h1>

      {isAdmin && (
        <div className="flex justify-center mt-6">
          <Button onClick={openAdd} className="my-button">
            <span className="text-[#f4e9e1]">Add Bubble Tea</span>
          </Button>
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-[#e4d4c8] p-6 rounded-md w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-[#362314]">
              {editing ? 'Edit' : 'Add'} Bubble Tea
            </h2>
            <Label className="p-2 text-[#362314]">Image id</Label>
            <TextInput
              placeholder="Image ID"
              className="mb-2"
              value={form.id}
              onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
            />

            <Label className="p-2 text-[#362314]">Product name</Label>
            <TextInput
              placeholder="Product name"
              className="mb-2"
              value={form.ProductName}
              onChange={e =>
                setForm(f => ({ ...f, ProductName: e.target.value }))
              }
            />

            <Label className="p-2 text-[#362314]">Price</Label>
            <TextInput
              placeholder="Price"
              className="mb-2"
              value={form.Price}
              onChange={e =>
                setForm(f => ({ ...f, Price: Number(e.target.value) }))
              }
            />

            <Label className="p-2 text-[#362314]">Description</Label>
            <Textarea
              placeholder="Description"
              className="mb-4"
              value={form.description}
              onChange={e =>
                setForm(f => ({ ...f, description: e.target.value }))
              }
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowDialog(false)} className="my-button">
                <span className="text-[#f4e9e1]">Cancel</span>
              </Button>
              <Button onClick={handleSave} className="my-pretty-button">
                <span className="text-[#f4e9e1]">
                  {editing ? 'Save Changes' : 'Add'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="mb-[45px]">
        <div className="container mx-auto px-4 mt-8 flex flex-wrap gap-4 justify-center">
          {menuItems.map(item => (
            <div className="max-w-sm" key={item.firestoreId}>
              <MenuItem
                {...item}
                isAdmin={isAdmin}
                onEdit={() => openEdit(item)}
                onDelete={() => handleDelete(item.firestoreId)}
              />
            </div>
          ))}
        </div>

        <Cart />
        <FloatingTimerButton />
      </main>
    </div>
  )
}

export default MenuPage
