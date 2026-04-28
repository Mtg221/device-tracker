import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("devices").collect();
  },
});

export const getById = query({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("devices")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .first();
  },
});

export const updateLocation = mutation({
  args: {
    deviceId: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    speed: v.optional(v.number()),
    battery: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const device = await ctx.db
      .query("devices")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .first();

    if (device) {
      await ctx.db.patch(device._id, {
        latitude: args.latitude,
        longitude: args.longitude,
        speed: args.speed,
        battery: args.battery,
        lastUpdate: Date.now(),
        status: "running",
      });
    } else {
      await ctx.db.insert("devices", {
        deviceId: args.deviceId,
        name: `Device ${args.deviceId}`,
        latitude: args.latitude,
        longitude: args.longitude,
        speed: args.speed,
        battery: args.battery,
        lastUpdate: Date.now(),
        createdAt: Date.now(),
        status: "running",
      });
    }
  },
});

export const updateStatus = mutation({
  args: {
    deviceId: v.string(),
    status: v.union(v.literal("running"), v.literal("offline"), v.literal("idle")),
  },
  handler: async (ctx, args) => {
    const device = await ctx.db
      .query("devices")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .first();

    if (device) {
      await ctx.db.patch(device._id, { status: args.status });
    }
  },
});
