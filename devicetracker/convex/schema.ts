import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  devices: defineTable({
    deviceId: v.string(),
    name: v.string(),
    status: v.union(v.literal("running"), v.literal("offline"), v.literal("idle")),
    latitude: v.number(),
    longitude: v.number(),
    speed: v.optional(v.number()),
    battery: v.optional(v.number()),
    lastUpdate: v.number(),
    createdAt: v.number(),
  }).index("by_deviceId", ["deviceId"]),
});
