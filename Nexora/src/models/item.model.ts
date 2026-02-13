import { model, models, Schema, Types } from "mongoose";

export interface ItemInterface {
    _id : Types.ObjectId;
    name: string;
    category: ItemCategory;
    price: string;
    unit: string;
    image: string;
    amount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum ItemCategory {
  FRUITS_VEG = "Fruits & Vegetables",
  DAIRY = "Dairy, Bread & Eggs",
  SNACKS = "Snacks & Munchies",
  BEVERAGES = "Cold Drinks & Juices",
  SWEETS = "Ice Cream & Sweets",
  INSTANT = "Instant & Frozen Food",
  BREAKFAST = "Tea, Coffee & Breakfast",
  BAKERY = "Bakery & Biscuits",
  MEAT = "Meat, Fish & Seafood",
  HYGIENE = "Bath & Body",
  CLEANING = "Cleaning Essentials",
  BABY = "Baby Care",
  HEALTH = "Health & Wellness",
  PETS = "Pet Supplies",
  OFFICE = "Stationery & Office"
}

const itemSchema = new Schema<ItemInterface>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum : Object.values(ItemCategory),
        default: ItemCategory.FRUITS_VEG
    },
    price: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },

},{timestamps:true})

const Item = models.Item || model("Item",itemSchema);

export default Item;