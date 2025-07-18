const express = require("express")
const slugify = require("slugify")
const { connectTenantDB } = require("../config/db")
const categorySchema = require("../models/Category")
const auth = require("../middleware/authMiddleware")

const router = express.Router()

router.use(auth) // Apply auth middleware to all category routes

const getDb = async (tenantId) => {
  const dbName = `tenant_${tenantId.toLowerCase()}`
  return await connectTenantDB(dbName)
}

// ➕ Create Category
router.post("/", async (req, res) => {
  try {
    const tenantDb = await getDb(req.tenantId)
    const Category = tenantDb.model("Category", categorySchema)

    const category = new Category({
      ...req.body,
      slug: slugify(req.body.name, { lower: true, strict: true }), // Added strict: true for better slugs
      storeId: req.storeId,
    })

    await category.save()
    res.status(201).json({ message: "Category created", category })
  } catch (error) {
    console.error("Error creating category:", error)
    res.status(500).json({ message: "Error creating category", error: error.message })
  }
})

// 📥 Get All Categories
router.get("/", async (req, res) => {
  try {
    const tenantDb = await getDb(req.tenantId)
    const Category = tenantDb.model("Category", categorySchema)

    const categories = await Category.find({ storeId: req.storeId })
    res.status(200).json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ message: "Error fetching categories", error: error.message })
  }
})

// 📝 Update Category
router.put("/:id", async (req, res) => {
  try {
    const tenantDb = await getDb(req.tenantId)
    const Category = tenantDb.model("Category", categorySchema)

    const { name, ...updateData } = req.body
    if (name) {
      updateData.slug = slugify(name, { lower: true, strict: true })
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...updateData, storeId: req.storeId }, // Ensure storeId is not changed and is part of the query if needed
      { new: true, runValidators: true }, // runValidators ensures schema validations run on update
    )

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({ message: "Category updated", category })
  } catch (error) {
    console.error("Error updating category:", error)
    res.status(500).json({ message: "Error updating category", error: error.message })
  }
})

// ❌ Delete Category
router.delete("/:id", async (req, res) => {
  try {
    const tenantDb = await getDb(req.tenantId)
    const Category = tenantDb.model("Category", categorySchema)

    const result = await Category.findByIdAndDelete(req.params.id)

    if (!result) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({ message: "Category deleted" })
  } catch (error) {
    console.error("Error deleting category:", error)
    res.status(500).json({ message: "Error deleting category", error: error.message })
  }
})

module.exports = router
